/**
 * Admin Report Repository
 *
 * 신고 관리 관련 데이터베이스 접근 레이어
 */

import { PrismaClient, ReportStatus, ActionType } from '@prisma/client';
import { GetReportsQueryDto } from './admin-report.dto';

const prisma = new PrismaClient();

export class AdminReportRepository {
  /**
   * 신고 목록 조회
   */
  async getReports(query: GetReportsQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      targetType,
      reporterId,
      reportedUserId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      startDate,
      endDate,
    } = query;

    const skip = (page - 1) * limit;
    const take = limit;

    // Where 조건 구성
    const where: any = {};

    // 검색 조건 (신고자, 피신고자 닉네임, 신고 사유)
    if (search) {
      where.OR = [
        { reporter: { nickname: { contains: search, mode: 'insensitive' } } },
        { reportedUser: { nickname: { contains: search, mode: 'insensitive' } } },
        { reason: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 필터 조건
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

    // 기간 필터
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(`${startDate}T00:00:00Z`);
      }
      if (endDate) {
        where.createdAt.lte = new Date(`${endDate}T23:59:59Z`);
      }
    }

    // 정렬 조건
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // 병렬 조회
    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          reporter: {
            select: {
              id: true,
              nickname: true,
              memberType: true,
            },
          },
          reportedUser: {
            select: {
              id: true,
              nickname: true,
              memberType: true,
            },
          },
          post: {
            select: {
              id: true,
              title: true,
            },
          },
          comment: {
            select: {
              id: true,
              content: true,
            },
          },
        },
      }),
      prisma.report.count({ where }),
    ]);

    return { reports, total };
  }

  /**
   * 신고 ID로 조회
   */
  async getReportById(id: string) {
    return prisma.report.findUnique({
      where: { id },
      include: {
        reporter: {
          select: {
            id: true,
            nickname: true,
            memberType: true,
          },
        },
        reportedUser: {
          select: {
            id: true,
            nickname: true,
            memberType: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
          },
        },
      },
    });
  }

  /**
   * 신고 처리 (상태 변경)
   */
  async processReport(
    id: string,
    status: ReportStatus,
    adminId: string,
    adminNote?: string,
    actionType?: ActionType
  ) {
    const currentReport = await prisma.report.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!currentReport) {
      throw new Error('Report not found');
    }

    const previousStatus = currentReport.status;

    // 신고 상태 업데이트
    const updatedReport = await prisma.report.update({
      where: { id },
      data: {
        status,
        adminId,
        adminNote: adminNote || null,
        actionType: actionType || null,
        processedAt: status === 'RESOLVED' || status === 'REJECTED' ? new Date() : null,
      },
      include: {
        reporter: {
          select: {
            id: true,
            nickname: true,
          },
        },
        reportedUser: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    // 관리자 정보 조회
    const admin = await prisma.member.findUnique({
      where: { id: adminId },
      select: { nickname: true },
    });

    return {
      updatedReport,
      previousStatus,
      adminNickname: admin?.nickname || null,
    };
  }

  /**
   * 신고 대상 게시글/댓글 상태 변경
   */
  async applyActionToTarget(reportId: string, actionType: ActionType) {
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      select: {
        targetType: true,
        postId: true,
        commentId: true,
      },
    });

    if (!report) {
      throw new Error('Report not found');
    }

    // 게시글 대상
    if (report.targetType === 'POST' && report.postId) {
      const newStatus = actionType === 'HIDE' ? 'HIDDEN' : actionType === 'DELETE' ? 'DELETED' : 'PUBLISHED';
      await prisma.post.update({
        where: { id: report.postId },
        data: {
          status: newStatus,
          deletedAt: actionType === 'DELETE' ? new Date() : null,
        },
      });
    }

    // 댓글 대상
    if (report.targetType === 'COMMENT' && report.commentId) {
      const newStatus = actionType === 'HIDE' ? 'HIDDEN' : actionType === 'DELETE' ? 'DELETED' : 'PUBLISHED';
      await prisma.comment.update({
        where: { id: report.commentId },
        data: {
          status: newStatus,
          deletedAt: actionType === 'DELETE' ? new Date() : null,
        },
      });
    }
  }
}
