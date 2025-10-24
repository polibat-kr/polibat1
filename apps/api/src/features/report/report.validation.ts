/**
 * Report Validation Schemas
 * Zod를 사용한 신고 API 요청 검증
 */

import { z } from 'zod';
import { ReportTargetType, ReportStatus, ActionType } from '@prisma/client';

/**
 * 신고 생성 요청 검증
 */
export const createReportSchema = z.object({
  body: z.object({
    targetType: z.nativeEnum(ReportTargetType, {
      errorMap: () => ({ message: 'targetType은 POST 또는 COMMENT여야 합니다.' }),
    }),
    targetId: z
      .string()
      .min(1, 'targetId는 필수입니다.')
      .regex(/^[A-Z]{2}\d{6}(-CM\d{4})?$/, 'targetId 형식이 올바르지 않습니다.'),
    reason: z
      .string()
      .min(10, '신고 사유는 최소 10자 이상이어야 합니다.')
      .max(1000, '신고 사유는 최대 1,000자까지 가능합니다.'),
  }),
});

/**
 * 신고 처리 요청 검증 (관리자)
 */
export const processReportSchema = z.object({
  body: z.object({
    status: z.nativeEnum(ReportStatus, {
      errorMap: () => ({ message: '유효한 신고 상태여야 합니다.' }),
    }),
    adminNote: z.string().max(1000, '관리자 메모는 최대 1,000자까지 가능합니다.').optional(),
    actionType: z.nativeEnum(ActionType).optional(),
  }),
  params: z.object({
    reportId: z.string().regex(/^[A-Z]{2}\d{6}-RP\d{4}$/, 'reportId 형식이 올바르지 않습니다.'),
  }),
});

/**
 * 신고 목록 조회 쿼리 검증
 */
export const getReportsSchema = z.object({
  query: z.object({
    status: z.nativeEnum(ReportStatus).optional(),
    targetType: z.nativeEnum(ReportTargetType).optional(),
    reporterId: z.string().uuid('reporterId는 유효한 UUID여야 합니다.').optional(),
    reportedUserId: z.string().uuid('reportedUserId는 유효한 UUID여야 합니다.').optional(),
    page: z
      .string()
      .regex(/^\d+$/, 'page는 양의 정수여야 합니다.')
      .optional(),
    limit: z
      .string()
      .regex(/^\d+$/, 'limit는 양의 정수여야 합니다.')
      .optional(),
    sortBy: z.enum(['createdAt', 'processedAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

/**
 * 신고 상세 조회 파라미터 검증
 */
export const getReportSchema = z.object({
  params: z.object({
    reportId: z.string().regex(/^[A-Z]{2}\d{6}-RP\d{4}$/, 'reportId 형식이 올바르지 않습니다.'),
  }),
});

/**
 * 신고 삭제 파라미터 검증
 */
export const deleteReportSchema = z.object({
  params: z.object({
    reportId: z.string().regex(/^[A-Z]{2}\d{6}-RP\d{4}$/, 'reportId 형식이 올바르지 않습니다.'),
  }),
});
