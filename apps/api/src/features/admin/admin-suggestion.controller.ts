/**
 * Admin Suggestion Controller
 *
 * 건의사항 관리 요청/응답 처리
 */

import { Request, Response } from 'express';
import { AdminSuggestionService } from './admin-suggestion.service';
import {
  GetSuggestionsQueryDto,
  CreateSuggestionRequestDto,
  ReplySuggestionRequestDto,
  UpdateSuggestionStatusRequestDto,
} from './admin-suggestion.dto';

export class AdminSuggestionController {
  private service: AdminSuggestionService;

  constructor() {
    this.service = new AdminSuggestionService();
  }

  /**
   * 건의사항 목록 조회
   * GET /api/admin/suggestions
   */
  getSuggestions = async (req: Request, res: Response) => {
    try {
      const query: GetSuggestionsQueryDto = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        search: req.query.search as string,
        suggestionType: req.query.suggestionType as any,
        status: req.query.status as any,
        sortBy: (req.query.sortBy as 'createdAt' | 'repliedAt') || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };

      const result = await this.service.getSuggestions(query);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Get suggestions error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to get suggestions',
        },
      });
    }
  };

  /**
   * 건의사항 상세 조회
   * GET /api/admin/suggestions/:suggestionId
   */
  getSuggestionDetail = async (req: Request, res: Response) => {
    try {
      const { suggestionId } = req.params;

      const result = await this.service.getSuggestionDetail(suggestionId);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Get suggestion detail error:', error);

      if (error.message === '건의사항을 찾을 수 없습니다.') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'SUGGESTION_NOT_FOUND',
            message: 'Suggestion not found',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to get suggestion detail',
        },
      });
    }
  };

  /**
   * 건의사항 생성
   * POST /api/admin/suggestions
   */
  createSuggestion = async (req: Request, res: Response) => {
    try {
      const requestDto: CreateSuggestionRequestDto = {
        suggestionType: req.body.suggestionType,
        title: req.body.title,
        content: req.body.content,
        userId: req.body.userId, // 실제로는 JWT에서 추출
      };

      // 필수 필드 검증
      if (!requestDto.suggestionType) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'SuggestionType is required',
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

      if (!requestDto.userId) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'UserId is required',
          },
        });
      }

      const result = await this.service.createSuggestion(requestDto);

      return res.status(201).json(result);
    } catch (error: any) {
      console.error('Create suggestion error:', error);

      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to create suggestion',
        },
      });
    }
  };

  /**
   * 관리자 답변 작성
   * PATCH /api/admin/suggestions/:suggestionId/reply
   */
  replySuggestion = async (req: Request, res: Response) => {
    try {
      const { suggestionId } = req.params;

      // JWT에서 adminId 추출 (실제로는 req.user.id)
      const adminId = req.body.adminId || 'admin-id-placeholder';

      const requestDto: ReplySuggestionRequestDto = {
        adminReply: req.body.adminReply,
        status: req.body.status,
      };

      // 필수 필드 검증
      if (!requestDto.adminReply) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'AdminReply is required',
          },
        });
      }

      const result = await this.service.replySuggestion(suggestionId, adminId, requestDto);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Reply suggestion error:', error);

      if (error.message === '건의사항을 찾을 수 없습니다.') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'SUGGESTION_NOT_FOUND',
            message: 'Suggestion not found',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to reply suggestion',
        },
      });
    }
  };

  /**
   * 건의사항 상태 변경
   * PATCH /api/admin/suggestions/:suggestionId/status
   */
  updateSuggestionStatus = async (req: Request, res: Response) => {
    try {
      const { suggestionId } = req.params;

      const requestDto: UpdateSuggestionStatusRequestDto = {
        status: req.body.status,
      };

      // 필수 필드 검증
      if (!requestDto.status) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Status is required',
          },
        });
      }

      const result = await this.service.updateSuggestionStatus(suggestionId, requestDto);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Update suggestion status error:', error);

      if (error.message === '건의사항을 찾을 수 없습니다.') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'SUGGESTION_NOT_FOUND',
            message: 'Suggestion not found',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to update suggestion status',
        },
      });
    }
  };
}
