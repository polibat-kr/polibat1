/**
 * Admin Suggestion Management DTO
 *
 * 건의사항 관리 관련 요청/응답 타입 정의
 */

import { SuggestionType, SuggestionStatus } from '@prisma/client';

// ============================================
// 건의사항 목록 조회 (GET /api/admin/suggestions)
// ============================================

export interface GetSuggestionsQueryDto {
  // 페이지네이션
  page?: number;
  limit?: number;

  // 검색
  search?: string; // 제목, 내용 검색

  // 필터
  suggestionType?: SuggestionType; // 타입별 필터 (FEATURE, COMPLAINT, VOTE_PROPOSAL)
  status?: SuggestionStatus; // 상태별 필터 (PENDING, REVIEWING, RESOLVED, REJECTED, DEFERRED)

  // 정렬
  sortBy?: 'createdAt' | 'repliedAt'; // 정렬 기준
  sortOrder?: 'asc' | 'desc'; // 정렬 순서

  // 기간 필터
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

export interface SuggestionDto {
  id: string;
  suggestionId: string;
  suggestionType: SuggestionType;
  status: SuggestionStatus;
  userId: string;
  title: string;
  content: string;
  adminReply: string | null;
  adminId: string | null;
  createdAt: Date;
  repliedAt: Date | null;
  user?: {
    id: string;
    memberId: string;
    nickname: string;
    memberType: string;
  };
}

export interface GetSuggestionsResponseDto {
  success: boolean;
  data: {
    suggestions: SuggestionDto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// ============================================
// 건의사항 상세 조회 (GET /api/admin/suggestions/:suggestionId)
// ============================================

export interface GetSuggestionDetailResponseDto {
  success: boolean;
  data: SuggestionDto;
}

// ============================================
// 건의사항 생성 (POST /api/admin/suggestions)
// ============================================

export interface CreateSuggestionRequestDto {
  suggestionType: SuggestionType; // 필수: FEATURE, COMPLAINT, VOTE_PROPOSAL
  title: string; // 필수: 제목
  content: string; // 필수: 내용
  userId: string; // 필수: 작성자 ID (실제로는 JWT에서 추출)
}

export interface CreateSuggestionResponseDto {
  success: boolean;
  data: {
    id: string;
    suggestionId: string;
    suggestionType: SuggestionType;
    title: string;
    status: SuggestionStatus;
    createdAt: Date;
  };
}

// ============================================
// 관리자 답변 작성 (PATCH /api/admin/suggestions/:suggestionId/reply)
// ============================================

export interface ReplySuggestionRequestDto {
  adminReply: string; // 필수: 관리자 답변 내용
  status?: SuggestionStatus; // 선택: 상태 변경 (RESOLVED, REJECTED, DEFERRED)
}

export interface ReplySuggestionResponseDto {
  success: boolean;
  data: {
    id: string;
    suggestionId: string;
    adminReply: string;
    status: SuggestionStatus;
    repliedAt: Date;
  };
}

// ============================================
// 건의사항 상태 변경 (PATCH /api/admin/suggestions/:suggestionId/status)
// ============================================

export interface UpdateSuggestionStatusRequestDto {
  status: SuggestionStatus; // 필수: PENDING, REVIEWING, RESOLVED, REJECTED, DEFERRED
}

export interface UpdateSuggestionStatusResponseDto {
  success: boolean;
  data: {
    id: string;
    suggestionId: string;
    status: SuggestionStatus;
    updatedAt: Date;
  };
}
