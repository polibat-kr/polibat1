import { Request, Response, NextFunction } from 'express';
import { PostService } from './post.service';
import { successResponse, createdResponse } from '../../shared/utils/api-response';
import {
  GetPostsQueryDto,
  CreatePostRequestDto,
  UpdatePostRequestDto,
} from './post.dto';

/**
 * Post Controller
 * HTTP 요청 처리 및 응답 생성
 */
export class PostController {
  /**
   * 게시글 목록 조회
   * GET /api/posts
   */
  static async getPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query: GetPostsQueryDto = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        boardType: req.query.boardType as any,
        status: req.query.status as any,
        authorId: req.query.authorId as string,
        search: req.query.search as string,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any,
      };

      const result = await PostService.getPosts(query);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 게시글 상세 조회
   * GET /api/posts/:postId
   */
  static async getPostById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { postId } = req.params;
      const result = await PostService.getPostById(postId);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 게시글 작성
   * POST /api/posts
   */
  static async createPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const data: CreatePostRequestDto = req.body;
      const result = await PostService.createPost(userId, data);
      createdResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 게시글 수정
   * PATCH /api/posts/:postId
   */
  static async updatePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { postId } = req.params;
      const userId = (req as any).user?.userId;
      const data: UpdatePostRequestDto = req.body;
      const result = await PostService.updatePost(postId, userId, data);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 게시글 삭제
   * DELETE /api/posts/:postId
   */
  static async deletePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { postId } = req.params;
      const userId = (req as any).user?.userId;
      const isAdmin = (req as any).user?.memberType === 'ADMIN';

      await PostService.deletePost(postId, userId, isAdmin);
      successResponse(res, { message: '게시글이 삭제되었습니다.' });
    } catch (error) {
      next(error);
    }
  }
}
