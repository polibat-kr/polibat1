/**
 * Admin Policy Management DTO
 *
 * 약관/정책 관리 관련 요청/응답 타입 정의
 */

import { PolicyTarget } from '@prisma/client';

// ============================================
// Policy Template 관리
// ============================================

// 템플릿 목록 조회 (GET /api/admin/policies/templates)
export interface GetPolicyTemplatesQueryDto {
  // 페이지네이션
  page?: number;
  limit?: number;

  // 검색
  search?: string; // 제목 검색

  // 필터
  isActive?: boolean; // 활성화 상태 필터

  // 정렬
  sortBy?: 'createdAt' | 'title'; // 정렬 기준
  sortOrder?: 'asc' | 'desc'; // 정렬 순서
}

export interface PolicyTemplateDto {
  id: string;
  templateId: string;
  versionId: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: Date;
  contentCount?: number; // 연결된 콘텐츠 수
}

export interface GetPolicyTemplatesResponseDto {
  success: boolean;
  data: {
    templates: PolicyTemplateDto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// 템플릿 생성 (POST /api/admin/policies/templates)
export interface CreatePolicyTemplateRequestDto {
  title: string; // 필수: 템플릿 제목
  content: string; // 필수: 템플릿 내용
  isActive?: boolean; // 선택: 활성화 여부 (default: true)
}

export interface CreatePolicyTemplateResponseDto {
  success: boolean;
  data: {
    id: string;
    templateId: string;
    versionId: string;
    title: string;
    isActive: boolean;
    createdAt: Date;
  };
}

// 템플릿 수정 (PATCH /api/admin/policies/templates/:templateId)
export interface UpdatePolicyTemplateRequestDto {
  title?: string; // 선택: 제목 변경
  content?: string; // 선택: 내용 변경
  isActive?: boolean; // 선택: 활성화 여부 변경
}

export interface UpdatePolicyTemplateResponseDto {
  success: boolean;
  data: {
    id: string;
    templateId: string;
    versionId: string;
    title: string;
    isActive: boolean;
  };
}

// ============================================
// Policy Content 관리
// ============================================

// 콘텐츠 목록 조회 (GET /api/admin/policies/contents)
export interface GetPolicyContentsQueryDto {
  // 페이지네이션
  page?: number;
  limit?: number;

  // 필터
  templateVersionId?: string; // 템플릿 버전 ID로 필터링
  target?: PolicyTarget; // 대상별 필터 (ALL, ALL_MEMBERS, NORMAL_MEMBERS, POLITICIAN_MEMBERS)
  isActive?: boolean; // 활성화 상태 필터

  // 정렬
  sortBy?: 'createdAt' | 'updatedAt'; // 정렬 기준
  sortOrder?: 'asc' | 'desc'; // 정렬 순서
}

export interface PolicyContentDto {
  id: string;
  templateVersionId: string;
  target: PolicyTarget;
  content: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  template?: {
    templateId: string;
    versionId: string;
    title: string;
  };
}

export interface GetPolicyContentsResponseDto {
  success: boolean;
  data: {
    contents: PolicyContentDto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// 콘텐츠 생성 (POST /api/admin/policies/contents)
export interface CreatePolicyContentRequestDto {
  templateVersionId: string; // 필수: 템플릿 버전 ID
  target: PolicyTarget; // 필수: 대상 (ALL, ALL_MEMBERS, NORMAL_MEMBERS, POLITICIAN_MEMBERS)
  content: string; // 필수: 콘텐츠 내용
  isActive?: boolean; // 선택: 활성화 여부 (default: true)
}

export interface CreatePolicyContentResponseDto {
  success: boolean;
  data: {
    id: string;
    templateVersionId: string;
    target: PolicyTarget;
    isActive: boolean;
    createdAt: Date;
  };
}

// 콘텐츠 수정 (PATCH /api/admin/policies/contents/:contentId)
export interface UpdatePolicyContentRequestDto {
  content?: string; // 선택: 내용 변경
  target?: PolicyTarget; // 선택: 대상 변경
  isActive?: boolean; // 선택: 활성화 여부 변경
}

export interface UpdatePolicyContentResponseDto {
  success: boolean;
  data: {
    id: string;
    templateVersionId: string;
    target: PolicyTarget;
    isActive: boolean;
    updatedAt: Date;
  };
}
