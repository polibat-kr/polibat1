/**
 * Report Service
 * 신고 비즈니스 로직 처리
 */

import { PrismaClient, ReportTargetType, ActionType } from '@prisma/client';
import { ReportRepository } from './report.repository';
import {
  CreateReportDto,
  ProcessReportDto,
  ReportResponseDto,
  GetReportsQueryDto,
  ReportListResponseDto,
} from './report.dto';

const prisma = new PrismaClient();

export class ReportService {
  /**
   * 신고 생성
   *
   * 로직:
   * 1. targetId (postId/commentId)로 UUID 및 작성자 조회
   * 2. 중복 신고 확인 (같은 사용자가 같은 대상을 이미 신고했는지)
   * 3. 자신의 게시글/댓글은 신고 불가
   * 4. 신고 생성
   */
  static async createReport(userId: string, dto: CreateReportDto): Promise<ReportResponseDto> {
    const { targetType, targetId, reason } = dto;

    // 1. targetId로 UUID 및 작성자 조회
    const { uuid, authorId } = await this.getTargetInfo(targetType, targetId);

    if (!uuid) {
      throw new Error(`${targetType} not found: ${targetId}`);
    }

    // 2. 자신의 게시글/댓글은 신고 불가
    if (authorId === userId) {
      throw new Error('Cannot report your own content');
    }

    // 3. 중복 신고 확인
    const duplicateReport = await ReportRepository.findDuplicateReport(userId, targetType, uuid);

    if (duplicateReport) {
      throw new Error('You have already reported this content');
    }

    // 4. 신고 생성
    const report = await ReportRepository.create(
      userId,
      authorId,
      targetType,
      uuid,
      targetId,
      reason
    );

    return this.formatReportResponse(report);
  }

  /**
   * 신고 상세 조회
   */
  static async getReportByReportId(reportId: string): Promise<ReportResponseDto> {
    const report = await ReportRepository.findByReportId(reportId);

    if (!report) {
      throw new Error('Report not found');
    }

    return this.formatReportResponse(report);
  }

  /**
   * 신고 목록 조회
   */
  static async getReports(query: GetReportsQueryDto): Promise<ReportListResponseDto> {
    const { page = 1, limit = 20 } = query;

    const { reports, total } = await ReportRepository.findMany(query);

    const formattedReports = await Promise.all(
      reports.map((r) => this.formatReportResponse(r))
    );

    const summary = await ReportRepository.getSummary();

    return {
      reports: formattedReports,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      summary,
    };
  }

  /**
   * 신고 처리 (관리자)
   *
   * 로직:
   * 1. 신고 조회
   * 2. 신고 상태 업데이트
   * 3. actionType에 따라 대상 게시글/댓글 상태 변경
   */
  static async processReport(
    reportId: string,
    adminId: string,
    dto: ProcessReportDto
  ): Promise<ReportResponseDto> {
    // 1. 신고 조회
    const report = await ReportRepository.findByReportId(reportId);

    if (!report) {
      throw new Error('Report not found');
    }

    // 2. 신고 처리
    const processedReport = await ReportRepository.process(reportId, adminId, dto);

    // 3. actionType에 따라 대상 상태 변경
    if (dto.actionType && dto.status === 'RESOLVED') {
      await this.applyAction(
        processedReport.targetType,
        processedReport.postId || processedReport.commentId!,
        dto.actionType
      );
    }

    return this.formatReportResponse(processedReport);
  }

  /**
   * 신고 삭제 (본인 신고만)
   */
  static async deleteReport(reportId: string, userId: string): Promise<void> {
    const report = await ReportRepository.findByReportId(reportId);

    if (!report) {
      throw new Error('Report not found');
    }

    // 권한 확인: 본인만 삭제 가능
    if (report.reporterId !== userId) {
      throw new Error('Unauthorized to delete this report');
    }

    // PENDING 상태만 삭제 가능
    if (report.status !== 'PENDING') {
      throw new Error('Cannot delete report that is already being processed');
    }

    await ReportRepository.delete(reportId);
  }

