/**
 * Admin Suggestion Repository
 *
 * 건의사항 관리 관련 데이터베이스 접근 레이어
 */

import { PrismaClient, SuggestionType, SuggestionStatus } from '@prisma/client';
import { GetSuggestionsQueryDto } from './admin-suggestion.dto';

const prisma = new PrismaClient();

export class AdminSuggestionRepository {
  /**
   * 건의사항 목록 조회
   */
  async getSuggestions(query: GetSuggestionsQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      suggestionType,
      status,
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
    if (suggestionType) {
      where.suggestionType = suggestionType;
    }
    if (status) {
      where.status = status;
    }

    // 기간 필터
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(`${startDate}T00:00:00Z`);
      }
      if (endDate) {
        where.createdAt.lte = new Date(`${endDate}T23:59:59Z`);
      }
    }

    // 정렬 조건
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // 병렬 조회 (데이터 + 총 개수)
    const [suggestions, total] = await Promise.all([
      prisma.suggestion.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              memberId: true,
              nickname: true,
              memberType: true,
            },
          },
        },
      }),
      prisma.suggestion.count({ where }),
    ]);

    return {
      suggestions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 건의사항 상세 조회 (UUID)
   */
  async getSuggestionById(id: string) {
    const suggestion = await prisma.suggestion.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            memberId: true,
            nickname: true,
            memberType: true,
          },
        },
      },
    });

    if (!suggestion) {
      return null;
    }

    return suggestion;
  }

  /**
   * suggestionId로 건의사항 조회
   */
  async getSuggestionBySuggestionId(suggestionId: string) {
    const suggestion = await prisma.suggestion.findUnique({
      where: { suggestionId },
      include: {
        user: {
          select: {
            id: true,
            memberId: true,
            nickname: true,
            memberType: true,
          },
        },
      },
    });

    if (!suggestion) {
      return null;
    }

    return suggestion;
  }

  /**
   * 건의사항 생성
   */
  async createSuggestion(data: {
    suggestionId: string;
    suggestionType: SuggestionType;
    userId: string;
    title: string;
    content: string;
  }) {
    const suggestion = await prisma.suggestion.create({
      data,
    });

    return suggestion;
  }

  /**
   * 관리자 답변 작성
   */
  async replySuggestion(
    id: string,
    adminReply: string,
    adminId: string,
    status?: SuggestionStatus
  ) {
    const data: any = {
      adminReply,
      adminId,
      repliedAt: new Date(),
    };

    // 상태 변경이 있는 경우
    if (status) {
      data.status = status;
    }

    const suggestion = await prisma.suggestion.update({
      where: { id },
      data,
    });

    return suggestion;
  }

  /**
   * 건의사항 상태 변경
   */
  async updateSuggestionStatus(id: string, status: SuggestionStatus) {
    const suggestion = await prisma.suggestion.update({
      where: { id },
      data: { status },
    });

    return suggestion;
  }

  /**
   * 다음 suggestionId 생성을 위한 카운트 조회
   */
  async getSuggestionCount() {
    const count = await prisma.suggestion.count();
    return count;
  }
}
