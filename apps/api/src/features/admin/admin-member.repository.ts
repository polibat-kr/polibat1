/**
 * Admin Member Management Repository
 *
 * @description
 * - Prisma를 활용한 회원 관리 DB 접근 레이어
 * - 회원 목록, 상세, 상태 변경, 이력 조회
 */

import { PrismaClient, type Prisma } from '@prisma/client';
import type {
  GetMembersQueryDto,
  MemberListItemDto,
  MemberDetailResponseDto,
  MemberStatusHistoryItemDto,
  GetMemberStatusHistoryQueryDto,
  UpdateMemberStatusRequestDto,
  UpdateMemberStatusResponseDto,
} from './admin-member.dto';

export class AdminMemberRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * 회원 목록 조회 (페이지네이션, 필터링, 정렬)
   */
  async getMembers(query: GetMembersQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      memberType,
      status,
      politicianType,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      startDate,
      endDate,
    } = query;

    // WHERE 조건 구성
    const where: Prisma.MemberWhereInput = {};

    // 검색 필터 (이름, 이메일, 닉네임)
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { nickname: { contains: search, mode: 'insensitive' } },
        { politicianName: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 회원 유형 필터
    if (memberType) {
      where.memberType = memberType;
    }

    // 상태 필터
    if (status) {
      where.status = status;
    }

    // 정치인 유형 필터
    if (politicianType) {
      where.politicianType = politicianType;
    }

    // 날짜 필터 (가입일)
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        where.createdAt.lte = endDateTime;
      }
    }

    // 정렬 옵션
    const orderBy: Prisma.MemberOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    // 페이지네이션
    const skip = (page - 1) * limit;

    // 병렬 조회: 데이터 + 총 개수
    const [members, total] = await Promise.all([
      this.prisma.member.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          memberId: true,
          memberType: true,
          status: true,
          email: true,
          nickname: true,
          phone: true,
          profileImage: true,
          politicianType: true,
          politicianName: true,
          party: true,
          district: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
          // 통계는 별도 조회
          _count: {
            select: {
              posts: true,
              comments: true,
            },
          },
        },
      }),
      this.prisma.member.count({ where }),
    ]);

    // DTO 변환
    const membersDto: MemberListItemDto[] = members.map((member) => ({
      id: member.id,
      memberId: member.memberId,
      memberType: member.memberType,
      status: member.status,
      email: member.email,
      nickname: member.nickname,
      phone: member.phone,
      profileImage: member.profileImage,
      politicianType: member.politicianType,
      politicianName: member.politicianName,
      party: member.party,
      district: member.district,
      postCount: member._count.posts,
      commentCount: member._count.comments,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
      lastLoginAt: member.lastLoginAt,
    }));

    return {
      members: membersDto,
      total,
    };
  }

  /**
   * 회원 상세 조회
   */
  async getMemberById(memberId: string): Promise<MemberDetailResponseDto | null> {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      include: {
        _count: {
          select: {
            posts: true,
            comments: true,
            reactions: true,
            reports: true,
          },
        },
        posts: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
          },
        },
        comments: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });

    if (!member) {
      return null;
    }

    // DTO 변환
    return {
      id: member.id,
      memberId: member.memberId,
      memberType: member.memberType,
      status: member.status,
      email: member.email,
      nickname: member.nickname,
      phone: member.phone,
      profileImage: member.profileImage,
      politicianType: member.politicianType,
      politicianName: member.politicianName,
      party: member.party,
      district: member.district,
      verificationDoc: member.verificationDoc,
      emailNotification: member.emailNotification,
      smsNotification: member.smsNotification,
      pushNotification: member.pushNotification,
      postCount: member._count.posts,
      commentCount: member._count.comments,
      reactionCount: member._count.reactions,
      reportCount: member._count.reports,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
      lastLoginAt: member.lastLoginAt,
      recentPosts: member.posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content.substring(0, 100), // 100자만
        createdAt: post.createdAt,
      })),
      recentComments: member.comments.map((comment) => ({
        id: comment.id,
        content: comment.content.substring(0, 100), // 100자만
        createdAt: comment.createdAt,
      })),
    };
  }

  /**
   * 회원 상태 변경 + 이력 저장
   */
  async updateMemberStatus(
    memberId: string,
    statusData: UpdateMemberStatusRequestDto,
    adminId: string
  ): Promise<UpdateMemberStatusResponseDto | null> {
    // 1. 현재 회원 정보 조회
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      select: {
        id: true,
        memberId: true,
        status: true,
      },
    });

    if (!member) {
      return null;
    }

    const previousStatus = member.status;
    const currentStatus = statusData.status;

    // 2. 트랜잭션으로 상태 변경 + 이력 저장
    await this.prisma.$transaction([
      // 회원 상태 변경
      this.prisma.member.update({
        where: { id: memberId },
        data: { status: currentStatus },
      }),
      // 상태 변경 이력 저장
      this.prisma.memberStatusHistory.create({
        data: {
          memberId,
          fromStatus: previousStatus,
          toStatus: currentStatus,
          reason: statusData.reason || null,
          changedBy: adminId,
        },
      }),
    ]);

    return {
      id: memberId,
      memberId: member.memberId,
      previousStatus,
      currentStatus,
      reason: statusData.reason || null,
      changedBy: adminId,
      changedAt: new Date(),
    };
  }

  /**
   * 회원 상태 변경 이력 조회
   */
  async getMemberStatusHistory(query: GetMemberStatusHistoryQueryDto) {
    const { memberId, page = 1, limit = 20, startDate, endDate } = query;

    // WHERE 조건 구성
    const where: Prisma.MemberStatusHistoryWhereInput = {};

    // 특정 회원의 이력만 조회
    if (memberId) {
      where.memberId = memberId;
    }

    // 날짜 필터
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        where.createdAt.lte = endDateTime;
      }
    }

    // 페이지네이션
    const skip = (page - 1) * limit;

    // 병렬 조회: 데이터 + 총 개수
    const [history, total] = await Promise.all([
      this.prisma.memberStatusHistory.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          member: {
            select: {
              memberId: true,
              nickname: true,
            },
          },
        },
      }),
      this.prisma.memberStatusHistory.count({ where }),
    ]);

    // Admin 닉네임 조회 (changedBy)
    const adminIds = history.map((h) => h.changedBy).filter((id): id is string => id !== null);
    const admins = await this.prisma.member.findMany({
      where: { id: { in: adminIds } },
      select: { id: true, nickname: true },
    });
    const adminMap = new Map(admins.map((a) => [a.id, a.nickname]));

    // DTO 변환
    const historyDto: MemberStatusHistoryItemDto[] = history.map((item) => ({
      id: item.id,
      memberId: item.member.memberId,
      memberNickname: item.member.nickname,
      fromStatus: item.fromStatus,
      toStatus: item.toStatus,
      reason: item.reason,
      changedBy: item.changedBy,
      changedByNickname: item.changedBy ? adminMap.get(item.changedBy) || null : null,
      createdAt: item.createdAt,
    }));

    return {
      history: historyDto,
      total,
    };
  }
}
