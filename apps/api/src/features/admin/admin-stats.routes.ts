/**
 * Admin Statistics Routes
 *
 * @description
 * - 관리자 통계 API 라우트 정의
 * - 모든 라우트는 관리자 권한 필요
 */

import { Router } from 'express';
import { AdminStatsController } from './admin-stats.controller';
import { authenticateJwt, requireAdmin } from '../../shared/middleware/authenticate';

const router = Router();

/**
 * 모든 Admin Stats API는 관리자 권한 필요
 */
router.use(authenticateJwt, requireAdmin);

/**
 * 대시보드 전체 통계 조회
 * GET /api/admin/stats/dashboard
 *
 * Query Parameters:
 * - includePeriod: 기간별 통계 포함 여부 (boolean, default: false)
 * - days: 조회할 일수 (number, default: 30)
 *
 * Response:
 * - members: 회원 통계
 * - posts: 게시글 통계
 * - comments: 댓글 통계
 * - votes: 투표 통계
 * - reports: 신고 통계
 * - lastUpdated: 마지막 업데이트 시간
 */
router.get('/dashboard', AdminStatsController.getDashboardStats);

/**
 * 회원 통계 조회
 * GET /api/admin/stats/members
 *
 * Query Parameters:
 * - period: 기간 타입 (day, week, month)
 * - days: 조회할 일수 (number, default: 30)
 */
router.get('/members', AdminStatsController.getMemberStats);

/**
 * 게시글 통계 조회
 * GET /api/admin/stats/posts
 *
 * Query Parameters:
 * - period: 기간 타입 (day, week, month)
 * - days: 조회할 일수 (number, default: 30)
 */
router.get('/posts', AdminStatsController.getPostStats);

/**
 * 댓글 통계 조회
 * GET /api/admin/stats/comments
 *
 * Query Parameters:
 * - period: 기간 타입 (day, week, month)
 * - days: 조회할 일수 (number, default: 30)
 */
router.get('/comments', AdminStatsController.getCommentStats);

/**
 * 투표 통계 조회
 * GET /api/admin/stats/votes
 *
 * Query Parameters:
 * - period: 기간 타입 (day, week, month)
 * - days: 조회할 일수 (number, default: 30)
 */
router.get('/votes', AdminStatsController.getVoteStats);

/**
 * 신고 통계 조회
 * GET /api/admin/stats/reports
 *
 * Query Parameters:
 * - period: 기간 타입 (day, week, month)
 * - days: 조회할 일수 (number, default: 30)
 */
router.get('/reports', AdminStatsController.getReportStats);

export default router;
