import { Request, Response, NextFunction } from 'express';
import { CommentService } from './comment.service';
import { successResponse, createdResponse } from '../../shared/utils/api-response';
import {
  GetCommentsQueryDto,
  CreateCommentRequestDto,
  UpdateCommentRequestDto,
} from './comment.dto';

/**
 * Comment Controller
 * HTTP 요청 처리 및 응답 생성
 */
export class CommentController {
  /**
   * 게시글의 댓글 목록 조회
   * GET /api/posts/:postId/comments
   */
  static async getCommentsByPostId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { postId } = req.params;
      const query: GetCommentsQueryDto = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        status: req.query.status as any,
        authorId: req.query.authorId as string,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any,
      };

      const result = await CommentService.getCommentsByPostId(postId, query);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 댓글 상세 조회
   * GET /api/comments/:commentId
   */
  static async getCommentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { commentId } = req.params;
      const result = await CommentService.getCommentById(commentId);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 댓글 작성
   * POST /api/posts/:postId/comments
   */
  static async createComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { postId } = req.params;
      const userId = (req as any).user?.userId;
      const data: CreateCommentRequestDto = req.body;
      const result = await CommentService.createComment(postId, userId, data);
      createdResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 댓글 수정
   * PATCH /api/comments/:commentId
   */
  static async updateComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { commentId } = req.params;
      const userId = (req as any).user?.userId;
      const data: UpdateCommentRequestDto = req.body;
      const result = await CommentService.updateComment(commentId, userId, data);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 댓글 삭제
   * DELETE /api/comments/:commentId
   */
  static async deleteComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { commentId } = req.params;
      const userId = (req as any).user?.userId;
      const isAdmin = (req as any).user?.memberType === 'ADMIN';

      await CommentService.deleteComment(commentId, userId, isAdmin);
      successResponse(res, { message: '댓글이 삭제되었습니다.' });
    } catch (error) {
      next(error);
    }
  }
}
