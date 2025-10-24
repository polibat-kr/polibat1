/**
 * Admin Member Management DTO
 *
 * @description
 * - 관리자 회원 관리 데이터 타입 정의
 * - 회원 목록 조회, 상세 조회, 상태 변경 등
 */

import type { MemberType, MemberStatus, PoliticianType } from '@prisma/client';

/**
 * 회원 목록 조회 Query Parameters
 */
export interface GetMembersQueryDto {
  // 페이지네이션
  page?: number; // 페이지 번호 (default: 1)
  limit?: number; // 페이지당 개수 (default: 20)

  // 검색 필터
  search?: string; // 이름, 이메일, 닉네임 검색
  memberType?: MemberType; // 회원 유형 필터
  status?: MemberStatus; // 상태 필터
  politicianType?: PoliticianType; // 정치인 유형 필터

  // 정렬
  sortBy?: 'createdAt' | 'lastLoginAt' | 'nickname'; // 정렬 기준
  sortOrder?: 'asc' | 'desc'; // 정렬 순서 (default: desc)

  // 날짜 필터
  startDate?: string; // 가입일 시작 (YYYY-MM-DD)
  endDate?: string; // 가입일 종료 (YYYY-MM-DD)
}

/**
 * 회원 목록 응답 DTO
 */
export interface GetMembersResponseDto {
  members: MemberListItemDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * 회원 목록 아이템 DTO
 */
export interface MemberListItemDto {
  id: string;
  memberId: string; // NM000001, PM000001, PA000001
  memberType: MemberType;
  status: MemberStatus;
  email: string;
  nickname: string;
  phone: string | null;
  profileImage: string | null;

  // 정치인 정보
  politicianType: PoliticianType | null;
  politicianName: string | null;
  party: string | null;
  district: string | null;

  // 통계
  postCount: number;
  commentCount: number;

  // 타임스탬프
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}

/**
 * 회원 상세 응답 DTO
 */
export interface MemberDetailResponseDto {
  id: string;
  memberId: string;
  memberType: MemberType;
  status: MemberStatus;

  // 인증 정보
  email: string;

  // 기본 정보
  nickname: string;
  phone: string | null;
  profileImage: string | null;

  // 정치인 정보
  politicianType: PoliticianType | null;
  politicianName: string | null;
  party: string | null;
  district: string | null;
  verificationDoc: string | null;

  // 알림 설정
  emailNotification: boolean;
  smsNotification: boolean;
  pushNotification: boolean;

  // 통계
  postCount: number;
  commentCount: number;
  reactionCount: number;
  reportCount: number;

  // 타임스탬프
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;

  // 최근 활동
  recentPosts: RecentActivityDto[];
  recentComments: RecentActivityDto[];
}

/**
 * 최근 활동 DTO
 */
export interface RecentActivityDto {
  id: string;
  title?: string;
  content: string;
  createdAt: Date;
}

/**
 * 회원 상태 변경 요청 DTO
 */
export interface UpdateMemberStatusRequestDto {
  status: MemberStatus;
  reason?: string; // 상태 변경 사유
}

/**
 * 회원 상태 변경 응답 DTO
 */
export interface UpdateMemberStatusResponseDto {
  id: string;
  memberId: string;
  previousStatus: MemberStatus;
  currentStatus: MemberStatus;
  reason: string | null;
  changedBy: string; // Admin ID
  changedAt: Date;
}

/**
 * 회원 상태 변경 이력 조회 Query Parameters
 */
export interface GetMemberStatusHistoryQueryDto {
  memberId?: string; // 특정 회원의 이력만 조회
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

/**
 * 회원 상태 변경 이력 응답 DTO
 */
export interface GetMemberStatusHistoryResponseDto {
  history: MemberStatusHistoryItemDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * 회원 상태 변경 이력 아이템 DTO
 */
export interface MemberStatusHistoryItemDto {
  id: string;
  memberId: string;
  memberNickname: string; // JOIN Member
  fromStatus: MemberStatus;
  toStatus: MemberStatus;
  reason: string | null;
  changedBy: string | null; // Admin ID
  changedByNickname: string | null; // JOIN Member for admin nickname
  createdAt: Date;
}
