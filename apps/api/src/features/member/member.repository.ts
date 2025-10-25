import { PrismaClient, Member, MemberStatus, MemberStatusHistory, Prisma } from '@prisma/client';
import { GetMembersQueryDto, UpdateMemberRequestDto } from './member.dto';

const prisma = new PrismaClient();

/**
 * Member Repository
 * Database operations for member management
 */
export class MemberRepository {
  /**
   * Find members with filtering, pagination, and search
   */
  static async findMembers(query: GetMembersQueryDto): Promise<{ members: Member[]; total: number }> {
    const {
      page = 1,
      limit = 20,
      search,
      memberType,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.MemberWhereInput = {};

    if (memberType) {
      where.memberType = memberType;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { nickname: { contains: search, mode: 'insensitive' } },
        { memberId: { contains: search, mode: 'insensitive' } },
        { politicianName: { contains: search, mode: 'insensitive' } },
        { party: { contains: search, mode: 'insensitive' } },
        { district: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Execute queries in parallel
    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          memberId: true,
          email: true,
          nickname: true,
          memberType: true,
          status: true,
          politicianType: true,
          politicianName: true,
          party: true,
          district: true,
          createdAt: true,
          lastLoginAt: true,
          updatedAt: true,
          deletedAt: true,
          passwordHash: true,
          phone: true,
          profileImage: true,
          verificationDoc: true,
          emailNotification: true,
          smsNotification: true,
          pushNotification: true,
        },
      }),
      prisma.member.count({ where }),
    ]);

    return { members, total };
  }

  /**
   * Find member by UUID
   */
  static async findByUserId(userId: string): Promise<Member | null> {
    return prisma.member.findUnique({
      where: { id: userId },
    });
  }

  /**
   * Find member by memberId (e.g., NM000001)
   */
  static async findByMemberId(memberId: string): Promise<Member | null> {
    return prisma.member.findUnique({
      where: { memberId },
    });
  }

  /**
   * Update member information
   */
  static async updateMember(userId: string, data: UpdateMemberRequestDto): Promise<Member> {
    return prisma.member.update({
      where: { id: userId },
      data,
    });
  }

  /**
   * Update member status with history tracking
   */
  static async updateMemberStatus(
    userId: string,
    newStatus: MemberStatus,
    reason?: string,
    changedBy?: string
  ): Promise<Member> {
    // Find current member to get current status
    const currentMember = await prisma.member.findUnique({
      where: { id: userId },
    });

    if (!currentMember) {
      throw new Error('Member not found');
    }

    // Update member status and create history record in transaction
    const [updatedMember] = await prisma.$transaction([
      prisma.member.update({
        where: { id: userId },
        data: { status: newStatus },
      }),
      prisma.memberStatusHistory.create({
        data: {
          memberId: userId, // Use UUID, not formatted memberId
          fromStatus: currentMember.status,
          toStatus: newStatus,
          reason,
          changedBy,
        },
      }),
    ]);

    return updatedMember;
  }

  /**
   * Soft delete member (set status to WITHDRAWN)
   */
  static async deactivateMember(userId: string, reason?: string, changedBy?: string): Promise<Member> {
    return this.updateMemberStatus(userId, 'WITHDRAWN', reason, changedBy);
  }

  /**
   * Get member status history
   * @param userId - UUID of the member
   */
  static async getMemberStatusHistory(userId: string): Promise<MemberStatusHistory[]> {
    return prisma.memberStatusHistory.findMany({
      where: { memberId: userId }, // memberId in history table is UUID
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Check if nickname exists (excluding current user)
   */
  static async isNicknameExistsForUpdate(nickname: string, excludeUserId: string): Promise<boolean> {
    const member = await prisma.member.findFirst({
      where: {
        nickname,
        NOT: { id: excludeUserId },
      },
    });
    return member !== null;
  }

  /**
   * Get member statistics (post, comment, vote counts)
   */
  static async getMemberStatistics(memberId: string): Promise<{
    postCount: number;
    commentCount: number;
    voteCount: number;
    reportCount: number;
  }> {
    const [postCount, commentCount, voteCount, reportCount] = await Promise.all([
      prisma.post.count({ where: { authorId: memberId } }),
      prisma.comment.count({ where: { authorId: memberId } }),
      prisma.voteParticipation.count({ where: { voterId: memberId } }),
      prisma.report.count({ where: { reporterId: memberId } }),
    ]);

    return { postCount, commentCount, voteCount, reportCount };
  }
}
