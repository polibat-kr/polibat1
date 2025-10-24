/**
 * Admin Report Management DTO
 *
 * 신고 관리 관련 요청/응답 타입 정의
 */

import { ReportTargetType, ReportStatus, ActionType } from '@prisma/client';

// ============================================
// 신고 목록 조회 (GET /api/admin/reports)
// ============================================

export interface GetReportsQueryDto {
  // 페이지네이션
  page?: number;
  limit?: number;

  // 검색
  search?: string; // 신고자, 피신고자 닉네임, 신고 사유

  // 필터
  status?: ReportStatus; // 상태별 필터
  targetType?: ReportTargetType; // 대상 유형 필터
  reporterId?: string; // 특정 신고자
  reportedUserId?: string; // 특정 피신고자

  // 정렬
  sortBy?: 'createdAt' | 'processedAt'; // 정렬 기준
  sortOrder?: 'asc' | 'desc'; // 정렬 순서

  // 기간 필터
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

export interface ReportDto {
  id: string;
  reportId: string;
  reporterId: string;
  reporterNickname: string;
  reporterMemberType: string;
  reportedUserId: string;
  reportedUserNickname: string;
  reportedUserMemberType: string;
  targetType: ReportTargetType;
  targetId: string | null; // postId 또는 commentId
  targetTitle: string | null; // 게시글 제목 또는 댓글 내용 (일부)
  reason: string;
  status: ReportStatus;
  adminId: string | null;
  adminNickname: string | null;
  adminNote: string | null;
  actionType: ActionType | null;
  createdAt: Date;
  processedAt: Date | null;
}

export interface GetReportsResponseDto {
  success: boolean;
  data: {
    reports: ReportDto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// ============================================
// 신고 처리 (PATCH /api/admin/reports/:reportId/process)
// ============================================

export interface ProcessReportRequestDto {
  status: ReportStatus; // REVIEWING, RESOLVED, REJECTED, DEFERRED
  adminNote?: string; // 관리자 메모
  actionType?: ActionType; // HIDE, DELETE, RESTORE
}

export interface ProcessReportResponseDto {
  success: boolean;
  data: {
    id: string;
    reportId: string;
    previousStatus: ReportStatus;
    currentStatus: ReportStatus;
    adminId: string;
    adminNickname: string;
    adminNote: string | null;
    actionType: ActionType | null;
    processedAt: Date;
  };
}
