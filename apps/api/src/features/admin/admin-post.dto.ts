/**
 * Admin Post Management DTO
 *
 * @description
 * - 게시글 관리 타입 정의
 * - 목록 조회, 상세 조회, 상태 변경, 삭제
 */

import type { BoardType, PostStatus } from '@prisma/client';

/**
 * 게시글 목록 조회 Query Parameters
 */
export interface GetPostsQueryDto {
  page?: number; // 페이지 번호 (default: 1)
  limit?: number; // 페이지당 개수 (default: 20)
  search?: string; // 검색어 (제목, 내용, 작성자 닉네임)
  boardType?: BoardType; // 게시판 필터 (FREE, POLITICIAN, VOTE)
  status?: PostStatus; // 상태 필터 (PUBLISHED, PINNED, HIDDEN, DELETED)
  sortBy?: 'createdAt' | 'updatedAt' | 'viewCount' | 'likeCount'; // 정렬 기준
  sortOrder?: 'asc' | 'desc'; // 정렬 순서
  startDate?: string; // 작성일 시작 (YYYY-MM-DD)
  endDate?: string; // 작성일 종료 (YYYY-MM-DD)
  authorId?: string; // 특정 작성자 필터
}

/**
 * 게시글 목록 아이템
 */
export interface PostListItemDto {
  id: string;
  postId: string;
  boardType: BoardType;
  status: PostStatus;
  title: string;
  content: string; // 100자만 반환
  authorId: string;
  authorNickname: string;
  authorMemberType: string;
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  reportCount: number;
  hasVote: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

/**
 * 게시글 목록 응답
 */
export interface GetPostsResponseDto {
  posts: PostListItemDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * 게시글 상세 응답
 */
export interface PostDetailResponseDto {
  // 기본 정보
  id: string;
  postId: string;
  boardType: BoardType;
  status: PostStatus;
  title: string;
  content: string;

  // 작성자 정보
  authorId: string;
  authorNickname: string;
  authorMemberType: string;
  authorEmail: string;

  // 통계
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  reportCount: number;

  // 투표 정보 (있을 경우)
  vote: {
    id: string;
    voteId: string;
    title: string;
    status: string;
    totalVotes: number;
    options: {
      id: string;
      optionText: string;
      voteCount: number;
    }[];
  } | null;

  // 최근 댓글 (최대 5개)
  recentComments: {
    id: string;
    commentId: string;
    content: string; // 100자만
    authorNickname: string;
    createdAt: Date;
  }[];

  // 신고 이력 (최대 5개)
  recentReports: {
    id: string;
    reportId: string;
    reason: string;
    reporterNickname: string;
    status: string;
    createdAt: Date;
  }[];

  // 타임스탬프
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

/**
 * 게시글 상태 변경 요청
 */
export interface UpdatePostStatusRequestDto {
  status: PostStatus; // PUBLISHED, PINNED, HIDDEN, DELETED
  reason?: string; // 상태 변경 사유 (선택)
}

/**
 * 게시글 상태 변경 응답
 */
export interface UpdatePostStatusResponseDto {
  id: string;
  postId: string;
  previousStatus: PostStatus;
  currentStatus: PostStatus;
  reason: string | null;
  changedBy: string; // Admin ID
  changedAt: Date;
}

/**
 * 게시글 삭제 응답
 */
export interface DeletePostResponseDto {
  id: string;
  postId: string;
  deletedBy: string; // Admin ID
  deletedAt: Date;
}
