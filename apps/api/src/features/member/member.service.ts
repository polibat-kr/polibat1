import { MemberRepository } from './member.repository';
import { ApiError } from '../../shared/middleware/error-handler';
import { ERROR_CODES } from '../../shared/utils/error-codes';
import {
  GetMembersQueryDto,
  UpdateMemberRequestDto,
  UpdateMemberStatusRequestDto,
  ApproveMemberRequestDto,
  RejectMemberRequestDto,
  MemberDto,
  MemberDetailDto,
  MemberListResponseDto,
  MemberStatusHistoryResponseDto,
} from './member.dto';

/**
 * Member Service
 * Business logic for member management
 */
export class MemberService {
  /**
   * Get members list with filtering and pagination
   */
  static async getMembers(query: GetMembersQueryDto): Promise<MemberListResponseDto> {
    const { page = 1, limit = 20 } = query;

    const { members, total } = await MemberRepository.findMembers(query);

    const totalPages = Math.ceil(total / limit);

    return {
      members: members.map((member) => ({
        userId: member.id,
        memberId: member.memberId,
        email: member.email,
        nickname: member.nickname,
        memberType: member.memberType,
        status: member.status,
        politicianType: member.politicianType,
        politicianName: member.politicianName,
        party: member.party,
        district: member.district,
        createdAt: member.createdAt,
        lastLoginAt: member.lastLoginAt,
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: total,
        pageSize: limit,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  }

  /**
   * Get member details by ID
   */
  static async getMemberById(userId: string): Promise<MemberDetailDto> {
    const member = await MemberRepository.findByUserId(userId);

    if (!member) {
      throw new ApiError(404, '회원을 찾을 수 없습니다.', ERROR_CODES.MEMBER_NOT_FOUND);
    }

    // Get member statistics
    const statistics = await MemberRepository.getMemberStatistics(member.memberId);

    return {
      userId: member.id,
      memberId: member.memberId,
      email: member.email,
      nickname: member.nickname,
      memberType: member.memberType,
      status: member.status,
      politicianType: member.politicianType,
      politicianName: member.politicianName,
      party: member.party,
      district: member.district,
      createdAt: member.createdAt,
      lastLoginAt: member.lastLoginAt,
      ...statistics,
    };
  }

  /**
   * Update member information
   */
  static async updateMember(
    userId: string,
    data: UpdateMemberRequestDto,
    _requestorId: string
  ): Promise<MemberDto> {
    // Check if member exists
    const member = await MemberRepository.findByUserId(userId);
    if (!member) {
      throw new ApiError(404, '회원을 찾을 수 없습니다.', ERROR_CODES.MEMBER_NOT_FOUND);
    }

    // Check if user is updating their own profile or is an admin
    // (This will be enhanced when we have proper auth context)
    // For now, we'll allow the update if requestor matches userId

    // Check nickname uniqueness if updating nickname
    if (data.nickname) {
      const nicknameExists = await MemberRepository.isNicknameExistsForUpdate(data.nickname, userId);
      if (nicknameExists) {
        throw new ApiError(409, '이미 사용 중인 닉네임입니다.', ERROR_CODES.NICKNAME_ALREADY_EXISTS);
      }
    }

    // Update member
    const updatedMember = await MemberRepository.updateMember(userId, data);

    return {
      userId: updatedMember.id,
      memberId: updatedMember.memberId,
      email: updatedMember.email,
      nickname: updatedMember.nickname,
      memberType: updatedMember.memberType,
      status: updatedMember.status,
      politicianType: updatedMember.politicianType,
      politicianName: updatedMember.politicianName,
      party: updatedMember.party,
      district: updatedMember.district,
      createdAt: updatedMember.createdAt,
      lastLoginAt: updatedMember.lastLoginAt,
    };
  }

  /**
   * Deactivate member (soft delete)
   */
  static async deactivateMember(userId: string, adminId: string): Promise<void> {
    // Check if member exists
    const member = await MemberRepository.findByUserId(userId);
    if (!member) {
      throw new ApiError(404, '회원을 찾을 수 없습니다.', ERROR_CODES.MEMBER_NOT_FOUND);
    }

    // Check if already withdrawn
    if (member.status === 'WITHDRAWN') {
      throw new ApiError(400, '이미 탈퇴한 회원입니다.', ERROR_CODES.MEMBER_ALREADY_WITHDRAWN);
    }

    // Deactivate member
    await MemberRepository.deactivateMember(userId, '관리자에 의한 회원 탈퇴 처리', adminId);
  }

  /**
   * Update member status (admin only)
   */
  static async updateMemberStatus(
    userId: string,
    data: UpdateMemberStatusRequestDto,
    adminId: string
  ): Promise<MemberDto> {
    // Check if member exists
    const member = await MemberRepository.findByUserId(userId);
    if (!member) {
      throw new ApiError(404, '회원을 찾을 수 없습니다.', ERROR_CODES.MEMBER_NOT_FOUND);
    }

    // Validate status transition
    if (member.status === data.status) {
      throw new ApiError(400, '이미 해당 상태입니다.', ERROR_CODES.INVALID_STATUS_TRANSITION);
    }

    // Update status with history
    const updatedMember = await MemberRepository.updateMemberStatus(userId, data.status, data.reason, adminId);

    return {
      userId: updatedMember.id,
      memberId: updatedMember.memberId,
      email: updatedMember.email,
      nickname: updatedMember.nickname,
      memberType: updatedMember.memberType,
      status: updatedMember.status,
      politicianType: updatedMember.politicianType,
      politicianName: updatedMember.politicianName,
      party: updatedMember.party,
      district: updatedMember.district,
      createdAt: updatedMember.createdAt,
      lastLoginAt: updatedMember.lastLoginAt,
    };
  }

  /**
   * Approve pending member (admin only)
   */
  static async approveMember(
    userId: string,
    data: ApproveMemberRequestDto,
    adminId: string
  ): Promise<MemberDto> {
    // Check if member exists
    const member = await MemberRepository.findByUserId(userId);
    if (!member) {
      throw new ApiError(404, '회원을 찾을 수 없습니다.', ERROR_CODES.MEMBER_NOT_FOUND);
    }

    // Check if member is pending
    if (member.status !== 'PENDING') {
      throw new ApiError(400, '승인 대기 중인 회원이 아닙니다.', ERROR_CODES.MEMBER_NOT_PENDING);
    }

    // Approve member
    const updatedMember = await MemberRepository.updateMemberStatus(
      userId,
      'APPROVED',
      data.reason || '관리자 승인',
      adminId
    );

    return {
      userId: updatedMember.id,
      memberId: updatedMember.memberId,
      email: updatedMember.email,
      nickname: updatedMember.nickname,
      memberType: updatedMember.memberType,
      status: updatedMember.status,
      politicianType: updatedMember.politicianType,
      politicianName: updatedMember.politicianName,
      party: updatedMember.party,
      district: updatedMember.district,
      createdAt: updatedMember.createdAt,
      lastLoginAt: updatedMember.lastLoginAt,
    };
  }

  /**
   * Reject pending member (admin only)
   */
  static async rejectMember(userId: string, data: RejectMemberRequestDto, adminId: string): Promise<void> {
    // Check if member exists
    const member = await MemberRepository.findByUserId(userId);
    if (!member) {
      throw new ApiError(404, '회원을 찾을 수 없습니다.', ERROR_CODES.MEMBER_NOT_FOUND);
    }

    // Check if member is pending
    if (member.status !== 'PENDING') {
      throw new ApiError(400, '승인 대기 중인 회원이 아닙니다.', ERROR_CODES.MEMBER_NOT_PENDING);
    }

    // Reject member by setting status to WITHDRAWN
    await MemberRepository.updateMemberStatus(userId, 'WITHDRAWN', data.reason, adminId);
  }

  /**
   * Get member status history
   */
  static async getMemberStatusHistory(userId: string): Promise<MemberStatusHistoryResponseDto> {
    // Check if member exists
    const member = await MemberRepository.findByUserId(userId);
    if (!member) {
      throw new ApiError(404, '회원을 찾을 수 없습니다.', ERROR_CODES.MEMBER_NOT_FOUND);
    }

    // Get status history
    const history = await MemberRepository.getMemberStatusHistory(userId);

    return {
      member: {
        userId: member.id,
        memberId: member.memberId,
        email: member.email,
        nickname: member.nickname,
        memberType: member.memberType,
        status: member.status,
        politicianType: member.politicianType,
        politicianName: member.politicianName,
        party: member.party,
        district: member.district,
        createdAt: member.createdAt,
        lastLoginAt: member.lastLoginAt,
      },
      history: history.map((h) => ({
        id: h.id,
        memberId: h.memberId,
        fromStatus: h.fromStatus,
        toStatus: h.toStatus,
        reason: h.reason,
        changedBy: h.changedBy,
        createdAt: h.createdAt,
      })),
    };
  }
}
