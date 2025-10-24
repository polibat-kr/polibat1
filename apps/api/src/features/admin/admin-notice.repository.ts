/**
 * Admin Notice Repository
 *
 * 공지사항 관리 관련 데이터베이스 접근 레이어
 */

import { PrismaClient, NoticeCategory } from '@prisma/client';
import { GetNoticesQueryDto } from './admin-notice.dto';

const prisma = new PrismaClient();

export class AdminNoticeRepository {
  /**
   * 공지사항 목록 조회
   */
  async getNotices(query: GetNoticesQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      isPinned,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      startDate,
      endDate,
    } = query;

    const skip = (page - 1) * limit;
    const take = limit;

    // Where 조건 구성
    const where: any = {};

    // 검색 조건 (제목, 내용)
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 필터 조건
    if (category) {
      where.category = category;
    }
    if (isPinned !== undefined) {
      where.isPinned = isPinned;
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

    // 병렬 조회 (데이터 + 총 개수)
    const [notices, total] = await Promise.all([
      prisma.notice.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      prisma.notice.count({ where }),
    ]);

    return {
      notices,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 공지사항 상세 조회
   */
  async getNoticeById(id: string) {
    const notice = await prisma.notice.findUnique({
      where: { id },
    });

    if (!notice) {
      return null;
    }

    return notice;
  }

  /**
   * noticeId로 공지사항 조회
   */
  async getNoticeByNoticeId(noticeId: string) {
    const notice = await prisma.notice.findUnique({
      where: { noticeId },
    });

    if (!notice) {
      return null;
    }

    return notice;
  }

  /**
   * 공지사항 생성
   */
  async createNotice(data: {
    noticeId: string;
    category: NoticeCategory;
    title: string;
    content: string;
    isPinned: boolean;
  }) {
    const notice = await prisma.notice.create({
      data,
    });

    return notice;
  }

  /**
   * 공지사항 수정
   */
  async updateNotice(
    id: string,
    data: {
      category?: NoticeCategory;
      title?: string;
      content?: string;
      isPinned?: boolean;
    }
  ) {
    const notice = await prisma.notice.update({
      where: { id },
      data,
    });

    return notice;
  }

  /**
   * 공지사항 삭제 (하드 삭제)
   */
  async deleteNotice(id: string) {
    const notice = await prisma.notice.delete({
      where: { id },
    });

    return notice;
  }

  /**
   * 공지사항 상단 고정/해제
   */
  async togglePin(id: string, isPinned: boolean) {
    const notice = await prisma.notice.update({
      where: { id },
      data: { isPinned },
    });

    return notice;
  }

  /**
   * 조회수 증가
   */
  async incrementViewCount(id: string) {
    const notice = await prisma.notice.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    return notice;
  }

  /**
   * 다음 noticeId 생성을 위한 카운트 조회
   */
  async getNoticeCount() {
    const count = await prisma.notice.count();
    return count;
  }
}
