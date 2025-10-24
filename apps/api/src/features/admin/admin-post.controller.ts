/**
 * Admin Post Management Controller
 *
 * @description
 * - 게시글 관리 요청/응답 처리
 * - 관리자 권한 필요
 */

import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AdminPostService } from './admin-post.service';
import type {
  GetPostsQueryDto,
  UpdatePostStatusRequestDto,
} from './admin-post.dto';

export class AdminPostController {
  private service: AdminPostService;

  constructor(prisma: PrismaClient) {
    this.service = new AdminPostService(prisma);
  }

  /**
   * 게시글 목록 조회
   * GET /api/admin/posts
   */
  getPosts = async (req: Request, res: Response): Promise<void> => {
    try {
      const query: GetPostsQueryDto = {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        search: req.query.search as string | undefined,
        boardType: req.query.boardType as any,
        status: req.query.status as any,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any,
        startDate: req.query.startDate as string | undefined,
        endDate: req.query.endDate as string | undefined,
        authorId: req.query.authorId as string | undefined,
      };

      const result = await this.service.getPosts(query);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error in getPosts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch posts',
      });
    }
  };

  /**
   * 게시글 상세 조회
   * GET /api/admin/posts/:postId
   */
  getPostById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { postId } = req.params;

      const post = await this.service.getPostById(postId);

      res.json({
        success: true,
        data: post,
      });
    } catch (error) {
      console.error('Error in getPostById:', error);
      if ((error as Error).message === 'Post not found') {
        res.status(404).json({
          success: false,
          error: 'Post not found',
        });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Failed to fetch post',
      });
    }
  };

  /**
   * 게시글 상태 변경
   * PATCH /api/admin/posts/:postId/status
   */
  updatePostStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { postId } = req.params;
      const adminId = (req as any).user?.id;

      if (!adminId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const statusData: UpdatePostStatusRequestDto = {
        status: req.body.status,
        reason: req.body.reason,
      };

      const result = await this.service.updatePostStatus(
        postId,
        statusData,
        adminId
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error in updatePostStatus:', error);
      if ((error as Error).message === 'Post not found') {
        res.status(404).json({
          success: false,
          error: 'Post not found',
        });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Failed to update post status',
      });
    }
  };

  /**
   * 게시글 삭제 (Soft Delete)
   * DELETE /api/admin/posts/:postId
   */
  deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
      const { postId } = req.params;
      const adminId = (req as any).user?.id;

      if (!adminId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const result = await this.service.deletePost(postId, adminId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error in deletePost:', error);
      if ((error as Error).message === 'Post not found') {
        res.status(404).json({
          success: false,
          error: 'Post not found',
        });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Failed to delete post',
      });
    }
  };
}
