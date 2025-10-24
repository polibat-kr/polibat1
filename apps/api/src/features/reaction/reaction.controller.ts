/**
 * Reaction Controller
 * 반응(좋아요/싫어요) HTTP 요청/응답 처리
 */

import { Request, Response, NextFunction } from 'express';
import { ReactionService } from './reaction.service';
import { CreateReactionDto, GetReactionsQueryDto } from './reaction.dto';
import { ReactionTargetType } from '@prisma/client';

export class ReactionController {
  /**
   * POST /api/reactions
   * 반응 추가 또는 변경 (토글)
   */
  static async addOrUpdateReaction(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const dto: CreateReactionDto = req.body;

      const result = await ReactionService.addOrUpdateReaction(userId, dto);

      if (result.action === 'deleted') {
        return res.status(200).json({
          message: '반응이 취소되었습니다.',
          action: result.action,
        });
      }

      return res.status(result.action === 'created' ? 201 : 200).json({
        message:
          result.action === 'created' ? '반응이 추가되었습니다.' : '반응이 변경되었습니다.',
        action: result.action,
        reaction: result.reaction,
      });
    } catch (error: any) {
      console.error('Add/Update reaction error:', error);

      if (error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }

      return res.status(500).json({ message: '반응 처리 중 오류가 발생했습니다.' });
    }
  }

  /**
   * DELETE /api/reactions/:reactionId
   * 반응 삭제
   */
  static async deleteReaction(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { reactionId } = req.params;

      await ReactionService.deleteReaction(reactionId, userId);

      return res.status(200).json({ message: '반응이 삭제되었습니다.' });
    } catch (error: any) {
      console.error('Delete reaction error:', error);

      if (error.message === 'Reaction not found') {
        return res.status(404).json({ message: '반응을 찾을 수 없습니다.' });
      }

      if (error.message === 'Unauthorized to delete this reaction') {
        return res.status(403).json({ message: '반응 삭제 권한이 없습니다.' });
      }

      return res.status(500).json({ message: '반응 삭제 중 오류가 발생했습니다.' });
    }
  }

  /**
   * GET /api/posts/:postId/reactions
   * 게시글의 반응 목록 조회
   */
  static async getPostReactions(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const query: GetReactionsQueryDto = {
        reactionType: req.query.reactionType as any,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      };

      const userId = req.user?.id;

      const result = await ReactionService.getReactionsByTarget('POST', postId, query, userId);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Get post reactions error:', error);

      if (error.message.includes('not found')) {
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
      }

      return res.status(500).json({ message: '반응 목록 조회 중 오류가 발생했습니다.' });
    }
  }

  /**
   * GET /api/comments/:commentId/reactions
   * 댓글의 반응 목록 조회
   */
  static async getCommentReactions(req: Request, res: Response, next: NextFunction) {
    try {
      const { commentId } = req.params;
      const query: GetReactionsQueryDto = {
        reactionType: req.query.reactionType as any,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      };

      const userId = req.user?.id;

      const result = await ReactionService.getReactionsByTarget(
        'COMMENT',
        commentId,
        query,
        userId
      );

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Get comment reactions error:', error);

      if (error.message.includes('not found')) {
        return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
      }

      return res.status(500).json({ message: '반응 목록 조회 중 오류가 발생했습니다.' });
    }
  }

  /**
   * GET /api/reactions/stats/:targetType/:targetId
   * 반응 통계 조회
   */
  static async getReactionStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { targetType, targetId } = req.params;
      const userId = req.user?.id;

      const stats = await ReactionService.getReactionStats(
        targetType as ReactionTargetType,
        targetId,
        userId
      );

      return res.status(200).json(stats);
    } catch (error: any) {
      console.error('Get reaction stats error:', error);

      if (error.message.includes('not found')) {
        return res.status(404).json({ message: '대상을 찾을 수 없습니다.' });
      }

      return res.status(500).json({ message: '통계 조회 중 오류가 발생했습니다.' });
    }
  }
}
