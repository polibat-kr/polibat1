/**
 * Report Repository
 * 신고 데이터베이스 접근 레이어
 */

import { PrismaClient, Report, ReportTargetType } from '@prisma/client';
import { GetReportsQueryDto, ProcessReportDto } from './report.dto';

const prisma = new PrismaClient();

export class ReportRepository {
  /**
   * 자동 reportId 생성
   * 형식: {targetId}-RP{순번} (예: FB000001-RP0001)
   */
  static async generateReportId(targetId: string): Promise<string> {
    // targetId를 기반으로 reportId prefix 생성
    const prefix = `${targetId}-RP`;

    // 해당 prefix로 시작하는 마지막 신고 조회
    const lastReport = await prisma.report.findFirst({
      where: {
        reportId: {
          startsWith: prefix,
        },
      },
      orderBy: {
        reportId: 'desc',
      },
      select: {
        reportId: true,
      },
    });

    if (!lastReport) {
      // 첫 번째 신고
      return `${prefix}0001`;
    }

    // 마지막 번호 추출 및 증가
    const lastNumber = parseInt(lastReport.reportId.slice(-4));
    const nextNumber = (lastNumber + 1).toString().padStart(4, '0');

    return `${prefix}${nextNumber}`;
  }

  /**
   * 신고 생성
   */
  static async create(
    reporterId: string,
    reportedUserId: string,
    targetType: ReportTargetType,
    targetUuid: string, // UUID
    targetId: string, // postId/commentId
    reason: string
  ): Promise<Report> {
    const reportId = await this.generateReportId(targetId);

    const data: any = {
      reportId,
      reporterId,
      reportedUserId,
      targetType,
      reason,
    };

    if (targetType === 'POST') {
      data.postId = targetUuid;
    } else {
      data.commentId = targetUuid;
    }

    return prisma.report.create({ data });
  }

  /**
   * reportId로 신고 조회
   */
  static async findByReportId(reportId: string): Promise<Report | null> {
    return prisma.report.findUnique({
      where: { reportId },
      include: {
        reporter: {
          select: { memberId: true, nickname: true },
        },
        reportedUser: {
          select: { memberId: true, nickname: true },
        },
      },
    });
  }

  /**
   * ID로 신고 조회
   */
  static async findById(id: string): Promise<Report | null> {
    return prisma.report.findUnique({
      where: { id },
      include: {
        reporter: {
          select: { memberId: true, nickname: true },
        },
        reportedUser: {
          select: { memberId: true, nickname: true },
        },
      },
    });
  }

  /**
   * 신고 목록 조회 (필터링 및 페이지네이션)
   */
  static async findMany(query: GetReportsQueryDto) {
    const {
      status,
      targetType,
      reporterId,
      reportedUserId,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (targetType) {
      where.targetType = targetType;
    }

    if (reporterId) {
      where.reporterId = reporterId;
    }

    if (reportedUserId) {
      where.reportedUserId = reportedUserId;
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          reporter: {
            select: { memberId: true, nickname: true },
          },
          reportedUser: {
            select: { memberId: true, nickname: true },
          },
        },
      }),
      prisma.report.count({ where }),
    ]);

    return { reports, total };
  }

  /**
   * 신고 상태별 요약 통계
   */
  static async getSummary() {
    const [pending, reviewing, resolved, rejected, deferred] = await Promise.all([
      prisma.report.count({ where: { status: 'PENDING' } }),
      prisma.report.count({ where: { status: 'REVIEWING' } }),
      prisma.report.count({ where: { status: 'RESOLVED' } }),
      prisma.report.count({ where: { status: 'REJECTED' } }),
      prisma.report.count({ where: { status: 'DEFERRED' } }),
    ]);

    return { pending, reviewing, resolved, rejected, deferred };
  }

  /**
   * 신고 처리 (관리자)
   */
  static async process(
    reportId: string,
    adminId: string,
    dto: ProcessReportDto
  ): Promise<Report> {
    const { status, adminNote, actionType } = dto;

    return prisma.report.update({
      where: { reportId },
      data: {
        status,
        adminId,
        adminNote,
        actionType,
        processedAt: status !== 'PENDING' && status !== 'REVIEWING' ? new Date() : undefined,
      },
      include: {
        reporter: {
          select: { memberId: true, nickname: true },
        },
        reportedUser: {
          select: { memberId: true, nickname: true },
        },
      },
    });
  }

  /**
   * 신고 삭제 (본인 신고만)
   */
  static async delete(reportId: string): Promise<Report> {
    return prisma.report.delete({
      where: { reportId },
    });
  }

  /**
   * 중복 신고 확인
   */
  static async findDuplicateReport(
    reporterId: string,
    targetType: ReportTargetType,
    targetUuid: string
  ): Promise<Report | null> {
    const where: any = {
      reporterId,
      targetType,
    };

    if (targetType === 'POST') {
      where.postId = targetUuid;
    } else {
      where.commentId = targetUuid;
    }

    return prisma.report.findFirst({ where });
  }
}
