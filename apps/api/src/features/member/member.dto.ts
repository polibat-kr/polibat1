import { MemberType, MemberStatus, PoliticianType } from '@prisma/client';

/**
 * Member DTOs (Data Transfer Objects)
 */

// Request DTOs
export interface GetMembersQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  memberType?: MemberType;
  status?: MemberStatus;
  sortBy?: 'createdAt' | 'lastLoginAt' | 'nickname' | 'email';
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateMemberRequestDto {
  nickname?: string;
  politicianType?: PoliticianType;
  politicianName?: string;
  party?: string;
  district?: string;
}

export interface UpdateMemberStatusRequestDto {
  status: MemberStatus;
  reason?: string;
}

export interface ApproveMemberRequestDto {
  reason?: string;
}

export interface RejectMemberRequestDto {
  reason: string;
}

// Response DTOs
export interface MemberDto {
  userId: string;
  memberId: string;
  email: string;
  nickname: string;
  memberType: MemberType;
  status: MemberStatus;
  politicianType?: PoliticianType | null;
  politicianName?: string | null;
  party?: string | null;
  district?: string | null;
  createdAt: Date;
  lastLoginAt?: Date | null;
}

export interface MemberDetailDto extends MemberDto {
  postCount?: number;
  commentCount?: number;
  voteCount?: number;
  reportCount?: number;
}

export interface MemberListResponseDto {
  members: MemberDto[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface MemberStatusHistoryDto {
  id: string;
  memberId: string;
  fromStatus: MemberStatus;
  toStatus: MemberStatus;
  reason?: string | null;
  changedBy?: string | null;
  createdAt: Date;
}

export interface MemberStatusHistoryResponseDto {
  history: MemberStatusHistoryDto[];
  member: MemberDto;
}
