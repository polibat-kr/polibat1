/**
 * Admin Popup Routes
 *
 * 팝업 관리 라우트 정의
 */

import { Router } from 'express';
import { AdminPopupController } from './admin-popup.controller';
import { authenticateJwt } from '../../shared/middleware/authenticate';

const router = Router();
const controller = new AdminPopupController();

// 모든 라우트에 인증 미들웨어 적용 (관리자 전용)
router.use(authenticateJwt);

/**
 * 팝업 목록 조회
 * GET /api/admin/popups
 *
 * Query Parameters:
 * - page?: number (default: 1)
 * - limit?: number (default: 20)
 * - search?: string (제목, 내용 검색)
 * - position?: PopupPosition (CENTER, TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT)
 * - isActive?: boolean (true/false)
 * - sortBy?: 'createdAt' | 'updatedAt' | 'startDate' | 'endDate' (default: 'createdAt')
 * - sortOrder?: 'asc' | 'desc' (default: 'desc')
 * - startDate?: string (YYYY-MM-DD, 노출 시작일 필터)
 * - endDate?: string (YYYY-MM-DD, 노출 종료일 필터)
 */
router.get('/', controller.getPopups);

/**
 * 팝업 상세 조회
 * GET /api/admin/popups/:popupId
 *
 * Path Parameters:
 * - popupId: string (팝업 ID - popupId 형식: PU000001)
 */
router.get('/:popupId', controller.getPopupDetail);

/**
 * 팝업 생성
 * POST /api/admin/popups
 *
 * Request Body:
 * {
 *   title: string - 필수
 *   content: string - 필수
 *   imageUrl?: string (이미지 URL)
 *   linkUrl?: string (링크 URL)
 *   position?: PopupPosition (default: CENTER)
 *   startDate: string - 필수 (YYYY-MM-DD)
 *   endDate: string - 필수 (YYYY-MM-DD)
 *   isActive?: boolean (default: true)
 * }
 */
router.post('/', controller.createPopup);

/**
 * 팝업 수정
 * PATCH /api/admin/popups/:popupId
 *
 * Path Parameters:
 * - popupId: string (팝업 ID - popupId 형식: PU000001)
 *
 * Request Body:
 * {
 *   title?: string
 *   content?: string
 *   imageUrl?: string
 *   linkUrl?: string
 *   position?: PopupPosition
 *   startDate?: string (YYYY-MM-DD)
 *   endDate?: string (YYYY-MM-DD)
 *   isActive?: boolean
 * }
 */
router.patch('/:popupId', controller.updatePopup);

/**
 * 팝업 삭제
 * DELETE /api/admin/popups/:popupId
 *
 * Path Parameters:
 * - popupId: string (팝업 ID - popupId 형식: PU000001)
 *
 * Note: 하드 삭제 (데이터베이스에서 완전히 제거)
 */
router.delete('/:popupId', controller.deletePopup);

export default router;
