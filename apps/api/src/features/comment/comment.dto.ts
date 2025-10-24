import { CommentStatus } from '@prisma/client';

/**
 * 댓글 목록 조회 Query DTO
 */
export interface GetCommentsQueryDto {
  page?: number;
  limit?: number;
  status?: CommentStatus; // PUBLISHED, HIDDEN, DELETED
  authorId?: string;
  sortBy?: 'createdAt' | 'likeCount';
  sortOrder?: 'asc' | 'desc';
}

/**
 * 댓글 작성 Request DTO
 */
export interface CreateCommentRequestDto {
  content: string;
}

/**
 * 댓글 수정 Request DTO
 */
export interface UpdateCommentRequestDto {
  content?: string;
  status?: CommentStatus;
}

/**
 * 댓글 응답 DTO
 */
export interface CommentResponseDto {
  commentId: string;
  postId: string;
  author: {
    userId: string;
    memberId: string;
    nickname: string;
    memberType: string;
  };
  content: string;
  status: CommentStatus;
  likeCount: number;
  dislikeCount: number;
  reportCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 댓글 목록 응답 DTO
 */
export interface GetCommentsResponseDto {
  comments: CommentResponseDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
