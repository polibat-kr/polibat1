/**
 * Admin Popup Management DTO
 *
 * 팝업 관리 관련 요청/응답 타입 정의
 */

import { PopupPosition } from '@prisma/client';

// ============================================
// 팝업 목록 조회 (GET /api/admin/popups)
// ============================================

export interface GetPopupsQueryDto {
  // 페이지네이션
  page?: number;
  limit?: number;

  // 검색
  search?: string; // 제목, 내용 검색

  // 필터
  position?: PopupPosition; // 위치별 필터 (CENTER, TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT)
  isActive?: boolean; // 활성화 상태 필터

  // 정렬
  sortBy?: 'createdAt' | 'updatedAt' | 'startDate' | 'endDate'; // 정렬 기준
  sortOrder?: 'asc' | 'desc'; // 정렬 순서

  // 기간 필터 (노출 기간 기준)
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

export interface PopupDto {
  id: string;
  popupId: string;
  title: string;
  content: string;
  imageUrl: string | null;
  linkUrl: string | null;
  position: PopupPosition;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetPopupsResponseDto {
  success: boolean;
  data: {
    popups: PopupDto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// ============================================
// 팝업 상세 조회 (GET /api/admin/popups/:popupId)
// ============================================

export interface GetPopupDetailResponseDto {
  success: boolean;
  data: PopupDto;
}

// ============================================
// 팝업 생성 (POST /api/admin/popups)
// ============================================

export interface CreatePopupRequestDto {
  title: string; // 필수: 제목
  content: string; // 필수: 내용
  imageUrl?: string; // 선택: 이미지 URL
  linkUrl?: string; // 선택: 링크 URL
  position?: PopupPosition; // 선택: 위치 (default: CENTER)
  startDate: string; // 필수: 노출 시작일 (YYYY-MM-DD)
  endDate: string; // 필수: 노출 종료일 (YYYY-MM-DD)
  isActive?: boolean; // 선택: 활성화 여부 (default: true)
}

export interface CreatePopupResponseDto {
  success: boolean;
  data: {
    id: string;
    popupId: string;
    title: string;
    position: PopupPosition;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    createdAt: Date;
  };
}

// ============================================
// 팝업 수정 (PATCH /api/admin/popups/:popupId)
// ============================================

export interface UpdatePopupRequestDto {
  title?: string; // 선택: 제목 변경
  content?: string; // 선택: 내용 변경
  imageUrl?: string; // 선택: 이미지 URL 변경
  linkUrl?: string; // 선택: 링크 URL 변경
  position?: PopupPosition; // 선택: 위치 변경
  startDate?: string; // 선택: 노출 시작일 변경 (YYYY-MM-DD)
  endDate?: string; // 선택: 노출 종료일 변경 (YYYY-MM-DD)
  isActive?: boolean; // 선택: 활성화 여부 변경
}

export interface UpdatePopupResponseDto {
  success: boolean;
  data: {
    id: string;
    popupId: string;
    title: string;
    position: PopupPosition;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    updatedAt: Date;
  };
}

// ============================================
// 팝업 삭제 (DELETE /api/admin/popups/:popupId)
// ============================================

export interface DeletePopupResponseDto {
  success: boolean;
  data: {
    id: string;
    popupId: string;
    title: string;
    deletedAt: Date;
  };
}
