import { Router } from 'express';
import { CommentController } from './comment.controller';
import { validate } from '../../shared/middleware/validator';
import { authenticateJwt } from '../../shared/middleware/authenticate';
import { createCommentSchema, updateCommentSchema, getCommentsSchema } from './comment.validation';

const router = Router();

/**
 * 게시글의 댓글 목록 조회
 * GET /api/posts/:postId/comments
 */
router.get('/posts/:postId/comments', validate(getCommentsSchema), CommentController.getCommentsByPostId);

/**
 * 댓글 상세 조회
 * GET /api/comments/:commentId
 */
router.get('/comments/:commentId', CommentController.getCommentById);

/**
 * 댓글 작성
 * POST /api/posts/:postId/comments
 * @requires JWT 인증
 */
router.post(
  '/posts/:postId/comments',
  authenticateJwt,
  validate(createCommentSchema),
  CommentController.createComment
);

/**
 * 댓글 수정
 * PATCH /api/comments/:commentId
 * @requires JWT 인증
 */
router.patch(
  '/comments/:commentId',
  authenticateJwt,
  validate(updateCommentSchema),
  CommentController.updateComment
);

/**
 * 댓글 삭제
 * DELETE /api/comments/:commentId
 * @requires JWT 인증
 */
router.delete('/comments/:commentId', authenticateJwt, CommentController.deleteComment);

export default router;
