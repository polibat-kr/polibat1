/**
 * Admin Policy Controller
 *
 * 약관/정책 관리 관련 요청/응답 처리
 */

import { Request, Response } from 'express';
import { AdminPolicyService } from './admin-policy.service';
import {
  GetPolicyTemplatesQueryDto,
  GetPolicyContentsQueryDto,
  CreatePolicyTemplateRequestDto,
  UpdatePolicyTemplateRequestDto,
  CreatePolicyContentRequestDto,
  UpdatePolicyContentRequestDto,
} from './admin-policy.dto';

const service = new AdminPolicyService();

export class AdminPolicyController {
  // ============================================
  // Policy Template 핸들러
  // ============================================

  /**
   * 템플릿 목록 조회
   * GET /api/admin/policies/templates
   */
  async getTemplates(req: Request, res: Response) {
    try {
      const query: GetPolicyTemplatesQueryDto = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        search: req.query.search as string,
        isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
        sortBy: req.query.sortBy as 'createdAt' | 'title',
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      };

      const result = await service.getTemplates(query);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('템플릿 목록 조회 오류:', error);
      return res.status(500).json({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: '템플릿 목록 조회 중 오류가 발생했습니다.',
      });
    }
  }

  /**
   * 템플릿 생성
   * POST /api/admin/policies/templates
   */
  async createTemplate(req: Request, res: Response) {
    try {
      const data: CreatePolicyTemplateRequestDto = req.body;

      // 필수 필드 검증
      if (!data.title || !data.content) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_REQUEST',
          message: '제목과 내용은 필수입니다.',
        });
      }

      const result = await service.createTemplate(data);

      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('템플릿 생성 오류:', error);
      return res.status(500).json({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: '템플릿 생성 중 오류가 발생했습니다.',
      });
    }
  }

  /**
   * 템플릿 수정
   * PATCH /api/admin/policies/templates/:templateId
   */
  async updateTemplate(req: Request, res: Response) {
    try {
      const { templateId } = req.params;
      const data: UpdatePolicyTemplateRequestDto = req.body;

      const result = await service.updateTemplate(templateId, data);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('템플릿 수정 오류:', error);

      if (error.message === 'TEMPLATE_NOT_FOUND') {
        return res.status(404).json({
          success: false,
          error: 'TEMPLATE_NOT_FOUND',
          message: '템플릿을 찾을 수 없습니다.',
        });
      }

      return res.status(500).json({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: '템플릿 수정 중 오류가 발생했습니다.',
      });
    }
  }

  // ============================================
  // Policy Content 핸들러
  // ============================================

  /**
   * 콘텐츠 목록 조회
   * GET /api/admin/policies/contents
   */
  async getContents(req: Request, res: Response) {
    try {
      const query: GetPolicyContentsQueryDto = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        templateVersionId: req.query.templateVersionId as string,
        target: req.query.target as any,
        isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
        sortBy: req.query.sortBy as 'createdAt' | 'updatedAt',
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      };

      const result = await service.getContents(query);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('콘텐츠 목록 조회 오류:', error);
      return res.status(500).json({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: '콘텐츠 목록 조회 중 오류가 발생했습니다.',
      });
    }
  }

  /**
   * 콘텐츠 생성
   * POST /api/admin/policies/contents
   */
  async createContent(req: Request, res: Response) {
    try {
      const data: CreatePolicyContentRequestDto = req.body;

      // 필수 필드 검증
      if (!data.templateVersionId || !data.target || !data.content) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_REQUEST',
          message: '템플릿 버전 ID, 대상, 내용은 필수입니다.',
        });
      }

      const result = await service.createContent(data);

      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('콘텐츠 생성 오류:', error);
      return res.status(500).json({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: '콘텐츠 생성 중 오류가 발생했습니다.',
      });
    }
  }

  /**
   * 콘텐츠 수정
   * PATCH /api/admin/policies/contents/:contentId
   */
  async updateContent(req: Request, res: Response) {
    try {
      const { contentId } = req.params;
      const data: UpdatePolicyContentRequestDto = req.body;

      const result = await service.updateContent(contentId, data);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('콘텐츠 수정 오류:', error);

      if (error.message === 'CONTENT_NOT_FOUND') {
        return res.status(404).json({
          success: false,
          error: 'CONTENT_NOT_FOUND',
          message: '콘텐츠를 찾을 수 없습니다.',
        });
      }

      return res.status(500).json({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: '콘텐츠 수정 중 오류가 발생했습니다.',
      });
    }
  }
}
