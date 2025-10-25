/**
 * Admin Policy Repository
 *
 * 약관/정책 관리 관련 데이터베이스 접근 레이어
 */

import { PrismaClient, PolicyTarget } from '@prisma/client';
import {
  GetPolicyTemplatesQueryDto,
  GetPolicyContentsQueryDto,
} from './admin-policy.dto';

const prisma = new PrismaClient();

export class AdminPolicyRepository {
  // ============================================
  // Policy Template 메서드
  // ============================================

  /**
   * 템플릿 목록 조회
   */
  async getTemplates(query: GetPolicyTemplatesQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
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

    // 정렬 조건
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // 병렬 조회 (데이터 + 총 개수)
    const [templates, total] = await Promise.all([
      prisma.policyTemplate.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          _count: {
            select: { policies: true },
          },
        },
      }),
      prisma.policyTemplate.count({ where }),
    ]);

    return {
      templates,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 템플릿 ID로 조회
   */
  async getTemplateById(id: string) {
    const template = await prisma.policyTemplate.findUnique({
      where: { id },
      include: {
        _count: {
          select: { policies: true },
        },
      },
    });

    if (!template) {
      return null;
    }

    return template;
  }

  /**
   * templateId로 조회
   */
  async getTemplateByTemplateId(templateId: string) {
    const template = await prisma.policyTemplate.findFirst({
      where: { templateId },
      include: {
        _count: {
          select: { policies: true },
        },
      },
    });

    if (!template) {
      return null;
    }

    return template;
  }

  /**
   * 템플릿 개수 조회 (ID 생성용)
   */
  async getTemplateCount() {
    return await prisma.policyTemplate.count();
  }

  /**
   * 특정 templateId의 버전 개수 조회 (versionId 생성용)
   */
  async getTemplateVersionCount(templateId: string) {
    return await prisma.policyTemplate.count({
      where: { templateId },
    });
  }

  /**
   * 템플릿 생성
   */
  async createTemplate(data: {
    templateId: string;
    versionId: string;
    title: string;
    content: string;
    isActive?: boolean;
  }) {
    return await prisma.policyTemplate.create({
      data: {
        templateId: data.templateId,
        versionId: data.versionId,
        title: data.title,
        content: data.content,
        isActive: data.isActive ?? true,
      },
    });
  }

  /**
   * 템플릿 수정
   */
  async updateTemplate(
    id: string,
    data: {
      title?: string;
      content?: string;
      isActive?: boolean;
    }
  ) {
    return await prisma.policyTemplate.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // Policy Content 메서드
  // ============================================

  /**
   * 콘텐츠 목록 조회
   */
  async getContents(query: GetPolicyContentsQueryDto) {
    const {
      page = 1,
      limit = 20,
      templateVersionId,
      target,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;
    const take = limit;

    // Where 조건 구성
    const where: any = {};

    // 필터 조건
    if (templateVersionId) {
      where.templateVersionId = templateVersionId;
    }
    if (target) {
      where.target = target;
    }
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // 정렬 조건
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // 병렬 조회 (데이터 + 총 개수)
    const [contents, total] = await Promise.all([
      prisma.policyContent.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          template: {
            select: {
              templateId: true,
              versionId: true,
              title: true,
            },
          },
        },
      }),
      prisma.policyContent.count({ where }),
    ]);

    return {
      contents,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 콘텐츠 ID로 조회
   */
  async getContentById(id: string) {
    const content = await prisma.policyContent.findUnique({
      where: { id },
      include: {
        template: {
          select: {
            templateId: true,
            versionId: true,
            title: true,
          },
        },
      },
    });

    if (!content) {
      return null;
    }

    return content;
  }

  /**
   * 콘텐츠 생성
   */
  async createContent(data: {
    templateVersionId: string;
    target: PolicyTarget;
    content: string;
    isActive?: boolean;
  }) {
    return await prisma.policyContent.create({
      data: {
        templateVersionId: data.templateVersionId,
        target: data.target,
        content: data.content,
        isActive: data.isActive ?? true,
      },
      include: {
        template: {
          select: {
            templateId: true,
            versionId: true,
            title: true,
          },
        },
      },
    });
  }

  /**
   * 콘텐츠 수정
   */
  async updateContent(
    id: string,
    data: {
      content?: string;
      target?: PolicyTarget;
      isActive?: boolean;
    }
  ) {
    return await prisma.policyContent.update({
      where: { id },
      data,
      include: {
        template: {
          select: {
            templateId: true,
            versionId: true,
            title: true,
          },
        },
      },
    });
  }
}
