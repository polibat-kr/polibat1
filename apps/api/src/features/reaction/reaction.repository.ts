/**
 * Reaction Repository
 * 반응(좋아요/싫어요) 데이터베이스 접근 레이어
 */

import { PrismaClient, Reaction, ReactionType, ReactionTargetType } from '@prisma/client';
import { GetReactionsQueryDto } from './reaction.dto';

const prisma = new PrismaClient();

export class ReactionRepository {
  /**
   * 기존 반응 조회 (사용자 + 대상)
   */
  static async findExistingReaction(
    userId: string,
    targetType: ReactionTargetType,
    targetId: string // UUID
  ): Promise<Reaction | null> {
    const where: any = {
      userId,
      targetType,
    };

    if (targetType === 'POST') {
      where.postId = targetId;
    } else {
      where.commentId = targetId;
    }

    return prisma.reaction.findFirst({ where });
  }

  /**
   * 반응 생성
   */
  static async create(
    userId: string,
    targetType: ReactionTargetType,
    targetId: string, // UUID
    reactionType: ReactionType
  ): Promise<Reaction> {
    const data: any = {
      userId,
      targetType,
      reactionType,
    };

    if (targetType === 'POST') {
      data.postId = targetId;
    } else {
      data.commentId = targetId;
    }

    return prisma.reaction.create({ data });
  }

  /**
   * 반응 업데이트 (LIKE ↔ DISLIKE 변경)
   */
  static async updateReactionType(
    reactionId: string,
    reactionType: ReactionType
  ): Promise<Reaction> {
    return prisma.reaction.update({
      where: { id: reactionId },
      data: { reactionType },
    });
  }

  /**
   * 반응 삭제
   */
  static async delete(reactionId: string): Promise<Reaction> {
    return prisma.reaction.delete({
      where: { id: reactionId },
    });
  }

  /**
   * ID로 반응 조회
   */
  static async findById(reactionId: string): Promise<Reaction | null> {
    return prisma.reaction.findUnique({
      where: { id: reactionId },
    });
  }

  /**
   * 대상별 반응 목록 조회
   */
  static async findByTarget(
    targetType: ReactionTargetType,
    targetId: string, // UUID
    query: GetReactionsQueryDto
  ) {
    const { reactionType, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = { targetType };

    if (targetType === 'POST') {
      where.postId = targetId;
    } else {
      where.commentId = targetId;
    }

    if (reactionType) {
      where.reactionType = reactionType;
    }

    const [reactions, total] = await Promise.all([
      prisma.reaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              memberId: true,
              nickname: true,
            },
          },
        },
      }),
      prisma.reaction.count({ where }),
    ]);

    return { reactions, total };
  }

  /**
   * 대상별 반응 통계 조회
   */
  static async getStats(targetType: ReactionTargetType, targetId: string, userId?: string) {
    const where: any = { targetType };

    if (targetType === 'POST') {
      where.postId = targetId;
    } else {
      where.commentId = targetId;
    }

    const [likeCount, dislikeCount, userReaction] = await Promise.all([
      prisma.reaction.count({
        where: { ...where, reactionType: 'LIKE' },
      }),
      prisma.reaction.count({
        where: { ...where, reactionType: 'DISLIKE' },
      }),
      userId
        ? prisma.reaction.findFirst({
            where: { ...where, userId },
            select: { reactionType: true },
          })
        : Promise.resolve(null),
    ]);

    return {
      likeCount,
      dislikeCount,
      totalCount: likeCount + dislikeCount,
      userReaction: userReaction?.reactionType || null,
    };
  }

  /**
   * 게시글/댓글의 likeCount/dislikeCount 업데이트
   */
  static async updateTargetCounts(
    targetType: ReactionTargetType,
    targetId: string // UUID
  ): Promise<void> {
    const stats = await this.getStats(targetType, targetId);

    if (targetType === 'POST') {
      await prisma.post.update({
        where: { id: targetId },
        data: {
          likeCount: stats.likeCount,
          dislikeCount: stats.dislikeCount,
        },
      });
    } else {
      await prisma.comment.update({
        where: { id: targetId },
        data: {
          likeCount: stats.likeCount,
          dislikeCount: stats.dislikeCount,
        },
      });
    }
  }
}
