/**
 * Admin Report Service
 *
 * 신고 관리 비즈니스 로직
 */

import { AdminReportRepository } from './admin-report.repository';
import {
  GetReportsQueryDto,
  ReportDto,
  GetReportsResponseDto,
  ProcessReportRequestDto,
  ProcessReportResponseDto,
} from './admin-report.dto';

export class AdminReportService {
  private repository: AdminReportRepository;

  constructor() {
    this.repository = new AdminReportRepository();
  }

  /**
   * 신고 목록 조회
   */
  async getReports(query: GetReportsQueryDto): Promise<GetReportsResponseDto> {
    const { page = 1, limit = 20 } = query;

    const { reports, total } = await this.repository.getReports(query);

    const reportDtos: ReportDto[] = reports.map((report: any) => ({
      id: report.id,
      reportId: report.reportId,
      reporterId: report.reporterId,
      reporterNickname: report.reporter.nickname,
      reporterMemberType: report.reporter.memberType,
      reportedUserId: report.reportedUserId,
      reportedUserNickname: report.reportedUser.nickname,
      reportedUserMemberType: report.reportedUser.memberType,
      targetType: report.targetType,
      targetId:
        report.targetType === 'POST'
          ? report.postId
          : report.targetType === 'COMMENT'
            ? report.commentId
            : null,
      targetTitle:
        report.targetType === 'POST' && report.post
          ? report.post.title
          : report.targetType === 'COMMENT' && report.comment
            ? report.comment.content.substring(0, 50) + '...'
            : null,
      reason: report.reason,
      status: report.status,
      adminId: report.adminId,
      adminNickname: null, // 필요 시 조회
      adminNote: report.adminNote,
      actionType: report.actionType,
      createdAt: report.createdAt,
      processedAt: report.processedAt,
    }));

    return {
      success: true,
      data: {
        reports: reportDtos,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  /**
   * 신고 처리
   */
  async processReport(
    reportId: string,
    adminId: string,
    requestDto: ProcessReportRequestDto
  ): Promise<ProcessReportResponseDto> {
    const { status, adminNote, actionType } = requestDto;

    // 신고 ID로 조회
    const report = await this.repository.getReportById(reportId);

    if (!report) {
      throw new Error('Report not found');
    }

    // 신고 상태 업데이트
    const { updatedReport, previousStatus, adminNickname } = await this.repository.processReport(
      report.id,
      status,
      adminId,
      adminNote,
      actionType
    );

    // 조치 타입에 따라 대상 게시글/댓글 상태 변경
    if (actionType) {
      await this.repository.applyActionToTarget(report.id, actionType);
    }

    return {
      success: true,
      data: {
        id: updatedReport.id,
        reportId: updatedReport.reportId,
        previousStatus,
        currentStatus: updatedReport.status,
        adminId: updatedReport.adminId!,
        adminNickname: adminNickname || 'Unknown',
        adminNote: updatedReport.adminNote,
        actionType: updatedReport.actionType,
        processedAt: updatedReport.processedAt!,
      },
    };
  }
}
