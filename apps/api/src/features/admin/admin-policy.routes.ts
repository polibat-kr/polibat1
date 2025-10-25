/**
 * Admin Policy Routes
 *
 * 약관/정책 관리 API 라우트 정의
 */

import { Router } from 'express';
import { AdminPolicyController } from './admin-policy.controller';
import { authenticateJwt } from '../../shared/middleware/authenticate';

const router = Router();
const controller = new AdminPolicyController();

// JWT 인증 미들웨어 적용
router.use(authenticateJwt);

// ============================================
// Policy Template 라우트
// ============================================

/**
 * GET /api/admin/policies/templates
 * 템플릿 목록 조회
 */
router.get('/templates', (req, res) => controller.getTemplates(req, res));

/**
 * POST /api/admin/policies/templates
 * 템플릿 생성
 */
router.post('/templates', (req, res) => controller.createTemplate(req, res));

/**
 * PATCH /api/admin/policies/templates/:templateId
 * 템플릿 수정
 */
router.patch('/templates/:templateId', (req, res) => controller.updateTemplate(req, res));

// ============================================
// Policy Content 라우트
// ============================================

/**
 * GET /api/admin/policies/contents
 * 콘텐츠 목록 조회
 */
router.get('/contents', (req, res) => controller.getContents(req, res));

/**
 * POST /api/admin/policies/contents
 * 콘텐츠 생성
 */
router.post('/contents', (req, res) => controller.createContent(req, res));

/**
 * PATCH /api/admin/policies/contents/:contentId
 * 콘텐츠 수정
 */
router.patch('/contents/:contentId', (req, res) => controller.updateContent(req, res));

export default router;
