/**
 * Admin Suggestion Service
 *
 * 건의사항 관리 비즈니스 로직
 */

import { SuggestionType } from '@prisma/client';
import { AdminSuggestionRepository } from './admin-suggestion.repository';
import {
  GetSuggestionsQueryDto,
  SuggestionDto,
  GetSuggestionsResponseDto,
  GetSuggestionDetailResponseDto,
  CreateSuggestionRequestDto,
  CreateSuggestionResponseDto,
  ReplySuggestionRequestDto,
  ReplySuggestionResponseDto,
  UpdateSuggestionStatusRequestDto,
  UpdateSuggestionStatusResponseDto,
} from './admin-suggestion.dto';

export class AdminSuggestionService {
  private repository: AdminSuggestionRepository;

  constructor() {
    this.repository = new AdminSuggestionRepository();
  }

  /**
   * 건의사항 목록 조회
   */
  async getSuggestions(query: GetSuggestionsQueryDto): Promise<GetSuggestionsResponseDto> {
    const { page = 1, limit = 20 } = query;

    const { suggestions, total } = await this.repository.getSuggestions(query);

    const suggestionDtos: SuggestionDto[] = suggestions.map((suggestion) => ({
      id: suggestion.id,
      suggestionId: suggestion.suggestionId,
      suggestionType: suggestion.suggestionType,
      status: suggestion.status,
      userId: suggestion.userId,
      title: suggestion.title,
      content: suggestion.content,
      adminReply: suggestion.adminReply,
      adminId: suggestion.adminId,
      createdAt: suggestion.createdAt,
      repliedAt: suggestion.repliedAt,
      user: suggestion.user
        ? {
            id: suggestion.user.id,
            memberId: suggestion.user.memberId,
            nickname: suggestion.user.nickname,
            memberType: suggestion.user.memberType.toString(),
          }
        : undefined,
    }));

    return {
      success: true,
      data: {
        suggestions: suggestionDtos,
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
   * 건의사항 상세 조회
   */
  async getSuggestionDetail(suggestionId: string): Promise<GetSuggestionDetailResponseDto> {
    // suggestionId로 조회
    const suggestion = await this.repository.getSuggestionBySuggestionId(suggestionId);

    if (!suggestion) {
      throw new Error('건의사항을 찾을 수 없습니다.');
    }

    return {
      success: true,
      data: {
        id: suggestion.id,
        suggestionId: suggestion.suggestionId,
        suggestionType: suggestion.suggestionType,
        status: suggestion.status,
        userId: suggestion.userId,
        title: suggestion.title,
        content: suggestion.content,
        adminReply: suggestion.adminReply,
        adminId: suggestion.adminId,
        createdAt: suggestion.createdAt,
        repliedAt: suggestion.repliedAt,
        user: suggestion.user
          ? {
              id: suggestion.user.id,
              memberId: suggestion.user.memberId,
              nickname: suggestion.user.nickname,
              memberType: suggestion.user.memberType.toString(),
            }
          : undefined,
      },
    };
  }

  /**
   * 건의사항 생성
   */
  async createSuggestion(data: CreateSuggestionRequestDto): Promise<CreateSuggestionResponseDto> {
    const { suggestionType, title, content, userId } = data;

    // suggestionId 생성
    // - COMPLAINT: RC000001 (Report Complaint)
    // - FEATURE/VOTE_PROPOSAL: RS000001 (Report Suggestion)
    const count = await this.repository.getSuggestionCount();
    const prefix = suggestionType === SuggestionType.COMPLAINT ? 'RC' : 'RS';
    const suggestionId = `${prefix}${String(count + 1).padStart(6, '0')}`;

    // 건의사항 생성
    const suggestion = await this.repository.createSuggestion({
      suggestionId,
      suggestionType,
      userId,
      title,
      content,
    });

    return {
      success: true,
      data: {
        id: suggestion.id,
        suggestionId: suggestion.suggestionId,
        suggestionType: suggestion.suggestionType,
        title: suggestion.title,
        status: suggestion.status,
        createdAt: suggestion.createdAt,
      },
    };
  }

  /**
   * 관리자 답변 작성
   */
  async replySuggestion(
    suggestionId: string,
    adminId: string,
    data: ReplySuggestionRequestDto
  ): Promise<ReplySuggestionResponseDto> {
    // suggestionId로 조회
    const suggestion = await this.repository.getSuggestionBySuggestionId(suggestionId);

    if (!suggestion) {
      throw new Error('건의사항을 찾을 수 없습니다.');
    }

    // 관리자 답변 작성
    const updatedSuggestion = await this.repository.replySuggestion(
      suggestion.id,
      data.adminReply,
      adminId,
      data.status
    );

    return {
      success: true,
      data: {
        id: updatedSuggestion.id,
        suggestionId: updatedSuggestion.suggestionId,
        adminReply: updatedSuggestion.adminReply || '',
        status: updatedSuggestion.status,
        repliedAt: updatedSuggestion.repliedAt || new Date(),
      },
    };
  }

  /**
   * 건의사항 상태 변경
   */
  async updateSuggestionStatus(
    suggestionId: string,
    data: UpdateSuggestionStatusRequestDto
  ): Promise<UpdateSuggestionStatusResponseDto> {
    // suggestionId로 조회
    const suggestion = await this.repository.getSuggestionBySuggestionId(suggestionId);

    if (!suggestion) {
      throw new Error('건의사항을 찾을 수 없습니다.');
    }

    // 상태 변경
    const updatedSuggestion = await this.repository.updateSuggestionStatus(
      suggestion.id,
      data.status
    );

    return {
      success: true,
      data: {
        id: updatedSuggestion.id,
        suggestionId: updatedSuggestion.suggestionId,
        status: updatedSuggestion.status,
        updatedAt: new Date(),
      },
    };
  }
}
