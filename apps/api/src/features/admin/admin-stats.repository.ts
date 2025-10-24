/**
 * Admin Statistics Repository
 *
 * @description
 * - 관리자 통계 데이터 조회
 * - Prisma 직접 쿼리 사용
 */

import { prisma } from '../../core/database';

export class AdminStatsRepository {
  /**
   * 회원 통계 조회
   */
  static async getMemberStats() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // 전체 회원 수
    const totalMembers = await prisma.member.count();

    // 오늘 가입한 회원 수
    const newMembersToday = await prisma.member.count({
      where: {
        createdAt: { gte: todayStart },
      },
    });

    // 이번 주 가입한 회원 수
    const newMembersThisWeek = await prisma.member.count({
      where: {
        createdAt: { gte: weekStart },
      },
    });

    // 이번 달 가입한 회원 수
    const newMembersThisMonth = await prisma.member.count({
      where: {
        createdAt: { gte: monthStart },
      },
    });

    // 활성 회원 수 (APPROVED로 변경)
    const activeMembers = await prisma.member.count({
      where: { status: 'APPROVED' as const },
    });

    // 승인 대기 회원 수
    const pendingMembers = await prisma.member.count({
      where: { status: 'PENDING' as const },
    });

    // 정지된 회원 수
    const suspendedMembers = await prisma.member.count({
      where: { status: 'SUSPENDED' as const },
    });

    // 강퇴된 회원 수
    const bannedMembers = await prisma.member.count({
      where: { status: 'BANNED' as const },
    });

    // 유형별 회원 수
    const normal = await prisma.member.count({ where: { memberType: 'NORMAL' as const } });
    const politician = await prisma.member.count({ where: { memberType: 'POLITICIAN' as const } });
    const assistant = await prisma.member.count({ where: { memberType: 'ASSISTANT' as const } });
    const admin = await prisma.member.count({ where: { memberType: 'ADMIN' as const } });

    // 상태별 회원 수
    const approved = await prisma.member.count({ where: { status: 'APPROVED' as const } });
    const withdrawn = await prisma.member.count({ where: { status: 'WITHDRAWN' as const } });
    const pending = await prisma.member.count({ where: { status: 'PENDING' as const } });
    const suspended = await prisma.member.count({ where: { status: 'SUSPENDED' as const } });
    const banned = await prisma.member.count({ where: { status: 'BANNED' as const } });

