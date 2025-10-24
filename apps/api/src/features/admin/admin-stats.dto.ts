/**
 * Admin Statistics DTO
 *
 * @description
 * - 관리자 대시보드 통계 데이터 타입 정의
 * - 회원, 게시글, 댓글, 투표, 신고 통계
 */

/**
 * 기간 타입
 */
export type PeriodType = 'day' | 'week' | 'month' | 'year';

/**
 * 통계 타입
 */
export type StatsMode = 'cumulative' | 'change';

/**
 * 회원 통계 응답 DTO
 */
export interface MemberStatsResponseDto {
  totalMembers: number;
  newMembersToday: number;
  newMembersThisWeek: number;
  newMembersThisMonth: number;
  activeMembers: number;
  pendingMembers: number;
  suspendedMembers: number;
  bannedMembers: number;
  membersByType: {
    normal: number;
    politician: number;
    assistant: number;
    admin: number;
  };
  membersByStatus: {
    approved: number;
    withdrawn: number;
    pending: number;
    suspended: number;
    banned: number;
  };
  dailyStats?: DailyMemberStats[];
  weeklyStats?: WeeklyMemberStats[];
  monthlyStats?: MonthlyMemberStats[];
}

/**
 * 일별 회원 통계
 */
export interface DailyMemberStats {
  date: string; // YYYY-MM-DD
  newMembers: number;
  totalMembers: number;
}

/**
 * 주별 회원 통계
 */
export interface WeeklyMemberStats {
  weekStart: string; // YYYY-MM-DD
  weekEnd: string; // YYYY-MM-DD
  newMembers: number;
  totalMembers: number;
}

/**
 * 월별 회원 통계
 */
export interface MonthlyMemberStats {
  month: string; // YYYY-MM
  newMembers: number;
  totalMembers: number;
}

/**
 * 게시글 통계 응답 DTO
 */
export interface PostStatsResponseDto {
  totalPosts: number;
  postsToday: number;
  postsThisWeek: number;
  postsThisMonth: number;
  postsByBoard: {
    free: number;
    politician: number;
  };
  postsByStatus: {
    published: number;
    hidden: number;
    deleted: number;
  };
  postsWithVote: number;
  dailyStats?: DailyPostStats[];
  weeklyStats?: WeeklyPostStats[];
  monthlyStats?: MonthlyPostStats[];
}

/**
 * 일별 게시글 통계
 */
export interface DailyPostStats {
  date: string;
  newPosts: number;
  totalPosts: number;
}

/**
 * 주별 게시글 통계
 */
export interface WeeklyPostStats {
  weekStart: string;
  weekEnd: string;
  newPosts: number;
  totalPosts: number;
}

/**
 * 월별 게시글 통계
 */
export interface MonthlyPostStats {
  month: string;
  newPosts: number;
  totalPosts: number;
}

/**
 * 댓글 통계 응답 DTO
 */
export interface CommentStatsResponseDto {
  totalComments: number;
  commentsToday: number;
  commentsThisWeek: number;
  commentsThisMonth: number;
  commentsByStatus: {
    published: number;
    hidden: number;
    deleted: number;
  };
  repliesCount: number; // 대댓글 수
  dailyStats?: DailyCommentStats[];
}

/**
 * 일별 댓글 통계
 */
export interface DailyCommentStats {
  date: string;
  newComments: number;
  totalComments: number;
}

/**
 * 투표 통계 응답 DTO
 */
export interface VoteStatsResponseDto {
  totalVotes: number;
  activeVotes: number;
  closedVotes: number;
  totalParticipations: number;
  averageParticipationRate: number; // 평균 참여율 (%)
  dailyStats?: DailyVoteStats[];
}

/**
 * 일별 투표 통계
 */
export interface DailyVoteStats {
  date: string;
  newVotes: number;
  totalVotes: number;
  participations: number;
}

/**
 * 신고 통계 응답 DTO
 */
export interface ReportStatsResponseDto {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  rejectedReports: number; // dismissedReports -> rejectedReports
  reportsByTarget: {
    post: number;
    comment: number;
  };
  reportsByReason: {
    spam: number;
    abuse: number;
    inappropriate: number;
    misinformation: number;
    other: number;
  };
  dailyStats?: DailyReportStats[];
}

/**
 * 일별 신고 통계
 */
export interface DailyReportStats {
  date: string;
  newReports: number;
  resolvedReports: number;
  pendingReports: number;
}

/**
 * 대시보드 전체 통계 응답 DTO
 */
export interface DashboardStatsResponseDto {
  members: MemberStatsResponseDto;
  posts: PostStatsResponseDto;
  comments: CommentStatsResponseDto;
  votes: VoteStatsResponseDto;
  reports: ReportStatsResponseDto;
  lastUpdated: Date;
}

/**
 * 방문자 통계 응답 DTO (Phase 3에서 구현 예정)
 */
export interface VisitorStatsResponseDto {
  totalVisitors: number;
  visitorsToday: number;
  visitorsThisWeek: number;
  visitorsThisMonth: number;
  pageViews: number;
  averageSessionDuration: number; // 초 단위
  bounceRate: number; // %
  dailyStats?: DailyVisitorStats[];
}

/**
 * 일별 방문자 통계
 */
export interface DailyVisitorStats {
  date: string;
  visitors: number;
  pageViews: number;
  averageSessionDuration: number;
}
