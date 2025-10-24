import { VoteRepository } from './vote.repository';
import {
  CreateVoteRequestDto,
  UpdateVoteRequestDto,
  ParticipateVoteRequestDto,
  VoteResponseDto,
  VoteResultsResponseDto,
  VoteOptionResponseDto,
  VoteStatsResponseDto,
} from './vote.dto';
import { ApiError } from '../../shared/middleware/error-handler';
import { ERROR_CODES } from '../../shared/utils/error-codes';
import { Vote, VoteOption } from '@prisma/client';

/**
 * Vote Service
 * 투표 비즈니스 로직
 */
export class VoteService {
  /**
   * 투표 생성
   */
  static async createVote(
    postId: string,
    data: CreateVoteRequestDto
  ): Promise<VoteResponseDto> {
    // 유효성 검증
    this.validateVoteDates(data.startDate, data.endDate);
    this.validateVoteOptions(data.options);

    const vote = await VoteRepository.createVote(postId, data);
    return this.formatVoteResponse(vote);
  }

  /**
   * 투표 상세 조회
   */
  static async getVoteById(
    voteId: string,
    userId?: string
  ): Promise<VoteResponseDto> {
    const vote = await VoteRepository.findVoteById(voteId);

    if (!vote) {
      throw new ApiError(404, '투표를 찾을 수 없습니다.', ERROR_CODES.VOTE_NOT_FOUND);
    }

    return this.formatVoteResponse(vote, userId);
  }

  /**
   * 게시글 ID로 투표 조회
   */
  static async getVoteByPostId(
    postId: string,
    userId?: string
  ): Promise<VoteResponseDto | null> {
    const vote = await VoteRepository.findVoteByPostId(postId);

    if (!vote) {
      return null;
    }

    return this.formatVoteResponse(vote, userId);
  }

  /**
   * 투표 수정
   */
  static async updateVote(
    voteId: string,
    data: UpdateVoteRequestDto
  ): Promise<VoteResponseDto> {
    // 투표 존재 여부 확인
    const existingVote = await VoteRepository.findVoteById(voteId);
    if (!existingVote) {
      throw new ApiError(404, '투표를 찾을 수 없습니다.', ERROR_CODES.VOTE_NOT_FOUND);
    }

    // 날짜 유효성 검증
    if (data.startDate && data.endDate) {
      this.validateVoteDates(data.startDate, data.endDate);
    }

    await VoteRepository.updateVote(voteId, data);
    const voteWithOptions = await VoteRepository.findVoteById(voteId);

    return this.formatVoteResponse(voteWithOptions!);
  }

  /**
   * 투표 삭제
   */
  static async deleteVote(voteId: string): Promise<void> {
    const vote = await VoteRepository.findVoteById(voteId);
    if (!vote) {
      throw new ApiError(404, '투표를 찾을 수 없습니다.', ERROR_CODES.VOTE_NOT_FOUND);
    }

    await VoteRepository.deleteVote(voteId);
  }

  /**
   * 투표 참여
   */
  static async participateVote(
    voteId: string,
    voterId: string,
    data: ParticipateVoteRequestDto
  ): Promise<VoteResultsResponseDto> {
    const vote = await VoteRepository.findVoteById(voteId);

    if (!vote) {
      throw new ApiError(404, '투표를 찾을 수 없습니다.', ERROR_CODES.VOTE_NOT_FOUND);
    }

    // 투표 상태 확인
    if (vote.status !== 'ACTIVE') {
      throw new ApiError(400, '투표가 진행 중이 아닙니다.', ERROR_CODES.VOTE_NOT_ACTIVE);
    }

    // 투표 기간 확인
    const now = new Date();
    if (now < vote.startDate || now > vote.endDate) {
      throw new ApiError(400, '투표 기간이 아닙니다.', ERROR_CODES.VOTE_NOT_IN_PERIOD);
    }

    // 옵션 수 검증
    if (!vote.allowMultiple && data.optionIds.length > 1) {
      throw new ApiError(
        400,
        '단일 선택 투표입니다.',
        ERROR_CODES.VOTE_MULTIPLE_NOT_ALLOWED
      );
    }

    // 옵션 ID 유효성 검증
    const validOptionIds = vote.options.map((opt) => opt.id);
    const invalidOptions = data.optionIds.filter(
      (id) => !validOptionIds.includes(id)
    );
    if (invalidOptions.length > 0) {
      throw new ApiError(
        400,
        '유효하지 않은 옵션입니다.',
        ERROR_CODES.VOTE_INVALID_OPTION
      );
    }

    // 투표 참여
    await VoteRepository.participateVote(voteId, voterId, data.optionIds);

    // 결과 반환
    return this.getVoteResults(voteId, voterId);
  }

  /**
   * 투표 참여 취소
   */
  static async cancelParticipation(
    voteId: string,
    voterId: string
  ): Promise<void> {
    const vote = await VoteRepository.findVoteById(voteId);

    if (!vote) {
      throw new ApiError(404, '투표를 찾을 수 없습니다.', ERROR_CODES.VOTE_NOT_FOUND);
    }

    await VoteRepository.cancelParticipation(voteId, voterId);
  }