    return {
      totalMembers,
      newMembersToday,
      newMembersThisWeek,
      newMembersThisMonth,
      activeMembers,
      pendingMembers,
      suspendedMembers,
      bannedMembers,
      membersByType: {
        normal,
        politician,
        assistant,
        admin,
      },
      membersByStatus: {
        approved,
        withdrawn,
        pending,
        suspended,
        banned,
      },
    };
  }

  /**
   * 일별 회원 통계 조회
   * @param days 조회할 일수 (기본값: 30일)
   */
  static async getDailyMemberStats(days: number = 30) {
    const stats = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dateEnd = new Date(dateStart.getTime() + 24 * 60 * 60 * 1000);

      const newMembers = await prisma.member.count({
        where: {
          createdAt: {
            gte: dateStart,
            lt: dateEnd,
          },
        },
      });

      const totalMembers = await prisma.member.count({
        where: {
          createdAt: { lt: dateEnd },
        },
      });

      stats.push({
        date: dateStart.toISOString().split('T')[0],
        newMembers,
        totalMembers,
      });
    }

    return stats;
  }

  /**
   * 게시글 통계 조회
   */
  static async getPostStats() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // 전체 게시글 수
    const totalPosts = await prisma.post.count();

    // 오늘 작성된 게시글 수
    const postsToday = await prisma.post.count({
      where: { createdAt: { gte: todayStart } },
    });

    // 이번 주 게시글 수
    const postsThisWeek = await prisma.post.count({
      where: { createdAt: { gte: weekStart } },
    });

    // 이번 달 게시글 수
    const postsThisMonth = await prisma.post.count({
      where: { createdAt: { gte: monthStart } },
    });

    // 게시판별 게시글 수
    const free = await prisma.post.count({ where: { boardType: 'FREE' as const } });
    const politician = await prisma.post.count({ where: { boardType: 'POLITICIAN' as const } });

    // 상태별 게시글 수
    const published = await prisma.post.count({ where: { status: 'PUBLISHED' as const } });
    const hidden = await prisma.post.count({ where: { status: 'HIDDEN' as const } });
    const deleted = await prisma.post.count({ where: { status: 'DELETED' as const } });

    // 투표가 있는 게시글 수 (Vote.postId가 unique하므로 Vote 개수로 계산)
    const postsWithVote = await prisma.vote.count();

    return {
      totalPosts,
      postsToday,
      postsThisWeek,
      postsThisMonth,
      postsByBoard: { free, politician },
      postsByStatus: { published, hidden, deleted },
      postsWithVote,
    };
  }

  /**
   * 일별 게시글 통계 조회
   */
  static async getDailyPostStats(days: number = 30) {
    const stats = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dateEnd = new Date(dateStart.getTime() + 24 * 60 * 60 * 1000);

      const newPosts = await prisma.post.count({
        where: {
          createdAt: {
            gte: dateStart,
            lt: dateEnd,
          },
        },
      });

      const totalPosts = await prisma.post.count({
        where: {
          createdAt: { lt: dateEnd },
        },
      });

      stats.push({
        date: dateStart.toISOString().split('T')[0],
        newPosts,
        totalPosts,
      });
    }

    return stats;
  }

  /**
   * 댓글 통계 조회
   */
  static async getCommentStats() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // 전체 댓글 수
    const totalComments = await prisma.comment.count();

    // 오늘 작성된 댓글 수
    const commentsToday = await prisma.comment.count({
      where: { createdAt: { gte: todayStart } },
    });

    // 이번 주 댓글 수
    const commentsThisWeek = await prisma.comment.count({
      where: { createdAt: { gte: weekStart } },
    });

    // 이번 달 댓글 수
    const commentsThisMonth = await prisma.comment.count({
      where: { createdAt: { gte: monthStart } },
    });

    // 상태별 댓글 수
    const published = await prisma.comment.count({ where: { status: 'PUBLISHED' as const } });
    const hidden = await prisma.comment.count({ where: { status: 'HIDDEN' as const } });
    const deleted = await prisma.comment.count({ where: { status: 'DELETED' as const } });

    // 대댓글 수 (현재 스키마에는 parentCommentId가 없으므로 0으로 설정)
    const repliesCount = 0; // TODO: 대댓글 기능 추가 시 구현

    return {
      totalComments,
      commentsToday,
      commentsThisWeek,
      commentsThisMonth,
      commentsByStatus: { published, hidden, deleted },
      repliesCount,
    };
  }

  /**
   * 일별 댓글 통계 조회
   */
  static async getDailyCommentStats(days: number = 30) {
    const stats = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dateEnd = new Date(dateStart.getTime() + 24 * 60 * 60 * 1000);

      const newComments = await prisma.comment.count({
        where: {
          createdAt: {
            gte: dateStart,
            lt: dateEnd,
          },
        },
      });

      const totalComments = await prisma.comment.count({
        where: {
          createdAt: { lt: dateEnd },
        },
      });

      stats.push({
        date: dateStart.toISOString().split('T')[0],
        newComments,
        totalComments,
      });
    }

    return stats;
  }

  /**
   * 투표 통계 조회
   */
  static async getVoteStats() {
    // 전체 투표 수
    const totalVotes = await prisma.vote.count();

    // 진행 중인 투표 수
    const activeVotes = await prisma.vote.count({
      where: { status: 'ACTIVE' as const },
    });

    // 마감된 투표 수
    const closedVotes = await prisma.vote.count({
      where: { status: 'CLOSED' as const },
    });

    // 전체 투표 참여 수
    const totalParticipations = await prisma.voteParticipation.count();

    // 평균 참여율 계산
    const votes = await prisma.vote.findMany({
      select: {
        totalVoters: true,
      },
    });

    let averageParticipationRate = 0;
    if (votes.length > 0) {
      const totalVoters = votes.reduce((sum, vote) => sum + vote.totalVoters, 0);
      averageParticipationRate = totalVotes > 0 ? (totalVoters / totalVotes) * 100 : 0;
    }

    return {
      totalVotes,
      activeVotes,
      closedVotes,
      totalParticipations,
      averageParticipationRate: Math.round(averageParticipationRate * 100) / 100,
    };
  }

  /**
   * 일별 투표 통계 조회
   * Note: Vote 모델에는 createdAt이 없으므로 Post의 createdAt 사용
   */
  static async getDailyVoteStats(days: number = 30) {
    const stats = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dateEnd = new Date(dateStart.getTime() + 24 * 60 * 60 * 1000);

      // Vote 모델에 createdAt이 없으므로 관련 Post의 createdAt 사용
      const newVotes = await prisma.vote.count({
        where: {
          post: {
            createdAt: {
              gte: dateStart,
              lt: dateEnd,
            },
          },
        },
      });

      const totalVotes = await prisma.vote.count({
        where: {
          post: {
            createdAt: { lt: dateEnd },
          },
        },
      });

      const participations = await prisma.voteParticipation.count({
        where: {
          createdAt: {
            gte: dateStart,
            lt: dateEnd,
          },
        },
      });

      stats.push({
        date: dateStart.toISOString().split('T')[0],
        newVotes,
        totalVotes,
        participations,
      });
    }

    return stats;
  }

  /**
   * 신고 통계 조회
   */
  static async getReportStats() {
    // 전체 신고 수
    const totalReports = await prisma.report.count();

    // 대기 중인 신고 수
    const pendingReports = await prisma.report.count({
      where: { status: 'PENDING' as const },
    });

    // 처리된 신고 수
    const resolvedReports = await prisma.report.count({
      where: { status: 'RESOLVED' as const },
    });

    // 기각된 신고 수 (DISMISSED -> REJECTED)
    const rejectedReports = await prisma.report.count({
      where: { status: 'REJECTED' as const },
    });

    // 대상별 신고 수 (MEMBER 타입은 스키마에 없음)
    const post = await prisma.report.count({ where: { targetType: 'POST' as const } });
    const comment = await prisma.report.count({ where: { targetType: 'COMMENT' as const } });

    // 사유별 신고 수
    const spam = await prisma.report.count({ where: { reason: 'SPAM' as const } });
    const abuse = await prisma.report.count({ where: { reason: 'ABUSE' as const } });
    const inappropriate = await prisma.report.count({ where: { reason: 'INAPPROPRIATE' as const } });
    const misinformation = await prisma.report.count({ where: { reason: 'MISINFORMATION' as const } });
    const other = await prisma.report.count({ where: { reason: 'OTHER' as const } });

    return {
      totalReports,
      pendingReports,
      resolvedReports,
      rejectedReports,
      reportsByTarget: { post, comment },
      reportsByReason: { spam, abuse, inappropriate, misinformation, other },
    };
  }

  /**
   * 일별 신고 통계 조회
   */
  static async getDailyReportStats(days: number = 30) {
    const stats = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dateEnd = new Date(dateStart.getTime() + 24 * 60 * 60 * 1000);

      const newReports = await prisma.report.count({
        where: {
          createdAt: {
            gte: dateStart,
            lt: dateEnd,
          },
        },
      });

      const resolvedReports = await prisma.report.count({
        where: {
          processedAt: {
            gte: dateStart,
            lt: dateEnd,
          },
          status: { in: ['RESOLVED' as const, 'REJECTED' as const] }, // DISMISSED -> REJECTED
        },
      });

      const pendingReports = await prisma.report.count({
        where: {
          createdAt: { lt: dateEnd },
          status: 'PENDING',
        },
      });

      stats.push({
        date: dateStart.toISOString().split('T')[0],
        newReports,
        resolvedReports,
        pendingReports,
      });
    }

    return stats;
  }
}