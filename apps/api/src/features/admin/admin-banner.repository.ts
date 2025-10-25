/**
 * Admin Banner Repository
 *
 * 배너 관리 관련 데이터베이스 접근 레이어
 */

import { PrismaClient } from '@prisma/client';
import { GetBannersQueryDto } from './admin-banner.dto';

const prisma = new PrismaClient();

export class AdminBannerRepository {
  /**
   * 배너 목록 조회
   */
  async getBanners(query: GetBannersQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      isActive,
      sortBy = 'displayOrder',
      sortOrder = 'asc',
      startDate,
      endDate,
    } = query;

    const skip = (page - 1) * limit;
    const take = limit;

    // Where 조건 구성
    const where: any = {};

    // 검색 조건 (제목)
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    // 필터 조건
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
    const [banners, total] = await Promise.all([
      prisma.banner.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      prisma.banner.count({ where }),
    ]);

    return {
      banners,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 배너 상세 조회 (UUID)
   */
  async getBannerById(id: string) {
    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return null;
    }

    return banner;
  }

  /**
   * bannerId로 배너 조회 (BN000001)
   */
  async getBannerByBannerId(bannerId: string) {
    const banner = await prisma.banner.findUnique({
      where: { bannerId },
    });

    if (!banner) {
      return null;
    }

    return banner;
  }

  /**
   * 배너 생성
   */
  async createBanner(data: {
    bannerId: string;
    title: string;
    imageUrl: string;
    linkUrl: string;
    displayOrder: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
  }) {
    const banner = await prisma.banner.create({
      data,
    });

    return banner;
  }

  /**
   * 배너 수정
   */
  async updateBanner(
    id: string,
    data: {
      title?: string;
      imageUrl?: string;
      linkUrl?: string;
      displayOrder?: number;
      startDate?: Date;
      endDate?: Date;
      isActive?: boolean;
    }
  ) {
    const banner = await prisma.banner.update({
      where: { id },
      data,
    });

    return banner;
  }

  /**
   * 배너 삭제 (하드 삭제)
   */
  async deleteBanner(id: string) {
    const banner = await prisma.banner.delete({
      where: { id },
    });

    return banner;
  }

  /**
   * 다음 bannerId 생성을 위한 카운트 조회
   */
  async getBannerCount() {
    const count = await prisma.banner.count();
    return count;
  }

  /**
   * displayOrder로 배너 조회
   */
  async getBannerByDisplayOrder(displayOrder: number) {
    const banner = await prisma.banner.findFirst({
      where: { displayOrder },
    });

    return banner;
  }
}
