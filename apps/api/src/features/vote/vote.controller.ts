import { Request, Response, NextFunction } from 'express';
import { VoteService } from './vote.service';
import { successResponse, createdResponse } from '../../shared/utils/api-response';
import {
  CreateVoteRequestDto,
  UpdateVoteRequestDto,
  ParticipateVoteRequestDto,
} from './vote.dto';

/**
 * Vote Controller
 * HTTP 요청 처리 및 응답 생성
 */
export class VoteController {
  /**
   * 투표 생성
   * POST /api/votes
   */
  static async createVote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateVoteRequestDto = req.body;
      const result = await VoteService.createVote(data.postId, data);
      createdResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 투표 상세 조회
   * GET /api/votes/:voteId
   */
  static async getVoteById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { voteId } = req.params;
      const userId = (req as any).user?.userId;
      const result = await VoteService.getVoteById(voteId, userId);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 게시글 ID로 투표 조회
   * GET /api/posts/:postId/vote
   */
  static async getVoteByPostId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { postId } = req.params;
      const userId = (req as any).user?.userId;
      const result = await VoteService.getVoteByPostId(postId, userId);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 투표 수정
   * PATCH /api/votes/:voteId
   */
  static async updateVote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { voteId } = req.params;
      const data: UpdateVoteRequestDto = req.body;
      const result = await VoteService.updateVote(voteId, data);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 투표 삭제
   * DELETE /api/votes/:voteId
   */
  static async deleteVote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { voteId } = req.params;
      await VoteService.deleteVote(voteId);
      successResponse(res, { message: '투표가 삭제되었습니다.' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 투표 참여
   * POST /api/votes/:voteId/participate
   */
  static async participateVote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { voteId } = req.params;
      const userId = (req as any).user?.userId;
      const data: ParticipateVoteRequestDto = req.body;
      const result = await VoteService.participateVote(voteId, userId, data);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 투표 참여 취소
   * DELETE /api/votes/:voteId/participate
   */
  static async cancelParticipation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { voteId } = req.params;
      const userId = (req as any).user?.userId;
      await VoteService.cancelParticipation(voteId, userId);
      successResponse(res, { message: '투표 참여가 취소되었습니다.' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 투표 결과 조회
   * GET /api/votes/:voteId/results
   */
  static async getVoteResults(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { voteId } = req.params;
      const userId = (req as any).user?.userId;
      const result = await VoteService.getVoteResults(voteId, userId);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 투표 종료 (관리자)
   * PATCH /api/votes/:voteId/close
   */
  static async closeVote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { voteId } = req.params;
      const result = await VoteService.closeVote(voteId);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 투표 통계 조회
   * GET /api/votes/stats
   */
  static async getVoteStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await VoteService.getVoteStats();
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }
}
