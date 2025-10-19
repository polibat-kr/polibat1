import { Router } from 'express';
import { HealthController } from './health.controller';

const router = Router();

/**
 * Health Check 라우트
 *
 * @route GET /health
 * @description 기본 서버 상태 확인
 */
router.get('/', HealthController.getHealth);

/**
 * Detailed Health Check 라우트
 *
 * @route GET /health/detailed
 * @description 데이터베이스 연결 포함 상세 상태 확인
 */
router.get('/detailed', HealthController.getDetailedHealth);

export default router;
