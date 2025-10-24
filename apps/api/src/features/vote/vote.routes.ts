import { Router } from 'express';
import { VoteController } from './vote.controller';
import { authenticateJwt } from '../../shared/middleware/authenticate';
import { validate } from '../../shared/middleware/validator';
import {
  createVoteSchema,
  updateVoteSchema,
  participateVoteSchema,
} from './vote.validation';

const router = Router();

/**
 * 투표 통계 조회
 * GET /api/votes/stats
 */
router.get('/stats', VoteController.getVoteStats);

/**
 * 투표 생성
 * POST /api/votes
 * @requires Authentication
 */
router.post('/', authenticateJwt, validate(createVoteSchema), VoteController.createVote);

/**
 * 투표 상세 조회
 * GET /api/votes/:voteId
 * @optional Authentication (인증 시 사용자 투표 여부 포함)
 */
router.get('/:voteId', VoteController.getVoteById);

/**
 * 투표 수정
 * PATCH /api/votes/:voteId
 * @requires Authentication
 */
router.patch(
  '/:voteId',
  authenticateJwt,
  validate(updateVoteSchema),
  VoteController.updateVote
);

/**
 * 투표 삭제
 * DELETE /api/votes/:voteId
 * @requires Authentication
 */
router.delete('/:voteId', authenticateJwt, VoteController.deleteVote);

/**
 * 투표 참여
 * POST /api/votes/:voteId/participate
 * @requires Authentication
 */
router.post(
  '/:voteId/participate',
  authenticateJwt,
  validate(participateVoteSchema),
  VoteController.participateVote
);

/**
 * 투표 참여 취소
 * DELETE /api/votes/:voteId/participate
 * @requires Authentication
 */
router.delete('/:voteId/participate', authenticateJwt, VoteController.cancelParticipation);

/**
 * 투표 결과 조회
 * GET /api/votes/:voteId/results
 * @optional Authentication (인증 시 사용자 투표 여부 포함)
 */
router.get('/:voteId/results', VoteController.getVoteResults);

/**
 * 투표 종료 (관리자)
 * PATCH /api/votes/:voteId/close
 * @requires Authentication
 * @todo 관리자 권한 체크 미들웨어 추가
 */
router.patch('/:voteId/close', authenticateJwt, VoteController.closeVote);

export default router;
