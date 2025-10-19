/**
 * 회원 관련 타입 정의
 */

export enum MemberType {
  NORMAL = 'NORMAL',
  POLITICIAN = 'POLITICIAN',
  ASSISTANT = 'ASSISTANT',
  ADMIN = 'ADMIN',
}

export enum MemberStatus {
  APPROVED = '승인',
  PENDING_APPROVAL = '승인대기',
  WITHDRAWN = '탈퇴',
  SUSPENDED = '정지',
  BANNED = '강퇴',
}

export enum PoliticianType {
  NATIONAL_ASSEMBLY = '국회의원',
  LOCAL_GOVERNMENT = '지방자치단체',
  PRESIDENTIAL_OFFICE = '대통령실',
}

export interface Member {
  id: string;
  memberId: string; // NM000001, PM000001, PA000001
  memberType: MemberType;
  email: string;
  nickname: string;
  status: MemberStatus;
  politicianType?: PoliticianType;
  profileImage?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface MemberListFilters {
  memberType?: MemberType;
  status?: MemberStatus;
  search?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface MemberStatusChange {
  memberId: string;
  fromStatus: MemberStatus;
  toStatus: MemberStatus;
  reason: string;
  changedBy: string;
  changedAt: Date;
}
