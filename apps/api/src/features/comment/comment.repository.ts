import { PrismaClient, Comment, Prisma } from '@prisma/client';
import { GetCommentsQueryDto, CreateCommentRequestDto, UpdateCommentRequestDto } from './comment.dto';

const prisma = new PrismaClient();

/**
 * Comment Repository
 * 댓글 데이터베이스 작업
 */
export class CommentRepository {
  /**
   * 게시글의 댓글 목록 조회 (필터링, 페이지네이션)
   */
  static async findCommentsByPostId(
    postId: string,
    query: GetCommentsQueryDto
  ): Promise<{ comments: Comment[]; total: number }> {
    const {
      page = 1,
      limit = 20,
      status,
      authorId,
      sortBy = 'createdAt',
      sortOrder = 'asc', // 댓글은 오래된 순서가 기본
    } = query;

    const skip = (page - 1) * limit;

    // postId로 게시글 조회 (UUID를 얻기 위해)
    const post = await prisma.post.findUnique({
      where: { postId },
    });

    if (!post) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }

    // Build where clause
    const where: Prisma.CommentWhereInput = {
      postId: post.id, // UUID 사용
    };

    if (status) {
      where.status = status;
    } else {
      // 기본적으로 삭제되지 않은 댓글만 조회
      where.status = { not: 'DELETED' };
    }

    if (authorId) {
      where.authorId = authorId;
    }

    // Build orderBy clause
    const orderBy: Prisma.CommentOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    // Execute queries in parallel
    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              memberId: true,
              nickname: true,
              memberType: true,
            },
          },
        },
      }),
      prisma.comment.count({ where }),
    ]);

    return { comments, total };
  }

  /**
   * 댓글 상세 조회 (ID 기준)
   */
  static async findById(commentId: string): Promise<Comment | null> {
    return prisma.comment.findUnique({
      where: { commentId },
      include: {
        author: {
          select: {
            id: true,
            memberId: true,
            nickname: true,
            memberType: true,
          },
        },
      },
    });
  }

  /**
   * 댓글 생성
   */
  static async create(postId: string, authorId: string, data: CreateCommentRequestDto): Promise<Comment> {
    // postId로 게시글 조회 (UUID를 얻기 위해)
    const post = await prisma.post.findUnique({
      where: { postId },
    });

    if (!post) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }

    // commentId 자동 생성 (예: FB000001-CM0001)
    const commentId = await this.generateCommentId(postId);

    // 트랜잭션으로 댓글 생성과 게시글 댓글 수 증가를 함께 처리
    const comment = await prisma.$transaction(async (tx) => {
      // 댓글 생성
      const newComment = await tx.comment.create({
        data: {
          commentId,
          postId: post.id, // UUID 사용
          authorId,
          content: data.content,
        },
        include: {
          author: {
            select: {
              id: true,
              memberId: true,
              nickname: true,
              memberType: true,
            },
          },
        },
      });

      // 게시글의 댓글 수 증가
      await tx.post.update({
        where: { id: post.id },
        data: {
          commentCount: { increment: 1 },
        },
      });

      return newComment;
    });

    return comment;
  }

  /**
   * 댓글 수정
   */
  static async update(commentId: string, data: UpdateCommentRequestDto): Promise<Comment> {
    return prisma.comment.update({
      where: { commentId },
      data,
      include: {
        author: {
          select: {
            id: true,
            memberId: true,
            nickname: true,
            memberType: true,
          },
        },
      },
    });
  }

  /**
   * 댓글 삭제 (Soft Delete)
   */
  static async delete(commentId: string): Promise<Comment> {
    // 댓글 조회
    const comment = await prisma.comment.findUnique({
      where: { commentId },
    });

    if (!comment) {
      throw new Error('댓글을 찾을 수 없습니다.');
    }

    // 트랜잭션으로 댓글 삭제와 게시글 댓글 수 감소를 함께 처리
    const deletedComment = await prisma.$transaction(async (tx) => {
      // 댓글 삭제 (Soft Delete)
      const deleted = await tx.comment.update({
        where: { commentId },
        data: {
          status: 'DELETED',
          deletedAt: new Date(),
        },
      });

      // 게시글의 댓글 수 감소
      await tx.post.update({
        where: { id: comment.postId },
        data: {
          commentCount: { decrement: 1 },
        },
      });

      return deleted;
    });

    return deletedComment;
  }

  /**
   * commentId 자동 생성 (예: FB000001-CM0001)
   */
  private static async generateCommentId(postId: string): Promise<string> {
    // 해당 게시글의 마지막 댓글 조회
    const lastComment = await prisma.comment.findFirst({
      where: {
        commentId: {
          startsWith: postId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!lastComment) {
      return `${postId}-CM0001`;
    }

    // commentId 형식: "FB000001-CM0001"
    const lastNumber = parseInt(lastComment.commentId.split('-CM')[1]);
    const nextNumber = lastNumber + 1;
    return `${postId}-CM${nextNumber.toString().padStart(4, '0')}`;
  }
}
