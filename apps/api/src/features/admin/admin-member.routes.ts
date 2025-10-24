/**
 * Admin Member Management Routes
 *
 * @description
 * - 관리자 회원 관리 API 라우트 정의
 * - 모든 라우트는 관리자 권한 필요
 */

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AdminMemberService } from './admin-member.service';
import { AdminMemberController } from './admin-member.controller';
import { authenticateJwt, requireAdmin } from '../../shared/middleware/authenticate';

const router = Router();
const prisma = new PrismaClient();

// Service & Controller 인스턴스 생성
const service = new AdminMemberService(prisma);
const controller = new AdminMemberController(service);

/**
 * 모든 Admin Member API는 관리자 권한 필요
 */
router.use(authenticateJwt, requireAdmin);

/**
 * 회원 상태 변경 이력 조회 (먼저 정의 - 라우트 우선순위)
 * GET /api/admin/members/status-history
 *
 * Query Parameters:
 * - memberId: 특정 회원의 이력만 조회 (선택)
 * - page: 페이지 번호 (default: 1)
 * - limit: 페이지당 개수 (default: 20)
 * - startDate: 시작 날짜 (YYYY-MM-DD)
 * - endDate: 종료 날짜 (YYYY-MM-DD)
 *
 * Response:
 * - history: 상태 변경 이력 목록
 * - pagination: 페이지네이션 정보
 */
router.get('/status-history', controller.getMemberStatusHistory);

/**
 * 회원 목록 조회 (페이지네이션, 필터링, 정렬)
 * GET /api/admin/members
 *
 * Query Parameters:
 * - page: 페이지 번호 (default: 1)
 * - limit: 페이지당 개수 (default: 20)
 * - search: 검색어 (이름, 이메일, 닉네임)
 * - memberType: 회원 유형 필터 (NORMAL, POLITICIAN, ASSISTANT, ADMIN)
 * - status: 상태 필터 (APPROVED, PENDING, SUSPENDED, BANNED, WITHDRAWN)
 * - politicianType: 정치인 유형 필터 (NATIONAL, LOCAL, CANDIDATE, ETC)
 * - sortBy: 정렬 기준 (createdAt, lastLoginAt, nickname)
 * - sortOrder: 정렬 순서 (asc, desc)
 * - startDate: 가입일 시작 (YYYY-MM-DD)
 * - endDate: 가입일 종료 (YYYY-MM-DD)
 *
 * Response:
 * - members: 회원 목록
 * - pagination: 페이지네이션 정보
 */
router.get('/', controller.getMembers);

/**
 * 회원 상세 조회
 * GET /api/admin/members/:memberId
 *
 * Response:
 * - 회원 상세 정보
 * - 통계 (게시글, 댓글, 반응, 신고)
 * - 최근 활동 (게시글 5개, 댓글 5개)
 */
router.get('/:memberId', controller.getMemberById);

/**
 * 회원 상태 변경
 * PATCH /api/admin/members/:memberId/status
 *
 * Request Body:
 * - status: 변경할 상태 (APPROVED, PENDING, SUSPENDED, BANNED, WITHDRAWN)
 * - reason: 변경 사유 (선택)
 *
 * Response:
 * - id: 회원 ID
 * - memberId: 회원 고유 ID
 * - previousStatus: 이전 상태
 * - currentStatus: 현재 상태
 * - reason: 변경 사유
 * - changedBy: 변경한 관리자 ID
 * - changedAt: 변경 시각
 */
router.patch('/:memberId/status', controller.updateMemberStatus);

export default router;
