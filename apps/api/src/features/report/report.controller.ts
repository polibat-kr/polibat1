/**
 * Report Controller
 * 신고 HTTP 요청/응답 처리
 */

import { Request, Response, NextFunction } from 'express';
import { ReportService } from './report.service';
import { CreateReportDto, ProcessReportDto, GetReportsQueryDto } from './report.dto';

export class ReportController {
  /**
   * POST /api/reports
   * 신고 생성
   */
  static async createReport(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const dto: CreateReportDto = req.body;

      const report = await ReportService.createReport(userId, dto);

      return res.status(201).json({
        message: '신고가 접수되었습니다.',
        report,
      });
    } catch (error: any) {
      console.error('Create report error:', error);

      if (error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }

      if (error.message === 'Cannot report your own content') {
        return res.status(400).json({ message: '자신의 게시글/댓글은 신고할 수 없습니다.' });
      }

      if (error.message === 'You have already reported this content') {
        return res.status(409).json({ message: '이미 신고한 내용입니다.' });
      }

      return res.status(500).json({ message: '신고 접수 중 오류가 발생했습니다.' });
    }
  }

  /**
   * GET /api/reports/:reportId
   * 신고 상세 조회
   */
  static async getReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { reportId } = req.params;

      const report = await ReportService.getReportByReportId(reportId);

      return res.status(200).json(report);
    } catch (error: any) {
      console.error('Get report error:', error);

      if (error.message === 'Report not found') {
        return res.status(404).json({ message: '신고를 찾을 수 없습니다.' });
      }

      return res.status(500).json({ message: '신고 조회 중 오류가 발생했습니다.' });
    }
  }

  /**
   * GET /api/reports
   * 신고 목록 조회 (관리자)
   */
  static async getReports(req: Request, res: Response, next: NextFunction) {
    try {
      const query: GetReportsQueryDto = {
        status: req.query.status as any,
        targetType: req.query.targetType as any,
        reporterId: req.query.reporterId as string,
        reportedUserId: req.query.reportedUserId as string,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any,
      };

      const result = await ReportService.getReports(query);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Get reports error:', error);
      return res.status(500).json({ message: '신고 목록 조회 중 오류가 발생했습니다.' });
    }
  }

  /**
   * GET /api/reports/my
   * 내가 신고한 목록 조회
   */
  static async getMyReports(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const query: GetReportsQueryDto = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        status: req.query.status as any,
      };

      const result = await ReportService.getMyReports(userId, query);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Get my reports error:', error);
      return res.status(500).json({ message: '신고 목록 조회 중 오류가 발생했습니다.' });
    }
  }

  /**
   * PATCH /api/reports/:reportId/process
   * 신고 처리 (관리자)
   */
  static async processReport(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // TODO: 관리자 권한 확인 (추후 구현)
      // if (req.user.type !== 'ADMIN') {
      //   return res.status(403).json({ message: 'Admin access required' });
      // }

      const { reportId } = req.params;
      const dto: ProcessReportDto = req.body;

      const report = await ReportService.processReport(reportId, userId, dto);

      return res.status(200).json({
        message: '신고가 처리되었습니다.',
        report,
      });
    } catch (error: any) {
      console.error('Process report error:', error);

      if (error.message === 'Report not found') {
        return res.status(404).json({ message: '신고를 찾을 수 없습니다.' });
      }

      return res.status(500).json({ message: '신고 처리 중 오류가 발생했습니다.' });
    }
  }

  /**
   * DELETE /api/reports/:reportId
   * 신고 삭제 (본인만)
   */
  static async deleteReport(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { reportId } = req.params;

      await ReportService.deleteReport(reportId, userId);

      return res.status(200).json({ message: '신고가 삭제되었습니다.' });
    } catch (error: any) {
      console.error('Delete report error:', error);

      if (error.message === 'Report not found') {
        return res.status(404).json({ message: '신고를 찾을 수 없습니다.' });
      }

      if (error.message === 'Unauthorized to delete this report') {
        return res.status(403).json({ message: '신고 삭제 권한이 없습니다.' });
      }

      if (error.message === 'Cannot delete report that is already being processed') {
        return res.status(400).json({ message: '처리 중인 신고는 삭제할 수 없습니다.' });
      }

      return res.status(500).json({ message: '신고 삭제 중 오류가 발생했습니다.' });
    }
  }
}
