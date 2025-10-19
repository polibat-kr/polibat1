import { prisma } from '../../core/database';
import { Member, MemberType, MemberStatus, PoliticianType } from '@prisma/client';
import { generateId } from '@polibat/utils';

/**
 * 회원 생성 데이터
 */
export interface CreateMemberData {
  email: string;
  passwordHash: string;
  nickname: string;
  memberType: MemberType;
  status: MemberStatus;

  // 정치인/보좌관 전용
  politicianType?: PoliticianType;
  politicianName?: string;
  party?: string;
  district?: string;
}

/**
 * Auth Repository
 * 회원 인증 관련 데이터베이스 작업
 */
export class AuthRepository {
  /**
   * 이메일로 회원 조회
   */
  static async findByEmail(email: string): Promise<Member | null> {
    return prisma.member.findUnique({
      where: { email },
    });
  }

  /**
   * memberId로 회원 조회
   */
  static async findByMemberId(memberId: string): Promise<Member | null> {
    return prisma.member.findUnique({
      where: { memberId },
    });
  }

  /**
   * userId로 회원 조회
   */
  static async findByUserId(userId: string): Promise<Member | null> {
    return prisma.member.findUnique({
      where: { id: userId },
    });
  }

  /**
   * 닉네임으로 회원 조회
   */
  static async findByNickname(nickname: string): Promise<Member | null> {
    return prisma.member.findUnique({
      where: { nickname },
    });
  }

  /**
   * 회원 생성
   */
  static async createMember(data: CreateMemberData): Promise<Member> {
    // memberId 생성 (memberType에 따라 prefix 다름)
    const prefix = this.getMemberIdPrefix(data.memberType);
    const lastMember = await prisma.member.findFirst({
      where: {
        memberId: {
          startsWith: prefix,
        },
      },
      orderBy: {
        memberId: 'desc',
      },
    });

    let nextNumber = 1;
    if (lastMember?.memberId) {
      const lastNumber = parseInt(lastMember.memberId.substring(2));
      nextNumber = lastNumber + 1;
    }

    const memberId = generateId(prefix, nextNumber, 6);

    return prisma.member.create({
      data: {
        memberId,
        email: data.email,
        passwordHash: data.passwordHash,
        nickname: data.nickname,
        memberType: data.memberType,
        status: data.status,
        politicianType: data.politicianType,
        politicianName: data.politicianName,
        party: data.party,
        district: data.district,
      },
    });
  }

  /**
   * 최근 로그인 시간 업데이트
   */
  static async updateLastLogin(userId: string): Promise<Member> {
    return prisma.member.update({
      where: { id: userId },
      data: {
        lastLoginAt: new Date(),
      },
    });
  }

  /**
   * 비밀번호 업데이트
   */
  static async updatePassword(userId: string, passwordHash: string): Promise<Member> {
    return prisma.member.update({
      where: { id: userId },
      data: {
        passwordHash,
      },
    });
  }

  /**
   * 회원 상태 업데이트
   */
  static async updateStatus(
    userId: string,
    fromStatus: MemberStatus,
    toStatus: MemberStatus,
    reason?: string
  ): Promise<void> {
    await prisma.$transaction([
      // 회원 상태 업데이트
      prisma.member.update({
        where: { id: userId },
        data: { status: toStatus },
      }),

      // 상태 변경 이력 생성
      prisma.memberStatusHistory.create({
        data: {
          memberId: userId,
          fromStatus,
          toStatus,
          reason: reason || '상태 변경',
          changedBy: 'SYSTEM', // TODO: 관리자 ID로 변경
        },
      }),
    ]);
  }

  /**
   * 이메일 중복 확인
   */
  static async isEmailExists(email: string): Promise<boolean> {
    const count = await prisma.member.count({
      where: { email },
    });
    return count > 0;
  }

  /**
   * 닉네임 중복 확인
   */
  static async isNicknameExists(nickname: string): Promise<boolean> {
    const count = await prisma.member.count({
      where: { nickname },
    });
    return count > 0;
  }

  /**
   * MemberType에 따른 ID Prefix 반환
   */
  private static getMemberIdPrefix(memberType: MemberType): string {
    switch (memberType) {
      case 'NORMAL':
        return 'NM';
      case 'POLITICIAN':
        return 'PM';
      case 'ASSISTANT':
        return 'PA';
      case 'ADMIN':
        return 'AM';
      default:
        return 'NM';
    }
  }
}
