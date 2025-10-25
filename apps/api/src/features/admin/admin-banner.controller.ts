/**
 * Admin Banner Controller
 *
 * 배너 관리 요청/응답 처리
 */

import { Request, Response } from 'express';
import { AdminBannerService } from './admin-banner.service';
import {
  GetBannersQueryDto,
  CreateBannerRequestDto,
  UpdateBannerRequestDto,
  UpdateBannerOrderRequestDto,
} from './admin-banner.dto';

export class AdminBannerController {
  private service: AdminBannerService;

  constructor() {
    this.service = new AdminBannerService();
  }

  /**
   * 배너 목록 조회
   * GET /api/admin/banners
   */
  getBanners = async (req: Request, res: Response): Promise<any> => {
    try {
      const query: GetBannersQueryDto = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        search: req.query.search as string,
        isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
        sortBy: (req.query.sortBy as 'createdAt' | 'updatedAt' | 'startDate' | 'endDate' | 'displayOrder') || 'displayOrder',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };

      const result = await this.service.getBanners(query);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Get banners error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to get banners',
        },
      });
    }
  };

  /**
   * 배너 상세 조회
   * GET /api/admin/banners/:bannerId
   */
  getBannerDetail = async (req: Request, res: Response): Promise<any> => {
    try {
      const { bannerId } = req.params;

      const result = await this.service.getBannerDetail(bannerId);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Get banner detail error:', error);

      if (error.message === '배너를 찾을 수 없습니다.') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'BANNER_NOT_FOUND',
            message: 'Banner not found',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to get banner detail',
        },
      });
    }
  };

  /**
   * 배너 생성
   * POST /api/admin/banners
   */
  createBanner = async (req: Request, res: Response): Promise<any> => {
    try {
      const requestDto: CreateBannerRequestDto = {
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        linkUrl: req.body.linkUrl,
        displayOrder: req.body.displayOrder,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        isActive: req.body.isActive,
      };

      // 필수 필드 검증
      if (!requestDto.title) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Title is required',
          },
        });
      }

      if (!requestDto.imageUrl) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Image URL is required',
          },
        });
      }

      if (!requestDto.linkUrl) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Link URL is required',
          },
        });
      }

      if (!requestDto.startDate) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Start date is required',
          },
        });
      }

      if (!requestDto.endDate) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'End date is required',
          },
        });
      }

      const result = await this.service.createBanner(requestDto);

      return res.status(201).json(result);
    } catch (error: any) {
      console.error('Create banner error:', error);

      if (error.message === '노출 종료일은 시작일보다 이후여야 합니다.') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_DATE_RANGE',
            message: 'End date must be after start date',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to create banner',
        },
      });
    }
  };

  /**
   * 배너 수정
   * PATCH /api/admin/banners/:bannerId
   */
  updateBanner = async (req: Request, res: Response): Promise<any> => {
    try {
      const { bannerId } = req.params;

      const requestDto: UpdateBannerRequestDto = {
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        linkUrl: req.body.linkUrl,
        displayOrder: req.body.displayOrder,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        isActive: req.body.isActive,
      };

      const result = await this.service.updateBanner(bannerId, requestDto);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Update banner error:', error);

      if (error.message === '배너를 찾을 수 없습니다.') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'BANNER_NOT_FOUND',
            message: 'Banner not found',
          },
        });
      }

      if (error.message === '노출 종료일은 시작일보다 이후여야 합니다.') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_DATE_RANGE',
            message: 'End date must be after start date',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to update banner',
        },
      });
    }
  };

  /**
   * 배너 삭제
   * DELETE /api/admin/banners/:bannerId
   */
  deleteBanner = async (req: Request, res: Response): Promise<any> => {
    try {
      const { bannerId } = req.params;

      const result = await this.service.deleteBanner(bannerId);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Delete banner error:', error);

      if (error.message === '배너를 찾을 수 없습니다.') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'BANNER_NOT_FOUND',
            message: 'Banner not found',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to delete banner',
        },
      });
    }
  };

  /**
   * 배너 순서 변경
   * PATCH /api/admin/banners/:bannerId/order
   */
  updateBannerOrder = async (req: Request, res: Response): Promise<any> => {
    try {
      const { bannerId } = req.params;

      const requestDto: UpdateBannerOrderRequestDto = {
        displayOrder: req.body.displayOrder,
      };

      // 필수 필드 검증
      if (requestDto.displayOrder === undefined) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Display order is required',
          },
        });
      }

      const result = await this.service.updateBannerOrder(bannerId, requestDto);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Update banner order error:', error);

      if (error.message === '배너를 찾을 수 없습니다.') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'BANNER_NOT_FOUND',
            message: 'Banner not found',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to update banner order',
        },
      });
    }
  };
}
