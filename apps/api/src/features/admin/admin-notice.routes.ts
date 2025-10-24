/**
 * Admin Notice Routes
 *
 * 공지사항 관리 라우트 정의
 */

import { Router } from 'express';
import { AdminNoticeController } from './admin-notice.controller';
import { authenticateJwt } from '../../shared/middleware/authenticate';

const router = Router();
const controller = new AdminNoticeController();

// 모든 라우트에 인증 미들웨어 적용 (관리자 전용)
router.use(authenticateJwt);

/**
 * 공지사항 목록 조회
 * GET /api/admin/notices
 *
 * Query Parameters:
 * - page?: number (default: 1)
 * - limit?: number (default: 20)
 * - search?: string (제목, 내용 검색)
 * - category?: NoticeCategory (GUIDE, UPDATE, COMMUNICATION, EXTERNAL)
 * - isPinned?: boolean (true/false)
 * - sortBy?: 'createdAt' | 'updatedAt' | 'viewCount' (default: 'createdAt')
 * - sortOrder?: 'asc' | 'desc' (default: 'desc')
 * - startDate?: string (YYYY-MM-DD)
 * - endDate?: string (YYYY-MM-DD)
 */
router.get('/', controller.getNotices);

/**
 * 공지사항 상세 조회
 * GET /api/admin/notices/:noticeId
 *
 * Path Parameters:
 * - noticeId: string (공지사항 ID - noticeId 형식: NT000001)
 *
 * Note: 조회 시 viewCount 자동 증가
 */
router.get('/:noticeId', controller.getNoticeDetail);

/**
 * 공지사항 생성
 * POST /api/admin/notices
 *
 * Request Body:
 * {
 *   category: NoticeCategory (GUIDE, UPDATE, COMMUNICATION, EXTERNAL) - 필수
 *   title: string - 필수
 *   content: string - 필수
 *   isPinned?: boolean (default: false)
 * }
 */
router.post('/', controller.createNotice);

/**
 * 공지사항 수정
 * PATCH /api/admin/notices/:noticeId
 *
 * Path Parameters:
 * - noticeId: string (공지사항 ID - noticeId 형식: NT000001)
 *
 * Request Body:
 * {
 *   category?: NoticeCategory
 *   title?: string
 *   content?: string
 *   isPinned?: boolean
 * }
 */
router.patch('/:noticeId', controller.updateNotice);

/**
 * 공지사항 삭제
 * DELETE /api/admin/notices/:noticeId
 *
 * Path Parameters:
 * - noticeId: string (공지사항 ID - noticeId 형식: NT000001)
 *
 * Note: 하드 삭제 (데이터베이스에서 완전히 제거)
 */
router.delete('/:noticeId', controller.deleteNotice);

/**
 * 공지사항 상단 고정/해제
 * PATCH /api/admin/notices/:noticeId/pin
 *
 * Path Parameters:
 * - noticeId: string (공지사항 ID - noticeId 형식: NT000001)
 *
 * Request Body:
 * {
 *   isPinned: boolean - 필수 (true: 고정, false: 해제)
 * }
 */
router.patch('/:noticeId/pin', controller.togglePin);

export default router;
