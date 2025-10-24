/**
 * Admin Member Management Service
 *
 * @description
 * - 회원 관리 비즈니스 로직
 * - 목록 조회, 상세 조회, 상태 변경, 이력 조회
 */

import { PrismaClient } from '@prisma/client';
import { AdminMemberRepository } from './admin-member.repository';
import type {
  GetMembersQueryDto,
  GetMembersResponseDto,
  MemberDetailResponseDto,
  UpdateMemberStatusRequestDto,
  UpdateMemberStatusResponseDto,
  GetMemberStatusHistoryQueryDto,
  GetMemberStatusHistoryResponseDto,
} from './admin-member.dto';

export class AdminMemberService {
  private repository: AdminMemberRepository;

  constructor(prisma: PrismaClient) {
    this.repository = new AdminMemberRepository(prisma);
  }

  /**
   * 회원 목록 조회 (페이지네이션, 필터링, 정렬)
   */
  async getMembers(query: GetMembersQueryDto): Promise<GetMembersResponseDto> {
    const { members, total } = await this.repository.getMembers(query);

    const page = query.page || 1;
    const limit = query.limit || 20;
    const totalPages = Math.ceil(total / limit);

    return {
      members,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * 회원 상세 조회
   */
  async getMemberById(memberId: string): Promise<MemberDetailResponseDto> {
    const member = await this.repository.getMemberById(memberId);

    if (!member) {
      throw new Error('Member not found');
    }

    return member;
  }

  /**
   * 회원 상태 변경
   */
  async updateMemberStatus(
    memberId: string,
    statusData: UpdateMemberStatusRequestDto,
    adminId: string
  ): Promise<UpdateMemberStatusResponseDto> {
    // 1. 회원 존재 확인
    const member = await this.repository.getMemberById(memberId);
    if (!member) {
      throw new Error('Member not found');
    }

    // 2. 현재 상태와 동일한지 확인
    if (member.status === statusData.status) {
      throw new Error('Member status is already the same');
    }

    // 3. 상태 변경 (+ 이력 저장)
    const result = await this.repository.updateMemberStatus(memberId, statusData, adminId);

    if (!result) {
      throw new Error('Failed to update member status');
    }

    return result;
  }

  /**
   * 회원 상태 변경 이력 조회
   */
  async getMemberStatusHistory(
    query: GetMemberStatusHistoryQueryDto
  ): Promise<GetMemberStatusHistoryResponseDto> {
    const { history, total } = await this.repository.getMemberStatusHistory(query);

    const page = query.page || 1;
    const limit = query.limit || 20;
    const totalPages = Math.ceil(total / limit);

    return {
      history,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}
