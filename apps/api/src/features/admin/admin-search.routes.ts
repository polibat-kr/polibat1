/**
 * Admin Search Routes
 *
 * 통합 검색 라우트 정의
 */

import { Router } from 'express';
import { AdminSearchController } from './admin-search.controller';
import { authenticateJwt } from '../../shared/middleware/authenticate';

const router = Router();
const controller = new AdminSearchController();

// 모든 라우트에 인증 미들웨어 적용 (관리자 전용)
router.use(authenticateJwt);

/**
 * 통합 검색
 * GET /api/admin/search
 *
 * Query Parameters:
 * - query: string (필수, 최소 2자)
 * - category?: 'all' | 'members' | 'posts' | 'comments' | 'reports' (기본: 'all')
 * - limit?: number (카테고리당 최대 결과 수, 기본: 5)
 *
 * Example:
 * GET /api/admin/search?query=test&category=all&limit=10
 */
router.get('/', controller.search);

export default router;
