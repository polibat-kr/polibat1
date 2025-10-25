/**
 * Admin Banner Management DTO
 *
 * 배너 관리 관련 요청/응답 타입 정의
 */

// ============================================
// 배너 목록 조회 (GET /api/admin/banners)
// ============================================

export interface GetBannersQueryDto {
  // 페이지네이션
  page?: number;
  limit?: number;

  // 검색
  search?: string; // 제목 검색

  // 필터
  isActive?: boolean; // 활성화 상태 필터

  // 정렬
  sortBy?: 'createdAt' | 'updatedAt' | 'startDate' | 'endDate' | 'displayOrder'; // 정렬 기준
  sortOrder?: 'asc' | 'desc'; // 정렬 순서

  // 기간 필터 (노출 기간 기준)
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

export interface BannerDto {
  id: string;
  bannerId: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  displayOrder: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetBannersResponseDto {
  success: boolean;
  data: {
    banners: BannerDto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// ============================================
// 배너 상세 조회 (GET /api/admin/banners/:bannerId)
// ============================================

export interface GetBannerDetailResponseDto {
  success: boolean;
  data: BannerDto;
}

// ============================================
// 배너 생성 (POST /api/admin/banners)
// ============================================

export interface CreateBannerRequestDto {
  title: string; // 필수: 제목
  imageUrl: string; // 필수: 이미지 URL
  linkUrl: string; // 필수: 링크 URL
  displayOrder?: number; // 선택: 표시 순서 (default: 0)
  startDate: string; // 필수: 노출 시작일 (YYYY-MM-DD)
  endDate: string; // 필수: 노출 종료일 (YYYY-MM-DD)
  isActive?: boolean; // 선택: 활성화 여부 (default: true)
}

export interface CreateBannerResponseDto {
  success: boolean;
  data: {
    id: string;
    bannerId: string;
    title: string;
    displayOrder: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    createdAt: Date;
  };
}

// ============================================
// 배너 수정 (PATCH /api/admin/banners/:bannerId)
// ============================================

export interface UpdateBannerRequestDto {
  title?: string; // 선택: 제목 변경
  imageUrl?: string; // 선택: 이미지 URL 변경
  linkUrl?: string; // 선택: 링크 URL 변경
  displayOrder?: number; // 선택: 표시 순서 변경
  startDate?: string; // 선택: 노출 시작일 변경 (YYYY-MM-DD)
  endDate?: string; // 선택: 노출 종료일 변경 (YYYY-MM-DD)
  isActive?: boolean; // 선택: 활성화 여부 변경
}

export interface UpdateBannerResponseDto {
  success: boolean;
  data: {
    id: string;
    bannerId: string;
    title: string;
    displayOrder: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    updatedAt: Date;
  };
}

// ============================================
// 배너 삭제 (DELETE /api/admin/banners/:bannerId)
// ============================================

export interface DeleteBannerResponseDto {
  success: boolean;
  data: {
    id: string;
    bannerId: string;
    title: string;
    deletedAt: Date;
  };
}

// ============================================
// 배너 순서 변경 (PATCH /api/admin/banners/:bannerId/order)
// ============================================

export interface UpdateBannerOrderRequestDto {
  displayOrder: number; // 필수: 새로운 표시 순서
}

export interface UpdateBannerOrderResponseDto {
  success: boolean;
  data: {
    id: string;
    bannerId: string;
    displayOrder: number;
    updatedAt: Date;
  };
}
