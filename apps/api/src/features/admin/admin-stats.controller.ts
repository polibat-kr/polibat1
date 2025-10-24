/**
 * Admin Statistics Controller
 *
 * @description
 * - 관리자 통계 API 요청 처리
 * - 관리자 권한 필수
 */

import { Request, Response, NextFunction } from 'express';
import { AdminStatsService } from './admin-stats.service';
import { successResponse } from '../../shared/utils/api-response';
import { PeriodType } from './admin-stats.dto';

export class AdminStatsController {
  /**
   * 대시보드 전체 통계 조회
   * GET /api/admin/stats/dashboard
   */
  static async getDashboardStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const includePeriod = req.query.includePeriod === 'true';
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;

      const stats = await AdminStatsService.getDashboardStats(includePeriod, days);

      successResponse(res, stats);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 회원 통계 조회
   * GET /api/admin/stats/members
   */
  static async getMemberStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const period = req.query.period as PeriodType | undefined;
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;

      const stats = await AdminStatsService.getMemberStats(period, days);

      successResponse(res, stats);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 게시글 통계 조회
   * GET /api/admin/stats/posts
   */
  static async getPostStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const period = req.query.period as PeriodType | undefined;
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;

      const stats = await AdminStatsService.getPostStats(period, days);

      successResponse(res, stats);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 댓글 통계 조회
   * GET /api/admin/stats/comments
   */
  static async getCommentStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const period = req.query.period as PeriodType | undefined;
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;

      const stats = await AdminStatsService.getCommentStats(period, days);

      successResponse(res, stats);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 투표 통계 조회
   * GET /api/admin/stats/votes
   */
  static async getVoteStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const period = req.query.period as PeriodType | undefined;
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;

      const stats = await AdminStatsService.getVoteStats(period, days);

      successResponse(res, stats);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 신고 통계 조회
   * GET /api/admin/stats/reports
   */
  static async getReportStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const period = req.query.period as PeriodType | undefined;
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;

      const stats = await AdminStatsService.getReportStats(period, days);

      successResponse(res, stats);
    } catch (error) {
      next(error);
    }
  }
}
