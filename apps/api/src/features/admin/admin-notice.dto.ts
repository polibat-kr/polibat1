/**
 * Admin Notice Management DTO
 *
 * 공지사항 관리 관련 요청/응답 타입 정의
 */

import { NoticeCategory } from '@prisma/client';

// ============================================
// 공지사항 목록 조회 (GET /api/admin/notices)
// ============================================

export interface GetNoticesQueryDto {
  // 페이지네이션
  page?: number;
  limit?: number;

  // 검색
  search?: string; // 제목, 내용 검색

  // 필터
  category?: NoticeCategory; // 카테고리별 필터 (GUIDE, UPDATE, COMMUNICATION, EXTERNAL)
  isPinned?: boolean; // 상단 고정 필터

  // 정렬
  sortBy?: 'createdAt' | 'updatedAt' | 'viewCount'; // 정렬 기준
  sortOrder?: 'asc' | 'desc'; // 정렬 순서

  // 기간 필터
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

export interface NoticeDto {
  id: string;
  noticeId: string;
  category: NoticeCategory;
  title: string;
  content: string;
  isPinned: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetNoticesResponseDto {
  success: boolean;
  data: {
    notices: NoticeDto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// ============================================
// 공지사항 상세 조회 (GET /api/admin/notices/:noticeId)
// ============================================

export interface GetNoticeDetailResponseDto {
  success: boolean;
  data: NoticeDto;
}

// ============================================
// 공지사항 생성 (POST /api/admin/notices)
// ============================================

export interface CreateNoticeRequestDto {
  category: NoticeCategory; // 필수: GUIDE, UPDATE, COMMUNICATION, EXTERNAL
  title: string; // 필수: 제목
  content: string; // 필수: 내용
  isPinned?: boolean; // 선택: 상단 고정 여부 (default: false)
}

export interface CreateNoticeResponseDto {
  success: boolean;
  data: {
    id: string;
    noticeId: string;
    category: NoticeCategory;
    title: string;
    isPinned: boolean;
    createdAt: Date;
  };
}

// ============================================
// 공지사항 수정 (PATCH /api/admin/notices/:noticeId)
// ============================================

export interface UpdateNoticeRequestDto {
  category?: NoticeCategory; // 선택: 카테고리 변경
  title?: string; // 선택: 제목 변경
  content?: string; // 선택: 내용 변경
  isPinned?: boolean; // 선택: 상단 고정 여부 변경
}

export interface UpdateNoticeResponseDto {
  success: boolean;
  data: {
    id: string;
    noticeId: string;
    category: NoticeCategory;
    title: string;
    isPinned: boolean;
    updatedAt: Date;
  };
}

// ============================================
// 공지사항 삭제 (DELETE /api/admin/notices/:noticeId)
// ============================================

export interface DeleteNoticeResponseDto {
  success: boolean;
  data: {
    id: string;
    noticeId: string;
    title: string;
    deletedAt: Date;
  };
}

// ============================================
// 공지사항 상단 고정/해제 (PATCH /api/admin/notices/:noticeId/pin)
// ============================================

export interface TogglePinRequestDto {
  isPinned: boolean; // true: 고정, false: 해제
}

export interface TogglePinResponseDto {
  success: boolean;
  data: {
    id: string;
    noticeId: string;
    title: string;
    isPinned: boolean;
    updatedAt: Date;
  };
}