  /**
   * 내가 신고한 목록 조회
   */
  static async getMyReports(
    userId: string,
    query: GetReportsQueryDto
  ): Promise<ReportListResponseDto> {
    return this.getReports({
      ...query,
      reporterId: userId,
    });
  }

  /**
   * targetId (postId/commentId)로 UUID 및 작성자 조회
   */
  private static async getTargetInfo(
    targetType: ReportTargetType,
    targetId: string
  ): Promise<{ uuid: string | null; authorId: string | null }> {
    if (targetType === 'POST') {
      const post = await prisma.post.findUnique({
        where: { postId: targetId },
        select: { id: true, authorId: true },
      });
      return { uuid: post?.id || null, authorId: post?.authorId || null };
    } else {
      const comment = await prisma.comment.findUnique({
        where: { commentId: targetId },
        select: { id: true, authorId: true },
      });
      return { uuid: comment?.id || null, authorId: comment?.authorId || null };
    }
  }

  /**
   * 신고 처리 액션 적용
   */
  private static async applyAction(
    targetType: ReportTargetType,
    targetUuid: string,
    actionType: ActionType
  ): Promise<void> {
    if (targetType === 'POST') {
      if (actionType === 'HIDE') {
        await prisma.post.update({
          where: { id: targetUuid },
          data: { status: 'HIDDEN' },
        });
      } else if (actionType === 'DELETE') {
        await prisma.post.update({
          where: { id: targetUuid },
          data: { status: 'DELETED', deletedAt: new Date() },
        });
      } else if (actionType === 'RESTORE') {
        await prisma.post.update({
          where: { id: targetUuid },
          data: { status: 'PUBLISHED', deletedAt: null },
        });
      }
    } else {
      if (actionType === 'HIDE') {
        await prisma.comment.update({
          where: { id: targetUuid },
          data: { status: 'HIDDEN' },
        });
      } else if (actionType === 'DELETE') {
        await prisma.comment.update({
          where: { id: targetUuid },
          data: { status: 'DELETED', deletedAt: new Date() },
        });
      } else if (actionType === 'RESTORE') {
        await prisma.comment.update({
          where: { id: targetUuid },
          data: { status: 'PUBLISHED', deletedAt: null },
        });
      }
    }
  }

  /**
   * 신고 응답 포맷팅 (UUID → postId/commentId 변환)
   */
  private static async formatReportResponse(report: any): Promise<ReportResponseDto> {
    let targetId: string;

    if (report.targetType === 'POST' && report.postId) {
      const post = await prisma.post.findUnique({
        where: { id: report.postId },
        select: { postId: true },
      });
      targetId = post?.postId || report.postId;
    } else if (report.targetType === 'COMMENT' && report.commentId) {
      const comment = await prisma.comment.findUnique({
        where: { id: report.commentId },
        select: { commentId: true },
      });
      targetId = comment?.commentId || report.commentId;
    } else {
      targetId = report.postId || report.commentId;
    }

    // adminId로 관리자 정보 조회
    let admin = null;
    if (report.adminId) {
      const adminUser = await prisma.member.findUnique({
        where: { id: report.adminId },
        select: { memberId: true, nickname: true },
      });
      admin = adminUser;
    }

    return {
      id: report.id,
      reportId: report.reportId,
      reporterId: report.reporterId,
      reportedUserId: report.reportedUserId,
      targetType: report.targetType,
      targetId,
      reason: report.reason,
      status: report.status,
      adminId: report.adminId,
      adminNote: report.adminNote,
      actionType: report.actionType,
      createdAt: report.createdAt,
      processedAt: report.processedAt,
      reporter: report.reporter
        ? {
            memberId: report.reporter.memberId,
            nickname: report.reporter.nickname,
          }
        : undefined,
      reportedUser: report.reportedUser
        ? {
            memberId: report.reportedUser.memberId,
            nickname: report.reportedUser.nickname,
          }
        : undefined,
      admin,
    };
  }
}
