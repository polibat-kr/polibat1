/**
 * Admin Comment Management DTO
 *
 * @description
 * - 댓글 관리 타입 정의
 * - 목록 조회, 상태 변경, 삭제
 */

import type { CommentStatus } from '@prisma/client';

/**
 * 댓글 목록 조회 Query Parameters
 */
export interface GetCommentsQueryDto {
  page?: number; // 페이지 번호 (default: 1)
  limit?: number; // 페이지당 개수 (default: 20)
  search?: string; // 검색어 (내용, 작성자 닉네임)
  postId?: string; // 특정 게시글의 댓글만 조회
  authorId?: string; // 특정 작성자 필터
  status?: CommentStatus; // 상태 필터 (PUBLISHED, HIDDEN, DELETED)
  sortBy?: 'createdAt' | 'updatedAt' | 'likeCount'; // 정렬 기준
  sortOrder?: 'asc' | 'desc'; // 정렬 순서
  startDate?: string; // 작성일 시작 (YYYY-MM-DD)
  endDate?: string; // 작성일 종료 (YYYY-MM-DD)
}

/**
 * 댓글 목록 아이템
 */
export interface CommentListItemDto {
  id: string;
  commentId: string;
  postId: string;
  postTitle: string; // 게시글 제목 (관리 편의성)
  status: CommentStatus;
  content: string; // 전체 내용 반환
  authorId: string;
  authorNickname: string;
  authorMemberType: string;
  likeCount: number;
  dislikeCount: number;
  reportCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

/**
 * 댓글 목록 응답
 */
export interface GetCommentsResponseDto {
  comments: CommentListItemDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * 댓글 상태 변경 요청
 */
export interface UpdateCommentStatusRequestDto {
  status: CommentStatus; // PUBLISHED, HIDDEN, DELETED
  reason?: string; // 상태 변경 사유 (선택)
}

/**
 * 댓글 상태 변경 응답
 */
export interface UpdateCommentStatusResponseDto {
  id: string;
  commentId: string;
  previousStatus: CommentStatus;
  currentStatus: CommentStatus;
  reason: string | null;
  changedBy: string; // Admin ID
  changedAt: Date;
}

/**
 * 댓글 삭제 응답
 */
export interface DeleteCommentResponseDto {
  id: string;
  commentId: string;
  deletedBy: string; // Admin ID
  deletedAt: Date;
}
