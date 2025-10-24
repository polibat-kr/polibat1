/**
 * Admin Post Management Routes
 *
 * @description
 * - 게시글 관리 라우트 정의
 * - 관리자 권한 필요 (authenticateJwt + requireAdmin)
 */

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AdminPostController } from './admin-post.controller';
import {
  authenticateJwt,
  requireAdmin,
} from '../../shared/middleware/authenticate';

const router = Router();
const prisma = new PrismaClient();
const controller = new AdminPostController(prisma);

// 관리자 권한 필수
router.use(authenticateJwt, requireAdmin);

// 게시글 목록 조회
router.get('/', controller.getPosts);

// 게시글 상세 조회
router.get('/:postId', controller.getPostById);

// 게시글 상태 변경
router.patch('/:postId/status', controller.updatePostStatus);

// 게시글 삭제 (Soft Delete)
router.delete('/:postId', controller.deletePost);

export default router;