  /**
   * 투표 결과 조회
   */
  static async getVoteResults(
    voteId: string,
    userId?: string
  ): Promise<VoteResultsResponseDto> {
    const vote = await VoteRepository.getVoteResults(voteId);

    // 사용자 참여 정보 조회
    let userParticipation = undefined;
    if (userId) {
      const participations = await VoteRepository.findUserParticipation(
        voteId,
        userId
      );
      if (participations.length > 0) {
        userParticipation = {
          participatedAt: participations[0].createdAt.toISOString(),
          selectedOptions: participations.map((p) => p.optionId),
        };
      }
    }

    // 옵션 포맷팅 (득표율 계산)
    const formattedOptions = this.formatVoteOptions(
      vote.options,
      vote.totalVoters,
      userParticipation?.selectedOptions
    );

    return {
      voteId: vote.id,
      postId: vote.postId,
      status: vote.status,
      startDate: vote.startDate.toISOString(),
      endDate: vote.endDate.toISOString(),
      allowMultiple: vote.allowMultiple,
      totalVoters: vote.totalVoters,
      options: formattedOptions,
      userParticipation,
    };
  }

  /**
   * 투표 종료 (관리자)
   */
  static async closeVote(voteId: string): Promise<VoteResponseDto> {
    const vote = await VoteRepository.findVoteById(voteId);

    if (!vote) {
      throw new ApiError(404, '투표를 찾을 수 없습니다.', ERROR_CODES.VOTE_NOT_FOUND);
    }

    if (vote.status === 'CLOSED') {
      throw new ApiError(400, '이미 종료된 투표입니다.', ERROR_CODES.VOTE_ALREADY_CLOSED);
    }

    await VoteRepository.updateVote(voteId, {
      status: 'CLOSED',
    });

    const voteWithOptions = await VoteRepository.findVoteById(voteId);
    return this.formatVoteResponse(voteWithOptions!);
  }

  /**
   * 투표 통계 조회
   */
  static async getVoteStats(): Promise<VoteStatsResponseDto> {
    return await VoteRepository.getVoteStats();
  }

  // ========== Private Helper Methods ==========

  /**
   * 투표 응답 포맷팅
   */
  private static async formatVoteResponse(
    vote: Vote & { options: VoteOption[] },
    userId?: string
  ): Promise<VoteResponseDto> {
    // 사용자 참여 정보 조회
    let userSelectedOptions: string[] | undefined;
    if (userId) {
      const participations = await VoteRepository.findUserParticipation(
        vote.id,
        userId
      );
      if (participations.length > 0) {
        userSelectedOptions = participations.map((p) => p.optionId);
      }
    }

    const formattedOptions = this.formatVoteOptions(
      vote.options,
      vote.totalVoters,
      userSelectedOptions
    );

    return {
      id: vote.id,
      postId: vote.postId,
      status: vote.status,
      startDate: vote.startDate.toISOString(),
      endDate: vote.endDate.toISOString(),
      allowMultiple: vote.allowMultiple,
      totalVoters: vote.totalVoters,
      options: formattedOptions,
    };
  }

  /**
   * 투표 옵션 포맷팅 (득표율 계산)
   */
  private static formatVoteOptions(
    options: VoteOption[],
    totalVoters: number,
    userSelectedOptions?: string[]
  ): VoteOptionResponseDto[] {
    return options.map((option) => ({
      optionId: option.id,
      content: option.content,
      displayOrder: option.displayOrder,
      voteCount: option.voteCount,
      percentage:
        totalVoters > 0
          ? Math.round((option.voteCount / totalVoters) * 100 * 100) / 100
          : 0,
      isUserChoice: userSelectedOptions?.includes(option.id),
    }));
  }

  /**
   * 투표 날짜 유효성 검증
   */
  private static validateVoteDates(startDate: string, endDate: string): void {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      throw new ApiError(
        400,
        '종료일은 시작일보다 늦어야 합니다.',
        ERROR_CODES.VOTE_INVALID_DATES
      );
    }

    // 과거 날짜 체크 (생성 시에만)
    const now = new Date();
    if (end < now) {
      throw new ApiError(
        400,
        '종료일은 현재 시각 이후여야 합니다.',
        ERROR_CODES.VOTE_INVALID_DATES
      );
    }
  }

  /**
   * 투표 옵션 유효성 검증
   */
  private static validateVoteOptions(
    options: CreateVoteRequestDto['options']
  ): void {
    if (options.length < 2) {
      throw new ApiError(
        400,
        '투표 옵션은 최소 2개 이상이어야 합니다.',
        ERROR_CODES.VOTE_INSUFFICIENT_OPTIONS
      );
    }

    if (options.length > 10) {
      throw new ApiError(
        400,
        '투표 옵션은 최대 10개까지 가능합니다.',
        ERROR_CODES.VOTE_TOO_MANY_OPTIONS
      );
    }

    // 옵션 내용 중복 체크
    const contents = options.map((opt) => opt.content.trim());
    const uniqueContents = new Set(contents);
    if (contents.length !== uniqueContents.size) {
      throw new ApiError(
        400,
        '중복된 옵션이 있습니다.',
        ERROR_CODES.VOTE_DUPLICATE_OPTIONS
      );
    }
  }
}
