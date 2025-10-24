/**
 * Admin Search Repository
 *
 * 통합 검색 데이터베이스 접근 레이어
 */

import { PrismaClient } from '@prisma/client';
import { SearchCategory } from './admin-search.dto';

const prisma = new PrismaClient();

export class AdminSearchRepository {
  /**
   * 회원 검색
   */
  async searchMembers(query: string, limit: number) {
    const members = await prisma.member.findMany({
      where: {
        OR: [
          { nickname: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { memberId: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        memberId: true,
        nickname: true,
        email: true,
        memberType: true,
        status: true,
        createdAt: true,
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await prisma.member.count({
      where: {
        OR: [
          { nickname: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { memberId: { contains: query, mode: 'insensitive' } },
        ],
      },
    });

    return { members, total };
  }

  /**
   * 게시글 검색
   */
  async searchPosts(query: string, limit: number) {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { postId: { contains: query, mode: 'insensitive' } },
          { author: { nickname: { contains: query, mode: 'insensitive' } } },
        ],
      },
      select: {
        id: true,
        postId: true,
        title: true,
        boardType: true,
        status: true,
        viewCount: true,
        createdAt: true,
        author: {
          select: {
            nickname: true,
          },
        },
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await prisma.post.count({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { postId: { contains: query, mode: 'insensitive' } },
          { author: { nickname: { contains: query, mode: 'insensitive' } } },
        ],
      },
    });

    // 좋아요 수 집계
    const postIds = posts.map((post) => post.id);
    const likeCountsRaw = await prisma.reaction.groupBy({
      by: ['postId'],
      where: {
        postId: { in: postIds },
        targetType: 'POST',
        reactionType: 'LIKE',
      },
      _count: {
        id: true,
      },
    });

    const likeCountMap = new Map(likeCountsRaw.map((item) => [item.postId!, item._count.id]));

    return { posts, total, likeCountMap };
  }

  /**
   * 댓글 검색
   */
  async searchComments(query: string, limit: number) {
    const comments = await prisma.comment.findMany({
      where: {
        OR: [
          { content: { contains: query, mode: 'insensitive' } },
          { commentId: { contains: query, mode: 'insensitive' } },
          { author: { nickname: { contains: query, mode: 'insensitive' } } },
        ],
      },
      select: {
        id: true,
        commentId: true,
        content: true,
        status: true,
        createdAt: true,
        author: {
          select: {
            nickname: true,
          },
        },
        post: {
          select: {
            title: true,
          },
        },
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await prisma.comment.count({
      where: {
        OR: [
          { content: { contains: query, mode: 'insensitive' } },
          { commentId: { contains: query, mode: 'insensitive' } },
          { author: { nickname: { contains: query, mode: 'insensitive' } } },
        ],
      },
    });

    // 좋아요 수 집계
    const commentIds = comments.map((comment) => comment.id);
    const likeCountsRaw = await prisma.reaction.groupBy({
      by: ['commentId'],
      where: {
        commentId: { in: commentIds },
        targetType: 'COMMENT',
        reactionType: 'LIKE',
      },
      _count: {
        id: true,
      },
    });

    const likeCountMap = new Map(likeCountsRaw.map((item) => [item.commentId!, item._count.id]));

    return { comments, total, likeCountMap };
  }

  /**
   * 신고 검색
   */
  async searchReports(query: string, limit: number) {
    const reports = await prisma.report.findMany({
      where: {
        OR: [
          { reason: { contains: query, mode: 'insensitive' } },
          { reportId: { contains: query, mode: 'insensitive' } },
          { reporter: { nickname: { contains: query, mode: 'insensitive' } } },
          { reportedUser: { nickname: { contains: query, mode: 'insensitive' } } },
        ],
      },
      select: {
        id: true,
        reportId: true,
        reason: true,
        targetType: true,
        status: true,
        createdAt: true,
        reporter: {
          select: {
            nickname: true,
          },
        },
        reportedUser: {
          select: {
            nickname: true,
          },
        },
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await prisma.report.count({
      where: {
        OR: [
          { reason: { contains: query, mode: 'insensitive' } },
          { reportId: { contains: query, mode: 'insensitive' } },
          { reporter: { nickname: { contains: query, mode: 'insensitive' } } },
          { reportedUser: { nickname: { contains: query, mode: 'insensitive' } } },
        ],
      },
    });

    return { reports, total };
  }

  /**
   * 통합 검색 (병렬 실행)
   */
  async searchAll(query: string, category: SearchCategory, limit: number) {
    const searches = {
      members: category === 'all' || category === 'members' ? this.searchMembers(query, limit) : null,
      posts: category === 'all' || category === 'posts' ? this.searchPosts(query, limit) : null,
      comments: category === 'all' || category === 'comments' ? this.searchComments(query, limit) : null,
      reports: category === 'all' || category === 'reports' ? this.searchReports(query, limit) : null,
    };

    const results = await Promise.all([
      searches.members,
      searches.posts,
      searches.comments,
      searches.reports,
    ]);

    return {
      members: results[0] || { members: [], total: 0 },
      posts: results[1] || { posts: [], total: 0, likeCountMap: new Map() },
      comments: results[2] || { comments: [], total: 0, likeCountMap: new Map() },
      reports: results[3] || { reports: [], total: 0 },
    };
  }
}
