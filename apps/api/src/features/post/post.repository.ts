import { PrismaClient, Post, Prisma } from '@prisma/client';
import { GetPostsQueryDto, CreatePostRequestDto, UpdatePostRequestDto } from './post.dto';

const prisma = new PrismaClient();

/**
 * Post Repository
 * 게시글 데이터베이스 작업
 */
export class PostRepository {
  /**
   * 게시글 목록 조회 (필터링, 페이지네이션, 검색)
   */
  static async findPosts(query: GetPostsQueryDto): Promise<{ posts: Post[]; total: number }> {
    const {
      page = 1,
      limit = 20,
      boardType,
      status,
      authorId,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.PostWhereInput = {};

    if (boardType) {
      where.boardType = boardType;
    }

    if (status) {
      where.status = status;
    } else {
      // 기본적으로 삭제되지 않은 게시글만 조회
      where.status = { not: 'DELETED' };
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Build orderBy clause
    const orderBy: Prisma.PostOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    // Execute queries in parallel
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              memberId: true,
              nickname: true,
              memberType: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return { posts, total };
  }

  /**
   * 게시글 상세 조회 (ID 기준)
   */
  static async findById(postId: string): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { postId },
      include: {
        author: {
          select: {
            id: true,
            memberId: true,
            nickname: true,
            memberType: true,
          },
        },
      },
    });
  }

  /**
   * 게시글 생성
   */
  static async create(authorId: string, data: CreatePostRequestDto): Promise<Post> {
    // postId 자동 생성 (boardType 기반)
    const prefix = data.boardType === 'FREE' ? 'FB' : data.boardType === 'POLITICIAN' ? 'PB' : 'VP';
    const postId = await this.generatePostId(prefix);

    return prisma.post.create({
      data: {
        postId,
        boardType: data.boardType,
        authorId,
        title: data.title,
        content: data.content,
        images: data.images || [],
        attachments: data.attachments || [],
      },
      include: {
        author: {
          select: {
            id: true,
            memberId: true,
            nickname: true,
            memberType: true,
          },
        },
      },
    });
  }

  /**
   * 게시글 수정
   */
  static async update(postId: string, data: UpdatePostRequestDto): Promise<Post> {
    return prisma.post.update({
      where: { postId },
      data,
      include: {
        author: {
          select: {
            id: true,
            memberId: true,
            nickname: true,
            memberType: true,
          },
        },
      },
    });
  }

  /**
   * 게시글 삭제 (Soft Delete)
   */
  static async delete(postId: string): Promise<Post> {
    return prisma.post.update({
      where: { postId },
      data: {
        status: 'DELETED',
        deletedAt: new Date(),
      },
    });
  }

  /**
   * 조회수 증가
   */
  static async incrementViewCount(postId: string): Promise<void> {
    await prisma.post.update({
      where: { postId },
      data: {
        viewCount: { increment: 1 },
      },
    });
  }

  /**
   * postId 자동 생성 (예: FB000001, PB000001, VP000001)
   */
  private static async generatePostId(prefix: string): Promise<string> {
    const lastPost = await prisma.post.findFirst({
      where: {
        postId: {
          startsWith: prefix,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!lastPost) {
      return `${prefix}000001`;
    }

    const lastNumber = parseInt(lastPost.postId.substring(2));
    const nextNumber = lastNumber + 1;
    return `${prefix}${nextNumber.toString().padStart(6, '0')}`;
  }
}
