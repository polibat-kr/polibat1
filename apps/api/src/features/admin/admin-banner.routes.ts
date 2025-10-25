/**
 * Admin Banner Routes
 *
 * 배너 관리 라우트 정의
 */

import { Router } from 'express';
import { AdminBannerController } from './admin-banner.controller';
import { authenticateJwt } from '../../shared/middleware/authenticate';

const router = Router();
const controller = new AdminBannerController();

// 모든 라우트에 인증 미들웨어 적용 (관리자 전용)
router.use(authenticateJwt);

/**
 * 배너 목록 조회
 * GET /api/admin/banners
 *
 * Query Parameters:
 * - page?: number (default: 1)
 * - limit?: number (default: 20)
 * - search?: string (제목 검색)
 * - isActive?: boolean (true/false)
 * - sortBy?: 'createdAt' | 'updatedAt' | 'startDate' | 'endDate' | 'displayOrder' (default: 'displayOrder')
 * - sortOrder?: 'asc' | 'desc' (default: 'asc')
 * - startDate?: string (YYYY-MM-DD, 노출 시작일 필터)
 * - endDate?: string (YYYY-MM-DD, 노출 종료일 필터)
 */
router.get('/', controller.getBanners);

/**
 * 배너 상세 조회
 * GET /api/admin/banners/:bannerId
 *
 * Path Parameters:
 * - bannerId: string (배너 ID - bannerId 형식: BN000001)
 */
router.get('/:bannerId', controller.getBannerDetail);

/**
 * 배너 생성
 * POST /api/admin/banners
 *
 * Request Body:
 * {
 *   title: string - 필수 (제목)
 *   imageUrl: string - 필수 (이미지 URL)
 *   linkUrl: string - 필수 (링크 URL)
 *   displayOrder?: number (표시 순서, default: 0)
 *   startDate: string - 필수 (YYYY-MM-DD)
 *   endDate: string - 필수 (YYYY-MM-DD)
 *   isActive?: boolean (default: true)
 * }
 */
router.post('/', controller.createBanner);

/**
 * 배너 수정
 * PATCH /api/admin/banners/:bannerId
 *
 * Path Parameters:
 * - bannerId: string (배너 ID - bannerId 형식: BN000001)
 *
 * Request Body:
 * {
 *   title?: string
 *   imageUrl?: string
 *   linkUrl?: string
 *   displayOrder?: number
 *   startDate?: string (YYYY-MM-DD)
 *   endDate?: string (YYYY-MM-DD)
 *   isActive?: boolean
 * }
 */
router.patch('/:bannerId', controller.updateBanner);

/**
 * 배너 삭제
 * DELETE /api/admin/banners/:bannerId
 *
 * Path Parameters:
 * - bannerId: string (배너 ID - bannerId 형식: BN000001)
 *
 * Note: 하드 삭제 (데이터베이스에서 완전히 제거)
 */
router.delete('/:bannerId', controller.deleteBanner);

/**
 * 배너 순서 변경
 * PATCH /api/admin/banners/:bannerId/order
 *
 * Path Parameters:
 * - bannerId: string (배너 ID - bannerId 형식: BN000001)
 *
 * Request Body:
 * {
 *   displayOrder: number - 필수 (새로운 표시 순서)
 * }
 */
router.patch('/:bannerId/order', controller.updateBannerOrder);

export default router;
