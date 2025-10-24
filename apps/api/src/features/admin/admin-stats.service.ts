/**
 * Admin Statistics Service
 *
 * @description
 * - 관리자 통계 비즈니스 로직
 * - Repository 데이터 가공 및 응답 포맷팅
 */

import { AdminStatsRepository } from './admin-stats.repository';
import {
  MemberStatsResponseDto,
  PostStatsResponseDto,
  CommentStatsResponseDto,
  VoteStatsResponseDto,
  ReportStatsResponseDto,
  DashboardStatsResponseDto,
  PeriodType,
} from './admin-stats.dto';

export class AdminStatsService {
  /**
   * 회원 통계 조회
   * @param period 기간 타입 (day, week, month)
   * @param days 조회할 일수 (일별 통계용)
   */
  static async getMemberStats(
    period?: PeriodType,
    days?: number
  ): Promise<MemberStatsResponseDto> {
    const stats = await AdminStatsRepository.getMemberStats();

    let response: MemberStatsResponseDto = { ...stats };

    // 기간별 통계 추가
    if (period === 'day' && days) {
      const dailyStats = await AdminStatsRepository.getDailyMemberStats(days);
      response.dailyStats = dailyStats;
    }

    return response;
  }

  /**
   * 게시글 통계 조회
   */
  static async getPostStats(
    period?: PeriodType,
    days?: number
  ): Promise<PostStatsResponseDto> {
    const stats = await AdminStatsRepository.getPostStats();

    let response: PostStatsResponseDto = { ...stats };

    // 기간별 통계 추가
    if (period === 'day' && days) {
      const dailyStats = await AdminStatsRepository.getDailyPostStats(days);
      response.dailyStats = dailyStats;
    }

    return response;
  }

  /**
   * 댓글 통계 조회
   */
  static async getCommentStats(
    period?: PeriodType,
    days?: number
  ): Promise<CommentStatsResponseDto> {
    const stats = await AdminStatsRepository.getCommentStats();

    let response: CommentStatsResponseDto = { ...stats };

    // 기간별 통계 추가
    if (period === 'day' && days) {
      const dailyStats = await AdminStatsRepository.getDailyCommentStats(days);
      response.dailyStats = dailyStats;
    }

    return response;
  }

  /**
   * 투표 통계 조회
   */
  static async getVoteStats(
    period?: PeriodType,
    days?: number
  ): Promise<VoteStatsResponseDto> {
    const stats = await AdminStatsRepository.getVoteStats();

    let response: VoteStatsResponseDto = { ...stats };

    // 기간별 통계 추가
    if (period === 'day' && days) {
      const dailyStats = await AdminStatsRepository.getDailyVoteStats(days);
      response.dailyStats = dailyStats;
    }

    return response;
  }

  /**
   * 신고 통계 조회
   */
  static async getReportStats(
    period?: PeriodType,
    days?: number
  ): Promise<ReportStatsResponseDto> {
    const stats = await AdminStatsRepository.getReportStats();

    let response: ReportStatsResponseDto = { ...stats };

    // 기간별 통계 추가
    if (period === 'day' && days) {
      const dailyStats = await AdminStatsRepository.getDailyReportStats(days);
      response.dailyStats = dailyStats;
    }

    return response;
  }

  /**
   * 대시보드 전체 통계 조회
   * @param includePeriod 기간별 통계 포함 여부
   * @param days 조회할 일수
   */
  static async getDashboardStats(
    includePeriod: boolean = false,
    days: number = 30
  ): Promise<DashboardStatsResponseDto> {
    // 병렬로 모든 통계 조회
    const [members, posts, comments, votes, reports] = await Promise.all([
      this.getMemberStats(includePeriod ? 'day' : undefined, includePeriod ? days : undefined),
      this.getPostStats(includePeriod ? 'day' : undefined, includePeriod ? days : undefined),
      this.getCommentStats(includePeriod ? 'day' : undefined, includePeriod ? days : undefined),
      this.getVoteStats(includePeriod ? 'day' : undefined, includePeriod ? days : undefined),
      this.getReportStats(includePeriod ? 'day' : undefined, includePeriod ? days : undefined),
    ]);

    return {
      members,
      posts,
      comments,
      votes,
      reports,
      lastUpdated: new Date(),
    };
  }
}
