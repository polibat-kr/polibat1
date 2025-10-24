/**
 * Admin Comment Management Controller
 *
 * @description
 * - 댓글 관리 요청/응답 처리
 * - 관리자 권한 필요
 */

import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AdminCommentRepository } from './admin-comment.repository';
import { AdminCommentService } from './admin-comment.service';
import type {
  GetCommentsQueryDto,
  UpdateCommentStatusRequestDto,
} from './admin-comment.dto';

export class AdminCommentController {
  private service: AdminCommentService;

  constructor(prisma: PrismaClient) {
    const repository = new AdminCommentRepository(prisma);
    this.service = new AdminCommentService(repository);
  }

  /**
   * 댓글 목록 조회
   * GET /api/admin/comments
   */
  getComments = async (req: Request, res: Response): Promise<void> => {
    try {
      const query: GetCommentsQueryDto = {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        search: req.query.search as string | undefined,
        postId: req.query.postId as string | undefined,
        authorId: req.query.authorId as string | undefined,
        status: req.query.status as any,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any,
        startDate: req.query.startDate as string | undefined,
        endDate: req.query.endDate as string | undefined,
      };

      const result = await this.service.getComments(query);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error in getComments:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch comments',
      });
    }
  };

  /**
   * 댓글 상태 변경
   * PATCH /api/admin/comments/:commentId/status
   */
  updateCommentStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { commentId } = req.params;
      const adminId = (req as any).user?.id;

      if (!adminId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const statusData: UpdateCommentStatusRequestDto = {
        status: req.body.status,
        reason: req.body.reason,
      };

      const result = await this.service.updateCommentStatus(
        commentId,
        statusData,
        adminId,
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error in updateCommentStatus:', error);
      if ((error as Error).message === 'Comment not found') {
        res.status(404).json({
          success: false,
          error: 'Comment not found',
        });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Failed to update comment status',
      });
    }
  };

  /**
   * 댓글 삭제 (Soft Delete)
   * DELETE /api/admin/comments/:commentId
   */
  deleteComment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { commentId } = req.params;
      const adminId = (req as any).user?.id;

      if (!adminId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const result = await this.service.deleteComment(commentId, adminId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error in deleteComment:', error);
      if ((error as Error).message === 'Comment not found') {
        res.status(404).json({
          success: false,
          error: 'Comment not found',
        });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Failed to delete comment',
      });
    }
  };
}
