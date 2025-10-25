/**
 * Admin Popup Repository
 *
 * 팝업 관리 관련 데이터베이스 접근 레이어
 */

import { PrismaClient, PopupPosition } from '@prisma/client';
import { GetPopupsQueryDto } from './admin-popup.dto';

const prisma = new PrismaClient();

export class AdminPopupRepository {
  /**
   * 팝업 목록 조회
   */
  async getPopups(query: GetPopupsQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      position,
      isActive,
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
    if (position) {
      where.position = position;
    }
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // 노출 기간 필터
    if (startDate || endDate) {
      where.AND = [];
      if (startDate) {
        where.AND.push({
          startDate: { gte: new Date(`${startDate}T00:00:00Z`) },
        });
      }
      if (endDate) {
        where.AND.push({
          endDate: { lte: new Date(`${endDate}T23:59:59Z`) },
        });
      }
    }

    // 정렬 조건
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // 병렬 조회 (데이터 + 총 개수)
    const [popups, total] = await Promise.all([
      prisma.popup.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      prisma.popup.count({ where }),
    ]);

    return {
      popups,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 팝업 상세 조회 (UUID)
   */
  async getPopupById(id: string) {
    const popup = await prisma.popup.findUnique({
      where: { id },
    });

    if (!popup) {
      return null;
    }

    return popup;
  }

  /**
   * popupId로 팝업 조회 (PU000001)
   */
  async getPopupByPopupId(popupId: string) {
    const popup = await prisma.popup.findUnique({
      where: { popupId },
    });

    if (!popup) {
      return null;
    }

    return popup;
  }

  /**
   * 팝업 생성
   */
  async createPopup(data: {
    popupId: string;
    title: string;
    content: string;
    imageUrl?: string;
    linkUrl?: string;
    position: PopupPosition;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
  }) {
    const popup = await prisma.popup.create({
      data,
    });

    return popup;
  }

  /**
   * 팝업 수정
   */
  async updatePopup(
    id: string,
    data: {
      title?: string;
      content?: string;
      imageUrl?: string;
      linkUrl?: string;
      position?: PopupPosition;
      startDate?: Date;
      endDate?: Date;
      isActive?: boolean;
    }
  ) {
    const popup = await prisma.popup.update({
      where: { id },
      data,
    });

    return popup;
  }

  /**
   * 팝업 삭제 (하드 삭제)
   */
  async deletePopup(id: string) {
    const popup = await prisma.popup.delete({
      where: { id },
    });

    return popup;
  }

  /**
   * 다음 popupId 생성을 위한 카운트 조회
   */
  async getPopupCount() {
    const count = await prisma.popup.count();
    return count;
  }
}
