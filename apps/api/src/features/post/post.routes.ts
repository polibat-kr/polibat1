import { Router } from 'express';
import { PostController } from './post.controller';
import { validate } from '../../shared/middleware/validator';
import { authenticateJwt } from '../../shared/middleware/authenticate';
import { createPostSchema, updatePostSchema, getPostsSchema } from './post.validation';

const router = Router();

/**
 * 게시글 목록 조회
 * GET /api/posts
 */
router.get('/', validate(getPostsSchema), PostController.getPosts);

/**
 * 게시글 상세 조회
 * GET /api/posts/:postId
 */
router.get('/:postId', PostController.getPostById);

/**
 * 게시글 작성
 * POST /api/posts
 * @requires JWT 인증
 */
router.post('/', authenticateJwt, validate(createPostSchema), PostController.createPost);

/**
 * 게시글 수정
 * PATCH /api/posts/:postId
 * @requires JWT 인증
 */
router.patch('/:postId', authenticateJwt, validate(updatePostSchema), PostController.updatePost);

/**
 * 게시글 삭제
 * DELETE /api/posts/:postId
 * @requires JWT 인증
 */
router.delete('/:postId', authenticateJwt, PostController.deletePost);

export default router;
