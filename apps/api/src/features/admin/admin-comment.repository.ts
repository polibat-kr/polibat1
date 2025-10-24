/**
 * Admin Comment Management Repository
 *
 * @description
 * - 댓글 관리 DB 접근 레이어
 * - Prisma 쿼리 실행
 */

import { PrismaClient, Prisma, CommentStatus } from '@prisma/client';
import type {
  GetCommentsQueryDto,
  CommentListItemDto,
  UpdateCommentStatusRequestDto,
} from './admin-comment.dto';

export class AdminCommentRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * 댓글 목록 조회 (페이지네이션, 필터링, 정렬)
   */
  async getComments(query: GetCommentsQueryDto): Promise<{
    comments: CommentListItemDto[];
    total: number;
  }> {
    const {
      page = 1,
      limit = 20,
      search,
      postId,
      authorId,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      startDate,
      endDate,
    } = query;

    const skip = (page - 1) * limit;
    const take = limit;

    // WHERE 조건 구성
    const where: Prisma.CommentWhereInput = {};

    // 검색 조건 (내용, 작성자 닉네임)
    if (search) {
      where.OR = [
        { content: { contains: search, mode: 'insensitive' } },
        { author: { nickname: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // 게시글 필터
    if (postId) {
      where.postId = postId;
    }

    // 작성자 필터
    if (authorId) {
      where.authorId = authorId;
    }

    // 상태 필터
    if (status) {
      where.status = status;
    }

    // 날짜 필터
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        const dateStart = new Date(startDate);
        dateStart.setHours(0, 0, 0, 0);
        where.createdAt.gte = dateStart;
      }
      if (endDate) {
        const dateEnd = new Date(endDate);
        dateEnd.setHours(23, 59, 59, 999);
        where.createdAt.lte = dateEnd;
      }
    }

    // 정렬 조건
    const orderBy: Prisma.CommentOrderByWithRelationInput = {};
    if (sortBy === 'likeCount') {
      orderBy.likeCount = sortOrder;
    } else {
      orderBy[sortBy] = sortOrder;
    }

    // 병렬 조회 (데이터 + 총 개수)
    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              nickname: true,
              memberType: true,
            },
          },
          post: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),
      this.prisma.comment.count({ where }),
    ]);

    // 댓글 ID 목록 추출
    const commentIds = comments.map((comment) => comment.id);

    // 좋아요/싫어요 수 집계
    const reactions = await this.prisma.reaction.groupBy({
      by: ['commentId', 'reactionType'],
      where: {
        commentId: { in: commentIds },
      },
      _count: { id: true },
    });

    // Map으로 변환
    const reactionMap = new Map<
      string,
      { likeCount: number; dislikeCount: number }
    >();
    commentIds.forEach((id) => {
      reactionMap.set(id, { likeCount: 0, dislikeCount: 0 });
    });
    reactions.forEach((item) => {
      if (item.commentId) {
        const counts = reactionMap.get(item.commentId);
        if (counts) {
          if (item.reactionType === 'LIKE') {
            counts.likeCount = item._count.id;
          } else if (item.reactionType === 'DISLIKE') {
            counts.dislikeCount = item._count.id;
          }
        }
      }
    });

    // DTO 매핑
    const commentDtos: CommentListItemDto[] = comments.map((comment) => {
      const counts = reactionMap.get(comment.id) || {
        likeCount: 0,
        dislikeCount: 0,
      };
      return {
        id: comment.id,
        commentId: comment.commentId,
        postId: comment.postId,
        postTitle: comment.post.title,
        status: comment.status,
        content: comment.content,
        authorId: comment.authorId,
        authorNickname: comment.author.nickname,
        authorMemberType: comment.author.memberType,
        likeCount: counts.likeCount,
        dislikeCount: counts.dislikeCount,
        reportCount: comment.reportCount,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        deletedAt: comment.deletedAt,
      };
    });

    return { comments: commentDtos, total };
  }

  /**
   * 댓글 상태 변경
   */
  async updateCommentStatus(
    commentId: string,
    data: UpdateCommentStatusRequestDto,
    _adminId: string,
  ): Promise<{
    id: string;
    commentId: string;
    previousStatus: CommentStatus;
    currentStatus: CommentStatus;
  }> {
    // 기존 댓글 조회
    const comment = await this.prisma.comment.findFirst({
      where: { commentId },
      select: { id: true, commentId: true, status: true },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    const previousStatus = comment.status;
    const currentStatus = data.status;

    // 상태 변경
    await this.prisma.comment.update({
      where: { id: comment.id },
      data: {
        status: currentStatus,
        deletedAt: currentStatus === 'DELETED' ? new Date() : null,
      },
    });

    return {
      id: comment.id,
      commentId: comment.commentId,
      previousStatus,
      currentStatus,
    };
  }

  /**
   * 댓글 삭제 (Soft Delete)
   */
  async deleteComment(
    commentId: string,
    _adminId: string,
  ): Promise<{
    id: string;
    commentId: string;
    deletedAt: Date;
  }> {
    const comment = await this.prisma.comment.findFirst({
      where: { commentId },
      select: { id: true, commentId: true },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    await this.prisma.comment.update({
      where: { id: comment.id },
      data: {
        status: 'DELETED',
        deletedAt: new Date(),
      },
    });

    return {
      id: comment.id,
      commentId: comment.commentId,
      deletedAt: new Date(),
    };
  }
}
