/**
 * Reaction Routes
 * 반응(좋아요/싫어요) API 라우트 정의
 */

import { Router } from 'express';
import { ReactionController } from './reaction.controller';
import { authenticateJwt } from '../../shared/middleware/authenticate';
import { validate } from '../../shared/middleware/validator';
import {
  createReactionSchema,
  getReactionsSchema,
  getReactionStatsSchema,
  deleteReactionSchema,
} from './reaction.validation';

const router = Router();

/**
 * POST /api/reactions
 * 반응 추가/변경 (인증 필요)
 */
router.post(
  '/reactions',
  authenticateJwt,
  validate(createReactionSchema),
  ReactionController.addOrUpdateReaction
);

/**
 * DELETE /api/reactions/:reactionId
 * 반응 삭제 (인증 필요)
 */
router.delete(
  '/reactions/:reactionId',
  authenticateJwt,
  validate(deleteReactionSchema),
  ReactionController.deleteReaction
);

/**
 * GET /api/posts/:postId/reactions
 * 게시글 반응 목록 조회 (인증 선택)
 */
router.get(
  '/posts/:postId/reactions',
  validate(getReactionsSchema),
  ReactionController.getPostReactions
);

/**
 * GET /api/comments/:commentId/reactions
 * 댓글 반응 목록 조회 (인증 선택)
 */
router.get(
  '/comments/:commentId/reactions',
  validate(getReactionsSchema),
  ReactionController.getCommentReactions
);

/**
 * GET /api/reactions/stats/:targetType/:targetId
 * 반응 통계 조회 (인증 선택)
 */
router.get(
  '/reactions/stats/:targetType/:targetId',
  validate(getReactionStatsSchema),
  ReactionController.getReactionStats
);

export default router;
