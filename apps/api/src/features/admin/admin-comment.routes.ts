/**
 * Admin Comment Management Routes
 *
 * @description
 * - 댓글 관리 라우트 정의
 * - 관리자 권한 필요 (authenticateJwt + requireAdmin)
 */

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AdminCommentController } from './admin-comment.controller';
import {
  authenticateJwt,
  requireAdmin,
} from '../../shared/middleware/authenticate';

const router = Router();
const prisma = new PrismaClient();
const controller = new AdminCommentController(prisma);

// 관리자 권한 필수
router.use(authenticateJwt, requireAdmin);

// 댓글 목록 조회
router.get('/', controller.getComments);

// 댓글 상태 변경
router.patch('/:commentId/status', controller.updateCommentStatus);

// 댓글 삭제 (Soft Delete)
router.delete('/:commentId', controller.deleteComment);

export default router;
