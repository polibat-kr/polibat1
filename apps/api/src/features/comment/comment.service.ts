import { CommentRepository } from './comment.repository';
import {
  GetCommentsQueryDto,
  CreateCommentRequestDto,
  UpdateCommentRequestDto,
  CommentResponseDto,
  GetCommentsResponseDto,
} from './comment.dto';
import { ApiError } from '../../shared/middleware/error-handler';
import { ERROR_CODES } from '../../shared/utils/error-codes';

/**
 * Comment Service
 * 댓글 비즈니스 로직
 */
export class CommentService {
  /**
   * 게시글의 댓글 목록 조회
   */
  static async getCommentsByPostId(postId: string, query: GetCommentsQueryDto): Promise<GetCommentsResponseDto> {
    const { comments, total } = await CommentRepository.findCommentsByPostId(postId, query);

    const page = query.page || 1;
    const limit = query.limit || 20;

    const formattedComments = await Promise.all(
      comments.map((comment) => this.formatCommentResponse(comment))
    );

    return {
      comments: formattedComments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 댓글 상세 조회
   */
  static async getCommentById(commentId: string): Promise<CommentResponseDto> {
    const comment = await CommentRepository.findById(commentId);

    if (!comment) {
      throw new ApiError(404, '댓글을 찾을 수 없습니다.', ERROR_CODES.COMMENT_NOT_FOUND);
    }

    return await this.formatCommentResponse(comment);
  }

  /**
   * 댓글 작성
   */
  static async createComment(
    postId: string,
    authorId: string,
    data: CreateCommentRequestDto
  ): Promise<CommentResponseDto> {
    // 내용 검증
    if (!data.content || data.content.trim().length === 0) {
      throw new ApiError(400, '댓글 내용을 입력해주세요.', ERROR_CODES.VALIDATION_ERROR);
    }

    const comment = await CommentRepository.create(postId, authorId, data);
    return await this.formatCommentResponse(comment);
  }

  /**
   * 댓글 수정
   */
  static async updateComment(
    commentId: string,
    userId: string,
    data: UpdateCommentRequestDto
  ): Promise<CommentResponseDto> {
    const comment = await CommentRepository.findById(commentId);

    if (!comment) {
      throw new ApiError(404, '댓글을 찾을 수 없습니다.', ERROR_CODES.COMMENT_NOT_FOUND);
    }

    // 작성자 본인만 수정 가능
    if (comment.authorId !== userId) {
      throw new ApiError(403, '댓글 수정 권한이 없습니다.', ERROR_CODES.FORBIDDEN);
    }

    // 내용 검증 (내용이 있는 경우)
    if (data.content !== undefined && data.content.trim().length === 0) {
      throw new ApiError(400, '댓글 내용을 입력해주세요.', ERROR_CODES.VALIDATION_ERROR);
    }

    const updatedComment = await CommentRepository.update(commentId, data);
    return await this.formatCommentResponse(updatedComment);
  }

  /**
   * 댓글 삭제
   */
  static async deleteComment(commentId: string, userId: string, isAdmin = false): Promise<void> {
    const comment = await CommentRepository.findById(commentId);

    if (!comment) {
      throw new ApiError(404, '댓글을 찾을 수 없습니다.', ERROR_CODES.COMMENT_NOT_FOUND);
    }

    // 작성자 본인 또는 관리자만 삭제 가능
    if (!isAdmin && comment.authorId !== userId) {
      throw new ApiError(403, '댓글 삭제 권한이 없습니다.', ERROR_CODES.FORBIDDEN);
    }

    await CommentRepository.delete(commentId);
  }

  /**
   * 댓글 응답 포맷팅
   */
  private static async formatCommentResponse(comment: any): Promise<CommentResponseDto> {
    // postId (UUID)로 게시글의 postId (문자열) 조회
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    const post = await prisma.post.findUnique({
      where: { id: comment.postId },
      select: { postId: true },
    });

    return {
      commentId: comment.commentId,
      postId: post?.postId || comment.postId, // 문자열 postId 반환 (예: "FB000001")
      author: {
        userId: comment.author.id,
        memberId: comment.author.memberId,
        nickname: comment.author.nickname,
        memberType: comment.author.memberType,
      },
      content: comment.content,
      status: comment.status,
      likeCount: comment.likeCount,
      dislikeCount: comment.dislikeCount,
      reportCount: comment.reportCount,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    };
  }
}
