/**
 * Admin Report Routes
 *
 * 신고 관리 라우트 정의
 */

import { Router } from 'express';
import { AdminReportController } from './admin-report.controller';
import { authenticateJwt } from '../../shared/middleware/authenticate';

const router = Router();
const controller = new AdminReportController();

// 모든 라우트에 인증 미들웨어 적용 (관리자 전용)
router.use(authenticateJwt);

/**
 * 신고 목록 조회
 * GET /api/admin/reports
 *
 * Query Parameters:
 * - page?: number (default: 1)
 * - limit?: number (default: 20)
 * - search?: string (신고자, 피신고자, 신고 사유)
 * - status?: ReportStatus (PENDING, REVIEWING, RESOLVED, REJECTED, DEFERRED)
 * - targetType?: ReportTargetType (POST, COMMENT)
 * - reporterId?: string
 * - reportedUserId?: string
 * - sortBy?: 'createdAt' | 'processedAt' (default: 'createdAt')
 * - sortOrder?: 'asc' | 'desc' (default: 'desc')
 * - startDate?: string (YYYY-MM-DD)
 * - endDate?: string (YYYY-MM-DD)
 */
router.get('/', controller.getReports);

/**
 * 신고 처리
 * PATCH /api/admin/reports/:reportId/process
 *
 * Path Parameters:
 * - reportId: string (신고 ID - reportId 형식: FB000001-RP0001)
 *
 * Request Body:
 * {
 *   status: ReportStatus (REVIEWING, RESOLVED, REJECTED, DEFERRED)
 *   adminNote?: string
 *   actionType?: ActionType (HIDE, DELETE, RESTORE)
 * }
 */
router.patch('/:reportId/process', controller.processReport);

export default router;
