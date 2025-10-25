/**
 * Admin Banner Service
 *
 * 배너 관리 비즈니스 로직
 */

import { AdminBannerRepository } from './admin-banner.repository';
import {
  GetBannersQueryDto,
  BannerDto,
  GetBannersResponseDto,
  GetBannerDetailResponseDto,
  CreateBannerRequestDto,
  CreateBannerResponseDto,
  UpdateBannerRequestDto,
  UpdateBannerResponseDto,
  DeleteBannerResponseDto,
  UpdateBannerOrderRequestDto,
  UpdateBannerOrderResponseDto,
} from './admin-banner.dto';

export class AdminBannerService {
  private repository: AdminBannerRepository;

  constructor() {
    this.repository = new AdminBannerRepository();
  }

  /**
   * 배너 목록 조회
   */
  async getBanners(query: GetBannersQueryDto): Promise<GetBannersResponseDto> {
    const { page = 1, limit = 20 } = query;

    const { banners, total } = await this.repository.getBanners(query);

    const bannerDtos: BannerDto[] = banners.map((banner) => ({
      id: banner.id,
      bannerId: banner.bannerId,
      title: banner.title,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl,
      displayOrder: banner.displayOrder,
      startDate: banner.startDate,
      endDate: banner.endDate,
      isActive: banner.isActive,
      createdAt: banner.createdAt,
      updatedAt: banner.updatedAt,
    }));

    return {
      success: true,
      data: {
        banners: bannerDtos,
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
   * 배너 상세 조회
   */
  async getBannerDetail(bannerId: string): Promise<GetBannerDetailResponseDto> {
    // bannerId로 조회
    const banner = await this.repository.getBannerByBannerId(bannerId);

    if (!banner) {
      throw new Error('배너를 찾을 수 없습니다.');
    }

    return {
      success: true,
      data: {
        id: banner.id,
        bannerId: banner.bannerId,
        title: banner.title,
        imageUrl: banner.imageUrl,
        linkUrl: banner.linkUrl,
        displayOrder: banner.displayOrder,
        startDate: banner.startDate,
        endDate: banner.endDate,
        isActive: banner.isActive,
        createdAt: banner.createdAt,
        updatedAt: banner.updatedAt,
      },
    };
  }

  /**
   * 배너 생성
   */
  async createBanner(data: CreateBannerRequestDto): Promise<CreateBannerResponseDto> {
    const {
      title,
      imageUrl,
      linkUrl,
      displayOrder = 0,
      startDate,
      endDate,
      isActive = true,
    } = data;

    // 날짜 유효성 검증
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      throw new Error('노출 종료일은 시작일보다 이후여야 합니다.');
    }

    // bannerId 생성 (BN000001 형식)
    const count = await this.repository.getBannerCount();
    const bannerId = `BN${String(count + 1).padStart(6, '0')}`;

    // 배너 생성
    const banner = await this.repository.createBanner({
      bannerId,
      title,
      imageUrl,
      linkUrl,
      displayOrder,
      startDate: start,
      endDate: end,
      isActive,
    });

    return {
      success: true,
      data: {
        id: banner.id,
        bannerId: banner.bannerId,
        title: banner.title,
        displayOrder: banner.displayOrder,
        startDate: banner.startDate,
        endDate: banner.endDate,
        isActive: banner.isActive,
        createdAt: banner.createdAt,
      },
    };
  }

  /**
   * 배너 수정
   */
  async updateBanner(
    bannerId: string,
    data: UpdateBannerRequestDto
  ): Promise<UpdateBannerResponseDto> {
    // bannerId로 조회
    const banner = await this.repository.getBannerByBannerId(bannerId);

    if (!banner) {
      throw new Error('배너를 찾을 수 없습니다.');
    }

    // 수정할 데이터 준비
    const updateData: {
      title?: string;
      imageUrl?: string;
      linkUrl?: string;
      displayOrder?: number;
      startDate?: Date;
      endDate?: Date;
      isActive?: boolean;
    } = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.linkUrl !== undefined) updateData.linkUrl = data.linkUrl;
    if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder;
    if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    // 날짜 유효성 검증 (둘 다 수정될 경우)
    if (updateData.startDate && updateData.endDate) {
      if (updateData.startDate >= updateData.endDate) {
        throw new Error('노출 종료일은 시작일보다 이후여야 합니다.');
      }
    }

    // 배너 수정
    const updatedBanner = await this.repository.updateBanner(banner.id, updateData);

    return {
      success: true,
      data: {
        id: updatedBanner.id,
        bannerId: updatedBanner.bannerId,
        title: updatedBanner.title,
        displayOrder: updatedBanner.displayOrder,
        startDate: updatedBanner.startDate,
        endDate: updatedBanner.endDate,
        isActive: updatedBanner.isActive,
        updatedAt: updatedBanner.updatedAt,
      },
    };
  }

  /**
   * 배너 삭제
   */
  async deleteBanner(bannerId: string): Promise<DeleteBannerResponseDto> {
    // bannerId로 조회
    const banner = await this.repository.getBannerByBannerId(bannerId);

    if (!banner) {
      throw new Error('배너를 찾을 수 없습니다.');
    }

    // 배너 삭제 (하드 삭제)
    const deletedBanner = await this.repository.deleteBanner(banner.id);

    return {
      success: true,
      data: {
        id: deletedBanner.id,
        bannerId: deletedBanner.bannerId,
        title: deletedBanner.title,
        deletedAt: new Date(),
      },
    };
  }

  /**
   * 배너 순서 변경
   */
  async updateBannerOrder(
    bannerId: string,
    data: UpdateBannerOrderRequestDto
  ): Promise<UpdateBannerOrderResponseDto> {
    // bannerId로 조회
    const banner = await this.repository.getBannerByBannerId(bannerId);

    if (!banner) {
      throw new Error('배너를 찾을 수 없습니다.');
    }

    const { displayOrder } = data;

    // 순서 변경
    const updatedBanner = await this.repository.updateBanner(banner.id, {
      displayOrder,
    });

    return {
      success: true,
      data: {
        id: updatedBanner.id,
        bannerId: updatedBanner.bannerId,
        displayOrder: updatedBanner.displayOrder,
        updatedAt: updatedBanner.updatedAt,
      },
    };
  }
}
