/**
 * Admin Search Service
 *
 * 통합 검색 비즈니스 로직
 */

import { AdminSearchRepository } from './admin-search.repository';
import {
  AdminSearchQueryDto,
  AdminSearchResponseDto,
  MemberSearchResult,
  PostSearchResult,
  CommentSearchResult,
  ReportSearchResult,
} from './admin-search.dto';

export class AdminSearchService {
  private repository: AdminSearchRepository;

  constructor() {
    this.repository = new AdminSearchRepository();
  }

  /**
   * 통합 검색
   */
  async search(queryDto: AdminSearchQueryDto): Promise<AdminSearchResponseDto> {
    const { query, category = 'all', limit = 5 } = queryDto;

    // 검색 실행 (병렬)
    const { members, posts, comments, reports } = await this.repository.searchAll(query, category, limit);

    // 회원 결과 포맷팅
    const memberResults: MemberSearchResult[] = members.members.map((member: any) => ({
      id: member.id,
      memberId: member.memberId,
      nickname: member.nickname,
      email: member.email,
      memberType: member.memberType,
      status: member.status,
      createdAt: member.createdAt,
    }));

    // 게시글 결과 포맷팅
    const postResults: PostSearchResult[] = posts.posts.map((post: any) => ({
      id: post.id,
      postId: post.postId,
      title: post.title,
      boardType: post.boardType,
      status: post.status,
      authorNickname: post.author.nickname,
      viewCount: post.viewCount,
      likeCount: posts.likeCountMap.get(post.id) || 0,
      createdAt: post.createdAt,
    }));

    // 댓글 결과 포맷팅
    const commentResults: CommentSearchResult[] = comments.comments.map((comment: any) => ({
      id: comment.id,
      commentId: comment.commentId,
      content: comment.content.length > 100 ? comment.content.substring(0, 100) + '...' : comment.content,
      postTitle: comment.post.title,
      status: comment.status,
      authorNickname: comment.author.nickname,
      likeCount: comments.likeCountMap.get(comment.id) || 0,
      createdAt: comment.createdAt,
    }));

    // 신고 결과 포맷팅
    const reportResults: ReportSearchResult[] = reports.reports.map((report: any) => ({
      id: report.id,
      reportId: report.reportId,
      reason: report.reason.length > 100 ? report.reason.substring(0, 100) + '...' : report.reason,
      reporterNickname: report.reporter.nickname,
      reportedUserNickname: report.reportedUser.nickname,
      targetType: report.targetType,
      status: report.status,
      createdAt: report.createdAt,
    }));

    return {
      success: true,
      data: {
        query,
        category,
        results: {
          members: memberResults,
          posts: postResults,
          comments: commentResults,
          reports: reportResults,
        },
        totalCount: {
          members: members.total,
          posts: posts.total,
          comments: comments.total,
          reports: reports.total,
        },
      },
    };
  }
}
