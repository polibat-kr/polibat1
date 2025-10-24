/**
 * Admin Report Controller
 *
 * 신고 관리 요청/응답 처리
 */

import { Request, Response } from 'express';
import { AdminReportService } from './admin-report.service';
import { GetReportsQueryDto, ProcessReportRequestDto } from './admin-report.dto';

export class AdminReportController {
  private service: AdminReportService;

  constructor() {
    this.service = new AdminReportService();
  }

  /**
   * 신고 목록 조회
   * GET /api/admin/reports
   */
  getReports = async (req: Request, res: Response) => {
    try {
      const query: GetReportsQueryDto = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        search: req.query.search as string,
        status: req.query.status as any,
        targetType: req.query.targetType as any,
        reporterId: req.query.reporterId as string,
        reportedUserId: req.query.reportedUserId as string,
        sortBy: (req.query.sortBy as 'createdAt' | 'processedAt') || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };

      const result = await this.service.getReports(query);

      res.status(200).json(result);
    } catch (error: any) {
      console.error('Get reports error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to get reports',
        },
      });
    }
  };

  /**
   * 신고 처리
   * PATCH /api/admin/reports/:reportId/process
   */
  processReport = async (req: Request, res: Response): Promise<void> => {
    try {
      const { reportId } = req.params;
      const adminId = req.user?.userId; // JWT 미들웨어에서 주입

      if (!adminId) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Admin authentication required',
          },
        });
      }

      const requestDto: ProcessReportRequestDto = {
        status: req.body.status,
        adminNote: req.body.adminNote,
        actionType: req.body.actionType,
      };

      // 필수 필드 검증
      if (!requestDto.status) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Status is required',
          },
        });
      }

      const result = await this.service.processReport(reportId, adminId, requestDto);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Process report error:', error);

      if (error.message === 'Report not found') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'REPORT_NOT_FOUND',
            message: 'Report not found',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to process report',
        },
      });
    }
  };
}
