/**
 * Report Routes
 * 신고 API 라우트 정의
 */

import { Router } from 'express';
import { ReportController } from './report.controller';
import { authenticateJwt } from '../../shared/middleware/authenticate';
import { validate } from '../../shared/middleware/validator';
import {
  createReportSchema,
  getReportsSchema,
  getReportSchema,
  processReportSchema,
  deleteReportSchema,
} from './report.validation';

const router = Router();

/**
 * POST /api/reports
 * 신고 생성 (인증 필요)
 */
router.post('/reports', authenticateJwt, validate(createReportSchema), ReportController.createReport);

/**
 * GET /api/reports/my
 * 내가 신고한 목록 조회 (인증 필요)
 * 주의: /api/reports/:reportId보다 먼저 정의해야 함
 */
router.get('/reports/my', authenticateJwt, ReportController.getMyReports);

/**
 * GET /api/reports
 * 신고 목록 조회 (관리자)
 */
router.get('/reports', authenticateJwt, validate(getReportsSchema), ReportController.getReports);

/**
 * GET /api/reports/:reportId
 * 신고 상세 조회 (인증 필요)
 */
router.get(
  '/reports/:reportId',
  authenticateJwt,
  validate(getReportSchema),
  ReportController.getReport
);

/**
 * PATCH /api/reports/:reportId/process
 * 신고 처리 (관리자)
 */
router.patch(
  '/reports/:reportId/process',
  authenticateJwt,
  validate(processReportSchema),
  ReportController.processReport
);

/**
 * DELETE /api/reports/:reportId
 * 신고 삭제 (본인만)
 */
router.delete(
  '/reports/:reportId',
  authenticateJwt,
  validate(deleteReportSchema),
  ReportController.deleteReport
);

export default router;
