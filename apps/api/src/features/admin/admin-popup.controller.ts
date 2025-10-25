/**
 * Admin Popup Controller
 *
 * 팝업 관리 요청/응답 처리
 */

import { Request, Response } from 'express';
import { AdminPopupService } from './admin-popup.service';
import {
  GetPopupsQueryDto,
  CreatePopupRequestDto,
  UpdatePopupRequestDto,
} from './admin-popup.dto';

export class AdminPopupController {
  private service: AdminPopupService;

  constructor() {
    this.service = new AdminPopupService();
  }

  /**
   * 팝업 목록 조회
   * GET /api/admin/popups
   */
  getPopups = async (req: Request, res: Response) => {
    try {
      const query: GetPopupsQueryDto = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        search: req.query.search as string,
        position: req.query.position as any,
        isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
        sortBy: (req.query.sortBy as 'createdAt' | 'updatedAt' | 'startDate' | 'endDate') || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };

      const result = await this.service.getPopups(query);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Get popups error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to get popups',
        },
      });
    }
  };

  /**
   * 팝업 상세 조회
   * GET /api/admin/popups/:popupId
   */
  getPopupDetail = async (req: Request, res: Response) => {
    try {
      const { popupId } = req.params;

      const result = await this.service.getPopupDetail(popupId);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Get popup detail error:', error);

      if (error.message === '팝업을 찾을 수 없습니다.') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'POPUP_NOT_FOUND',
            message: 'Popup not found',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to get popup detail',
        },
      });
    }
  };

  /**
   * 팝업 생성
   * POST /api/admin/popups
   */
  createPopup = async (req: Request, res: Response) => {
    try {
      const requestDto: CreatePopupRequestDto = {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
        linkUrl: req.body.linkUrl,
        position: req.body.position,
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

      if (!requestDto.content) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Content is required',
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

      const result = await this.service.createPopup(requestDto);

      return res.status(201).json(result);
    } catch (error: any) {
      console.error('Create popup error:', error);

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
          message: error.message || 'Failed to create popup',
        },
      });
    }
  };

  /**
   * 팝업 수정
   * PATCH /api/admin/popups/:popupId
   */
  updatePopup = async (req: Request, res: Response) => {
    try {
      const { popupId } = req.params;

      const requestDto: UpdatePopupRequestDto = {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
        linkUrl: req.body.linkUrl,
        position: req.body.position,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        isActive: req.body.isActive,
      };

      const result = await this.service.updatePopup(popupId, requestDto);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Update popup error:', error);

      if (error.message === '팝업을 찾을 수 없습니다.') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'POPUP_NOT_FOUND',
            message: 'Popup not found',
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
          message: error.message || 'Failed to update popup',
        },
      });
    }
  };

  /**
   * 팝업 삭제
   * DELETE /api/admin/popups/:popupId
   */
  deletePopup = async (req: Request, res: Response) => {
    try {
      const { popupId } = req.params;

      const result = await this.service.deletePopup(popupId);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Delete popup error:', error);

      if (error.message === '팝업을 찾을 수 없습니다.') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'POPUP_NOT_FOUND',
            message: 'Popup not found',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to delete popup',
        },
      });
    }
  };
}
