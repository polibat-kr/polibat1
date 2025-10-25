/**
 * Admin Suggestion Routes
 *
 * 건의사항 관리 라우트 정의
 */

import { Router } from 'express';
import { AdminSuggestionController } from './admin-suggestion.controller';
import { authenticateJwt } from '../../shared/middleware/authenticate';

const router = Router();
const controller = new AdminSuggestionController();

// 모든 라우트에 인증 미들웨어 적용 (관리자 전용)
router.use(authenticateJwt);

/**
 * 건의사항 목록 조회
 * GET /api/admin/suggestions
 *
 * Query Parameters:
 * - page?: number (default: 1)
 * - limit?: number (default: 20)
 * - search?: string (제목, 내용 검색)
 * - suggestionType?: SuggestionType (FEATURE, COMPLAINT, VOTE_PROPOSAL)
 * - status?: SuggestionStatus (PENDING, REVIEWING, RESOLVED, REJECTED, DEFERRED)
 * - sortBy?: 'createdAt' | 'repliedAt' (default: 'createdAt')
 * - sortOrder?: 'asc' | 'desc' (default: 'desc')
 * - startDate?: string (YYYY-MM-DD)
 * - endDate?: string (YYYY-MM-DD)
 */
router.get('/', controller.getSuggestions);

/**
 * 건의사항 상세 조회
 * GET /api/admin/suggestions/:suggestionId
 *
 * Path Parameters:
 * - suggestionId: string (건의사항 ID - suggestionId 형식: RC000001, RS000001)
 */
router.get('/:suggestionId', controller.getSuggestionDetail);

/**
 * 건의사항 생성
 * POST /api/admin/suggestions
 *
 * Request Body:
 * {
 *   suggestionType: SuggestionType (FEATURE, COMPLAINT, VOTE_PROPOSAL) - 필수
 *   title: string - 필수
 *   content: string - 필수
 *   userId: string - 필수 (실제로는 JWT에서 추출)
 * }
 *
 * Note: suggestionId 자동 생성
 * - COMPLAINT: RC000001
 * - FEATURE/VOTE_PROPOSAL: RS000001
 */
router.post('/', controller.createSuggestion);

/**
 * 관리자 답변 작성
 * PATCH /api/admin/suggestions/:suggestionId/reply
 *
 * Path Parameters:
 * - suggestionId: string (건의사항 ID - suggestionId 형식: RC000001, RS000001)
 *
 * Request Body:
 * {
 *   adminReply: string - 필수 (관리자 답변 내용)
 *   status?: SuggestionStatus (RESOLVED, REJECTED, DEFERRED) - 선택
 * }
 *
 * Note: adminId는 JWT에서 추출
 */
router.patch('/:suggestionId/reply', controller.replySuggestion);

/**
 * 건의사항 상태 변경
 * PATCH /api/admin/suggestions/:suggestionId/status
 *
 * Path Parameters:
 * - suggestionId: string (건의사항 ID - suggestionId 형식: RC000001, RS000001)
 *
 * Request Body:
 * {
 *   status: SuggestionStatus - 필수 (PENDING, REVIEWING, RESOLVED, REJECTED, DEFERRED)
 * }
 */
router.patch('/:suggestionId/status', controller.updateSuggestionStatus);

export default router;
