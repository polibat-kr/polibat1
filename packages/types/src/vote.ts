/**
 * 투표 관련 타입 정의
 */

export enum VoteStatus {
  SCHEDULED = '예정',
  IN_PROGRESS = '진행',
  CLOSED = '마감',
}

export interface Vote {
  id: string;
  voteId: string; // VP000001
  title: string;
  description?: string;
  status: VoteStatus;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface VoteOption {
  id: string;
  optionText: string;
  order: number;
  voteId: string;
}

export interface VoteParticipation {
  id: string;
  memberId: string;
  voteId: string;
  optionId: string;
  createdAt: Date;
}

export interface VoteCreateInput {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  options: string[];
}

export interface VoteResults {
  voteId: string;
  totalVotes: number;
  options: {
    optionId: string;
    optionText: string;
    voteCount: number;
    percentage: number;
  }[];
}
