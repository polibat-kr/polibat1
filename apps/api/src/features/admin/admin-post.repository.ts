/**
 * Admin Post Management Repository
 *
 * @description
 * - 게시글 관리 DB 접근 레이어
 * - Prisma 쿼리 실행
 */

import { PrismaClient, Prisma, PostStatus } from '@prisma/client';
import type {
  GetPostsQueryDto,
  PostListItemDto,
  PostDetailResponseDto,
  UpdatePostStatusRequestDto,
} from './admin-post.dto';

export class AdminPostRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * 게시글 목록 조회 (페이지네이션, 필터링, 정렬)
   */
  async getPosts(query: GetPostsQueryDto): Promise<{
    posts: PostListItemDto[];
    total: number;
  }> {
    const {
      page = 1,
      limit = 20,
      search,
      boardType,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      startDate,
      endDate,
      authorId,
    } = query;

    const skip = (page - 1) * limit;
    const take = limit;

    // WHERE 조건 구성
    const where: Prisma.PostWhereInput = {};

    // 검색 조건 (제목, 내용, 작성자 닉네임)
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { author: { nickname: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // 게시판 필터
    if (boardType) {
      where.boardType = boardType;
    }

    // 상태 필터
    if (status) {
      where.status = status;
    }

    // 작성자 필터
    if (authorId) {
      where.authorId = authorId;
    }

    // 날짜 필터
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        const dateStart = new Date(startDate);
        dateStart.setHours(0, 0, 0, 0);
        where.createdAt.gte = dateStart;
      }
      if (endDate) {
        const dateEnd = new Date(endDate);
        dateEnd.setHours(23, 59, 59, 999);
        where.createdAt.lte = dateEnd;
      }
    }

    // 정렬 조건
    const orderBy: Prisma.PostOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    // 병렬 조회 (데이터 + 총 개수)
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          author: {
            select: {
              nickname: true,
              memberType: true,
            },
          },
          _count: {
            select: {
              comments: true,
              reactions: true,
              reports: true,
            },
          },
          voteInfo: {
            select: {
              id: true,
            },
          },
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    // 좋아요/싫어요 수 별도 집계
    const postIds = posts.map((p) => p.id);
    const likesDislikes = await this.prisma.reaction.groupBy({
      by: ['postId', 'reactionType'],
      where: {
        postId: { in: postIds },
        commentId: null,
      },
      _count: {
        id: true,
      },
    });

    // Map으로 변환 (postId -> { likeCount, dislikeCount })
    const reactionMap = new Map<
      string,
      { likeCount: number; dislikeCount: number }
    >();
    postIds.forEach((id) => {
      reactionMap.set(id, { likeCount: 0, dislikeCount: 0 });
    });

    likesDislikes.forEach((item) => {
      const current = reactionMap.get(item.postId!);
      if (current) {
        if (item.reactionType === 'LIKE') {
          current.likeCount = item._count.id;
        } else if (item.reactionType === 'DISLIKE') {
          current.dislikeCount = item._count.id;
        }
      }
    });

    // DTO 변환
    const postList: PostListItemDto[] = posts.map((post) => {
      const reactions = reactionMap.get(post.id) || {
        likeCount: 0,
        dislikeCount: 0,
      };

      return {
        id: post.id,
        postId: post.postId,
        boardType: post.boardType,
        status: post.status,
        title: post.title,
        content: post.content.substring(0, 100), // 100자만 반환
        authorId: post.authorId,
        authorNickname: post.author.nickname,
        authorMemberType: post.author.memberType,
        viewCount: post.viewCount,
        likeCount: reactions.likeCount,
        dislikeCount: reactions.dislikeCount,
        commentCount: post._count.comments,
        reportCount: post._count.reports,
        hasVote: !!post.voteInfo,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        deletedAt: post.deletedAt,
      };
    });

    return { posts: postList, total };
  }

  /**
   * 게시글 상세 조회
   */
  async getPostById(postId: string): Promise<PostDetailResponseDto | null> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            nickname: true,
            memberType: true,
            email: true,
          },
        },
        voteInfo: {
          include: {
            options: {
              include: {
                _count: {
                  select: {
                    participations: true,
                  },
                },
              },
            },
            _count: {
              select: {
                participations: true,
              },
            },
          },
        },
        comments: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: {
                nickname: true,
              },
            },
          },
        },
        reports: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            reporter: {
              select: {
                nickname: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
            reports: true,
          },
        },
      },
    });

    if (!post) {
      return null;
    }

    // 좋아요/싫어요 수 집계
    const reactions = await this.prisma.reaction.groupBy({
      by: ['reactionType'],
      where: {
        postId: post.id,
        commentId: null,
      },
      _count: {
        id: true,
      },
    });

    const likeCount =
      reactions.find((r) => r.reactionType === 'LIKE')?._count.id || 0;
    const dislikeCount =
      reactions.find((r) => r.reactionType === 'DISLIKE')?._count.id || 0;

    // 투표 정보 (있을 경우)
    const vote = post.voteInfo
      ? {
          id: post.voteInfo.id,
          voteId: post.voteInfo.id, // Vote 모델에 voteId 필드가 없으므로 id 사용
          title: post.title, // Post의 제목 사용
          status: post.voteInfo.status,
          totalVotes: post.voteInfo._count.participations,
          options: post.voteInfo.options.map((opt: any) => ({
            id: opt.id,
            optionText: opt.content, // VoteOption.content 사용
            voteCount: opt._count.participations,
          })),
        }
      : null;

    return {
      // 기본 정보
      id: post.id,
      postId: post.postId,
      boardType: post.boardType,
      status: post.status,
      title: post.title,
      content: post.content,

      // 작성자 정보
      authorId: post.authorId,
      authorNickname: post.author.nickname,
      authorMemberType: post.author.memberType,
      authorEmail: post.author.email,

      // 통계
      viewCount: post.viewCount,
      likeCount,
      dislikeCount,
      commentCount: post._count.comments,
      reportCount: post._count.reports,

      // 투표 정보
      vote,

      // 최근 댓글
      recentComments: post.comments.map((c) => ({
        id: c.id,
        commentId: c.commentId,
        content: c.content.substring(0, 100),
        authorNickname: c.author.nickname,
        createdAt: c.createdAt,
      })),

      // 신고 이력
      recentReports: post.reports.map((r) => ({
        id: r.id,
        reportId: r.reportId,
        reason: r.reason,
        reporterNickname: r.reporter.nickname,
        status: r.status,
        createdAt: r.createdAt,
      })),

      // 타임스탬프
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      deletedAt: post.deletedAt,
    };
  }

  /**
   * 게시글 상태 변경 (트랜잭션)
   */
  async updatePostStatus(
    postId: string,
    statusData: UpdatePostStatusRequestDto,
    _adminId: string
  ): Promise<{
    previousStatus: PostStatus;
    currentStatus: PostStatus;
  }> {
    // 현재 상태 조회
    const currentPost = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { status: true },
    });

    if (!currentPost) {
      throw new Error('Post not found');
    }

    const previousStatus = currentPost.status;
    const currentStatus = statusData.status;

    // 상태 변경 + 이력 저장 (트랜잭션)
    await this.prisma.$transaction([
      // 1. 게시글 상태 변경
      this.prisma.post.update({
        where: { id: postId },
        data: {
          status: currentStatus,
          deletedAt: currentStatus === 'DELETED' ? new Date() : null,
        },
      }),
      // 2. 상태 변경 이력 저장 (TODO: PostStatusHistory 테이블 필요 시 추가)
    ]);

    return { previousStatus, currentStatus };
  }

  /**
   * 게시글 삭제 (Soft Delete)
   */
  async deletePost(
    postId: string,
    _adminId: string
  ): Promise<{ deletedAt: Date }> {
    const deletedAt = new Date();

    await this.prisma.post.update({
      where: { id: postId },
      data: {
        status: 'DELETED' as const,
        deletedAt,
      },
    });

    return { deletedAt };
  }
}