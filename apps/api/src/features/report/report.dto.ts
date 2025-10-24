/**
 * Report DTO (Data Transfer Objects)
 * 신고 요청/응답 타입 정의
 */

import { ReportTargetType, ReportStatus, ActionType } from '@prisma/client';

/**
 * 신고 생성 요청 DTO
 */
export interface CreateReportDto {
  targetType: ReportTargetType; // 'POST' | 'COMMENT'
  targetId: string; // postId 또는 commentId
  reason: string; // 신고 사유
}

/**
 * 신고 처리 요청 DTO (관리자)
 */
export interface ProcessReportDto {
  status: ReportStatus; // 'REVIEWING' | 'RESOLVED' | 'REJECTED' | 'DEFERRED'
  adminNote?: string; // 관리자 메모
  actionType?: ActionType; // 'HIDE' | 'DELETE' | 'RESTORE'
}

/**
 * 신고 응답 DTO
 */
export interface ReportResponseDto {
  id: string;
  reportId: string; // FB000001-RP0001
  reporterId: string;
  reportedUserId: string;
  targetType: ReportTargetType;
  targetId: string; // postId 또는 commentId (UUID가 아닌 문자열)
  reason: string;
  status: ReportStatus;
  adminId?: string | null;
  adminNote?: string | null;
  actionType?: ActionType | null;
  createdAt: Date;
  processedAt?: Date | null;
  reporter?: {
    memberId: string;
    nickname: string;
  };
  reportedUser?: {
    memberId: string;
    nickname: string;
  };
  admin?: {
    memberId: string;
    nickname: string;
  } | null;
}

/**
 * 신고 목록 쿼리 파라미터 DTO
 */
export interface GetReportsQueryDto {
  status?: ReportStatus; // 특정 상태만 조회
  targetType?: ReportTargetType; // 특정 대상 유형만 조회
  reporterId?: string; // 특정 신고자
  reportedUserId?: string; // 특정 피신고자
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'processedAt'; // 정렬 기준
  sortOrder?: 'asc' | 'desc'; // 정렬 순서
}

/**
 * 신고 목록 응답 DTO
 */
export interface ReportListResponseDto {
  reports: ReportResponseDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  summary?: {
    pending: number;
    reviewing: number;
    resolved: number;
    rejected: number;
    deferred: number;
  };
}
