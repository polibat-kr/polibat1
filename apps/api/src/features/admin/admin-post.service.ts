/**
 * Admin Post Management Service
 *
 * @description
 * - 게시글 관리 비즈니스 로직
 * - 목록 조회, 상세 조회, 상태 변경, 삭제
 */

import { PrismaClient } from '@prisma/client';
import { AdminPostRepository } from './admin-post.repository';
import type {
  GetPostsQueryDto,
  GetPostsResponseDto,
  PostDetailResponseDto,
  UpdatePostStatusRequestDto,
  UpdatePostStatusResponseDto,
  DeletePostResponseDto,
} from './admin-post.dto';

export class AdminPostService {
  private repository: AdminPostRepository;

  constructor(prisma: PrismaClient) {
    this.repository = new AdminPostRepository(prisma);
  }

  /**
   * 게시글 목록 조회 (페이지네이션, 필터링, 정렬)
   */
  async getPosts(query: GetPostsQueryDto): Promise<GetPostsResponseDto> {
    const { posts, total } = await this.repository.getPosts(query);

    const page = query.page || 1;
    const limit = query.limit || 20;
    const totalPages = Math.ceil(total / limit);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * 게시글 상세 조회
   */
  async getPostById(postId: string): Promise<PostDetailResponseDto> {
    const post = await this.repository.getPostById(postId);

    if (!post) {
      throw new Error('Post not found');
    }

    return post;
  }

  /**
   * 게시글 상태 변경
   */
  async updatePostStatus(
    postId: string,
    statusData: UpdatePostStatusRequestDto,
    adminId: string
  ): Promise<UpdatePostStatusResponseDto> {
    const { previousStatus, currentStatus } =
      await this.repository.updatePostStatus(postId, statusData, adminId);

    return {
      id: postId,
      postId: postId,
      previousStatus,
      currentStatus,
      reason: statusData.reason || null,
      changedBy: adminId,
      changedAt: new Date(),
    };
  }

  /**
   * 게시글 삭제 (Soft Delete)
   */
  async deletePost(
    postId: string,
    adminId: string
  ): Promise<DeletePostResponseDto> {
    const { deletedAt } = await this.repository.deletePost(postId, adminId);

    return {
      id: postId,
      postId: postId,
      deletedBy: adminId,
      deletedAt,
    };
  }
}
