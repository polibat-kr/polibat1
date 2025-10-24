/**
 * Admin Notice Controller
 *
 * 공지사항 관리 요청/응답 처리
 */

import { Request, Response } from 'express';
import { AdminNoticeService } from './admin-notice.service';
import {
  GetNoticesQueryDto,
  CreateNoticeRequestDto,
  UpdateNoticeRequestDto,
  TogglePinRequestDto,
} from './admin-notice.dto';

export class AdminNoticeController {
  private service: AdminNoticeService;

  constructor() {
    this.service = new AdminNoticeService();
  }

  /**
   * 공지사항 목록 조회
   * GET /api/admin/notices
   */
  getNotices = async (req: Request, res: Response) => {
    try {
      const query: GetNoticesQueryDto = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        search: req.query.search as string,
        category: req.query.category as any,
        isPinned: req.query.isPinned === 'true' ? true : req.query.isPinned === 'false' ? false : undefined,
        sortBy: (req.query.sortBy as 'createdAt' | 'updatedAt' | 'viewCount') || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };

      const result = await this.service.getNotices(query);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Get notices error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to get notices',
        },
      });
    }
  };

  /**
   * 공지사항 상세 조회
   * GET /api/admin/notices/:noticeId
   */
  getNoticeDetail = async (req: Request, res: Response) => {
    try {
      const { noticeId } = req.params;

      const result = await this.service.getNoticeDetail(noticeId);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Get notice detail error:', error);

      if (error.message === '공지사항을 찾을 수 없습니다.') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOTICE_NOT_FOUND',
            message: 'Notice not found',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to get notice detail',
        },
      });
    }
  };

  /**
   * 공지사항 생성
   * POST /api/admin/notices
   */
  createNotice = async (req: Request, res: Response) => {
    try {
      const requestDto: CreateNoticeRequestDto = {
        category: req.body.category,
        title: req.body.title,
        content: req.body.content,
        isPinned: req.body.isPinned,
      };

      // 필수 필드 검증
      if (!requestDto.category) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Category is required',
          },
        });
      }

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

      const result = await this.service.createNotice(requestDto);

      return res.status(201).json(result);
    } catch (error: any) {
      console.error('Create notice error:', error);

      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to create notice',
        },
      });
    }
  };

  /**
   * 공지사항 수정
   * PATCH /api/admin/notices/:noticeId
   */
  updateNotice = async (req: Request, res: Response) => {
    try {
      const { noticeId } = req.params;

      const requestDto: UpdateNoticeRequestDto = {
        category: req.body.category,
        title: req.body.title,
        content: req.body.content,
        isPinned: req.body.isPinned,
      };

      const result = await this.service.updateNotice(noticeId, requestDto);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Update notice error:', error);

      if (error.message === '공지사항을 찾을 수 없습니다.') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOTICE_NOT_FOUND',
            message: 'Notice not found',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to update notice',
        },
      });
    }
  };

  /**
   * 공지사항 삭제
   * DELETE /api/admin/notices/:noticeId
   */
  deleteNotice = async (req: Request, res: Response) => {
    try {
      const { noticeId } = req.params;

      const result = await this.service.deleteNotice(noticeId);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Delete notice error:', error);

      if (error.message === '공지사항을 찾을 수 없습니다.') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOTICE_NOT_FOUND',
            message: 'Notice not found',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to delete notice',
        },
      });
    }
  };

  /**
   * 공지사항 상단 고정/해제
   * PATCH /api/admin/notices/:noticeId/pin
   */
  togglePin = async (req: Request, res: Response) => {
    try {
      const { noticeId } = req.params;

      const requestDto: TogglePinRequestDto = {
        isPinned: req.body.isPinned,
      };

      // 필수 필드 검증
      if (requestDto.isPinned === undefined) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'isPinned is required',
          },
        });
      }

      const result = await this.service.togglePin(noticeId, requestDto);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Toggle pin error:', error);

      if (error.message === '공지사항을 찾을 수 없습니다.') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOTICE_NOT_FOUND',
            message: 'Notice not found',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to toggle pin',
        },
      });
    }
  };
}
