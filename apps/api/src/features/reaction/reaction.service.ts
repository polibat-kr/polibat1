/**
 * Reaction Service
 * 반응(좋아요/싫어요) 비즈니스 로직 처리
 */

import { PrismaClient, ReactionType, ReactionTargetType } from '@prisma/client';
import { ReactionRepository } from './reaction.repository';
import {
  CreateReactionDto,
  ReactionResponseDto,
  ReactionStatsDto,
  GetReactionsQueryDto,
  ReactionListResponseDto,
} from './reaction.dto';

const prisma = new PrismaClient();

export class ReactionService {
  /**
   * 반응 추가 또는 변경
   *
   * 로직:
   * 1. targetId (postId/commentId)로 UUID 조회
   * 2. 기존 반응이 있는지 확인
   * 3. 없으면 새로 생성, 있으면:
   *    - 같은 타입이면 삭제 (토글)
   *    - 다른 타입이면 변경 (LIKE ↔ DISLIKE)
   * 4. 카운트 업데이트
   */
  static async addOrUpdateReaction(
    userId: string,
    dto: CreateReactionDto
  ): Promise<{ action: 'created' | 'updated' | 'deleted'; reaction?: ReactionResponseDto }> {
    const { targetType, targetId, reactionType } = dto;

    // 1. targetId로 실제 UUID 조회
    const targetUuid = await this.getTargetUuid(targetType, targetId);
    if (!targetUuid) {
      throw new Error(`${targetType} not found: ${targetId}`);
    }

    // 2. 기존 반응 확인
    const existingReaction = await ReactionRepository.findExistingReaction(
      userId,
      targetType,
      targetUuid
    );

    let result: { action: 'created' | 'updated' | 'deleted'; reaction?: any };

    if (!existingReaction) {
      // 3-1. 새로운 반응 생성
      const newReaction = await ReactionRepository.create(
        userId,
        targetType,
        targetUuid,
        reactionType
      );
      result = { action: 'created', reaction: newReaction };
    } else if (existingReaction.reactionType === reactionType) {
      // 3-2. 같은 반응 → 삭제 (토글)
      await ReactionRepository.delete(existingReaction.id);
      result = { action: 'deleted' };
    } else {
      // 3-3. 다른 반응 → 변경
      const updatedReaction = await ReactionRepository.updateReactionType(
        existingReaction.id,
        reactionType
      );
      result = { action: 'updated', reaction: updatedReaction };
    }

    // 4. 카운트 업데이트
    await ReactionRepository.updateTargetCounts(targetType, targetUuid);

    // 5. 응답 포맷팅
    if (result.reaction) {
      return {
        action: result.action as 'created' | 'updated',
        reaction: await this.formatReactionResponse(result.reaction),
      };
    }

    return { action: 'deleted' };
  }

  /**
   * 반응 삭제
   */
  static async deleteReaction(reactionId: string, userId: string): Promise<void> {
    const reaction = await ReactionRepository.findById(reactionId);

    if (!reaction) {
      throw new Error('Reaction not found');
    }

    // 권한 확인: 본인만 삭제 가능
    if (reaction.userId !== userId) {
      throw new Error('Unauthorized to delete this reaction');
    }

    await ReactionRepository.delete(reactionId);

    // 카운트 업데이트
    const targetUuid = reaction.postId || reaction.commentId;
    if (targetUuid) {
      await ReactionRepository.updateTargetCounts(reaction.targetType, targetUuid);
    }
  }

  /**
   * 대상별 반응 목록 조회
   */
  static async getReactionsByTarget(
    targetType: ReactionTargetType,
    targetId: string,
    query: GetReactionsQueryDto,
    userId?: string
  ): Promise<ReactionListResponseDto> {
    const { page = 1, limit = 20 } = query;

    // targetId로 UUID 조회
    const targetUuid = await this.getTargetUuid(targetType, targetId);
    if (!targetUuid) {
      throw new Error(`${targetType} not found: ${targetId}`);
    }

    // 반응 목록 조회
    const { reactions, total } = await ReactionRepository.findByTarget(
      targetType,
      targetUuid,
      query
    );

    // 통계 조회
    const stats = await ReactionRepository.getStats(targetType, targetUuid, userId);

    // 응답 포맷팅
    const formattedReactions = await Promise.all(
      reactions.map((r) => this.formatReactionResponse(r))
    );

    return {
      reactions: formattedReactions,
      stats: {
        targetType,
        targetId, // 원래의 postId/commentId
        ...stats,
      },
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 반응 통계 조회
   */
  static async getReactionStats(
    targetType: ReactionTargetType,
    targetId: string,
    userId?: string
  ): Promise<ReactionStatsDto> {
    // targetId로 UUID 조회
    const targetUuid = await this.getTargetUuid(targetType, targetId);
    if (!targetUuid) {
      throw new Error(`${targetType} not found: ${targetId}`);
    }

    const stats = await ReactionRepository.getStats(targetType, targetUuid, userId);

    return {
      targetType,
      targetId,
      ...stats,
    };
  }

  /**
   * targetId (postId/commentId)로 UUID 조회
   */
  private static async getTargetUuid(
    targetType: ReactionTargetType,
    targetId: string
  ): Promise<string | null> {
    if (targetType === 'POST') {
      const post = await prisma.post.findUnique({
        where: { postId: targetId },
        select: { id: true },
      });
      return post?.id || null;
    } else {
      const comment = await prisma.comment.findUnique({
        where: { commentId: targetId },
        select: { id: true },
      });
      return comment?.id || null;
    }
  }

  /**
   * 반응 응답 포맷팅 (UUID → postId/commentId 변환)
   */
  private static async formatReactionResponse(reaction: any): Promise<ReactionResponseDto> {
    let targetId: string;

    if (reaction.targetType === 'POST' && reaction.postId) {
      const post = await prisma.post.findUnique({
        where: { id: reaction.postId },
        select: { postId: true },
      });
      targetId = post?.postId || reaction.postId;
    } else if (reaction.targetType === 'COMMENT' && reaction.commentId) {
      const comment = await prisma.comment.findUnique({
        where: { id: reaction.commentId },
        select: { commentId: true },
      });
      targetId = comment?.commentId || reaction.commentId;
    } else {
      targetId = reaction.postId || reaction.commentId;
    }

    return {
      id: reaction.id,
      userId: reaction.userId,
      targetType: reaction.targetType,
      targetId,
      reactionType: reaction.reactionType,
      createdAt: reaction.createdAt,
      user: reaction.user
        ? {
            memberId: reaction.user.memberId,
            nickname: reaction.user.nickname,
          }
        : undefined,
    };
  }
}
