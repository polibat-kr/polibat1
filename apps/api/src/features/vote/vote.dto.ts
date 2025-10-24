import { VoteStatus } from '@prisma/client';

/**
 * 투표 생성 Request DTO
 */
export interface CreateVoteRequestDto {
  postId: string; // 게시글 ID (1:1 관계)
  startDate: string; // ISO 8601 format
  endDate: string; // ISO 8601 format
  allowMultiple: boolean; // 복수 선택 허용 여부
  options: CreateVoteOptionDto[]; // 투표 옵션 배열 (최소 2개)
}

/**
 * 투표 옵션 생성 DTO
 */
export interface CreateVoteOptionDto {
  content: string; // 옵션 내용
  displayOrder: number; // 표시 순서
}

/**
 * 투표 수정 Request DTO
 */
export interface UpdateVoteRequestDto {
  startDate?: string;
  endDate?: string;
  status?: VoteStatus; // ACTIVE, CLOSED, CANCELLED
}

/**
 * 투표 참여 Request DTO
 */
export interface ParticipateVoteRequestDto {
  optionIds: string[]; // 선택한 옵션 ID 배열
}

/**
 * 투표 옵션 응답 DTO
 */
export interface VoteOptionResponseDto {
  optionId: string;
  content: string;
  displayOrder: number;
  voteCount: number;
  percentage: number; // 득표율 (%)
  isUserChoice?: boolean; // 현재 사용자가 선택한 옵션 여부
}

/**
 * 투표 응답 DTO
 */
export interface VoteResponseDto {
  id: string;
  postId: string;
  status: VoteStatus;
  startDate: string;
  endDate: string;
  allowMultiple: boolean;
  totalVoters: number; // 총 투표 참여자 수
  options: VoteOptionResponseDto[];
}

/**
 * 투표 결과 응답 DTO
 */
export interface VoteResultsResponseDto {
  voteId: string;
  postId: string;
  status: VoteStatus;
  startDate: string;
  endDate: string;
  allowMultiple: boolean;
  totalVoters: number;
  options: VoteOptionResponseDto[];
  userParticipation?: {
    participatedAt: string;
    selectedOptions: string[]; // 사용자가 선택한 옵션 ID 배열
  };
}

/**
 * 투표 참여자 목록 응답 DTO
 */
export interface VoteParticipationResponseDto {
  id: string;
  voter: {
    userId: string;
    memberId: string;
    nickname: string;
  };
  selectedOptions: string[]; // 선택한 옵션 ID 배열
  participatedAt: string;
}

/**
 * 투표 통계 응답 DTO
 */
export interface VoteStatsResponseDto {
  totalVotes: number; // 전체 투표 수
  activeVotes: number; // 진행 중인 투표 수
  closedVotes: number; // 종료된 투표 수
  totalParticipants: number; // 총 참여자 수
}
