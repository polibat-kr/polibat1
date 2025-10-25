/**
 * Admin Policy Service
 *
 * 약관/정책 관리 관련 비즈니스 로직
 */

import { AdminPolicyRepository } from './admin-policy.repository';
import {
  GetPolicyTemplatesQueryDto,
  GetPolicyContentsQueryDto,
  CreatePolicyTemplateRequestDto,
  UpdatePolicyTemplateRequestDto,
  CreatePolicyContentRequestDto,
  UpdatePolicyContentRequestDto,
} from './admin-policy.dto';

const repository = new AdminPolicyRepository();

export class AdminPolicyService {
  // ============================================
  // Policy Template 메서드
  // ============================================

  /**
   * 템플릿 목록 조회
   */
  async getTemplates(query: GetPolicyTemplatesQueryDto) {
    const result = await repository.getTemplates(query);

    return {
      templates: result.templates.map((template) => ({
        id: template.id,
        templateId: template.templateId,
        versionId: template.versionId,
        title: template.title,
        content: template.content,
        isActive: template.isActive,
        createdAt: template.createdAt,
        contentCount: template._count.policies,
      })),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  /**
   * 템플릿 생성
   */
  async createTemplate(data: CreatePolicyTemplateRequestDto) {
    // templateId 생성 (TP + 6자리 zero-padding)
    const count = await repository.getTemplateCount();
    const templateId = `TP${String(count + 1).padStart(6, '0')}`;

    // versionId 생성 (TP000001-VN000001)
    const versionId = `${templateId}-VN000001`;

    const template = await repository.createTemplate({
      templateId,
      versionId,
      title: data.title,
      content: data.content,
      isActive: data.isActive,
    });

    return {
      id: template.id,
      templateId: template.templateId,
      versionId: template.versionId,
      title: template.title,
      isActive: template.isActive,
      createdAt: template.createdAt,
    };
  }

  /**
   * 템플릿 수정
   */
  async updateTemplate(templateId: string, data: UpdatePolicyTemplateRequestDto) {
    // templateId로 조회
    const existing = await repository.getTemplateByTemplateId(templateId);
    if (!existing) {
      throw new Error('TEMPLATE_NOT_FOUND');
    }

    const template = await repository.updateTemplate(existing.id, data);

    return {
      id: template.id,
      templateId: template.templateId,
      versionId: template.versionId,
      title: template.title,
      isActive: template.isActive,
    };
  }

  // ============================================
  // Policy Content 메서드
  // ============================================

  /**
   * 콘텐츠 목록 조회
   */
  async getContents(query: GetPolicyContentsQueryDto) {
    const result = await repository.getContents(query);

    return {
      contents: result.contents.map((content) => ({
        id: content.id,
        templateVersionId: content.templateVersionId,
        target: content.target,
        content: content.content,
        isActive: content.isActive,
        createdAt: content.createdAt,
        updatedAt: content.updatedAt,
        template: content.template,
      })),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  /**
   * 콘텐츠 생성
   */
  async createContent(data: CreatePolicyContentRequestDto) {
    const content = await repository.createContent({
      templateVersionId: data.templateVersionId,
      target: data.target,
      content: data.content,
      isActive: data.isActive,
    });

    return {
      id: content.id,
      templateVersionId: content.templateVersionId,
      target: content.target,
      isActive: content.isActive,
      createdAt: content.createdAt,
    };
  }

  /**
   * 콘텐츠 수정
   */
  async updateContent(contentId: string, data: UpdatePolicyContentRequestDto) {
    // ID로 조회
    const existing = await repository.getContentById(contentId);
    if (!existing) {
      throw new Error('CONTENT_NOT_FOUND');
    }

    const content = await repository.updateContent(contentId, data);

    return {
      id: content.id,
      templateVersionId: content.templateVersionId,
      target: content.target,
      isActive: content.isActive,
      updatedAt: content.updatedAt,
    };
  }
}
