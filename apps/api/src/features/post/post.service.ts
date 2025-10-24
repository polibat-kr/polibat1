import { Post } from '@prisma/client';
import { PostRepository } from './post.repository';
import {
  GetPostsQueryDto,
  CreatePostRequestDto,
  UpdatePostRequestDto,
  PostResponseDto,
  GetPostsResponseDto,
} from './post.dto';
import { ApiError } from '../../shared/middleware/error-handler';
import { ERROR_CODES } from '../../shared/utils/error-codes';

/**
 * Post Service
 * 게시글 비즈니스 로직
 */
export class PostService {
  /**
   * 게시글 목록 조회
   */
  static async getPosts(query: GetPostsQueryDto): Promise<GetPostsResponseDto> {
    const { posts, total } = await PostRepository.findPosts(query);

    const page = query.page || 1;
    const limit = query.limit || 20;

    return {
      posts: posts.map((post) => this.formatPostResponse(post)),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 게시글 상세 조회
   */
  static async getPostById(postId: string, incrementView = true): Promise<PostResponseDto> {
    const post = await PostRepository.findById(postId);

    if (!post) {
      throw new ApiError(404, '게시글을 찾을 수 없습니다.', ERROR_CODES.POST_NOT_FOUND);
    }

    // 조회수 증가 (옵션)
    if (incrementView) {
      await PostRepository.incrementViewCount(postId);
    }

    return this.formatPostResponse(post);
  }

  /**
   * 게시글 작성
   */
  static async createPost(authorId: string, data: CreatePostRequestDto): Promise<PostResponseDto> {
    // 제목/내용 검증
    if (!data.title || data.title.trim().length === 0) {
      throw new ApiError(400, '제목을 입력해주세요.', ERROR_CODES.VALIDATION_ERROR);
    }

    if (!data.content || data.content.trim().length === 0) {
      throw new ApiError(400, '내용을 입력해주세요.', ERROR_CODES.VALIDATION_ERROR);
    }

    const post = await PostRepository.create(authorId, data);
    return this.formatPostResponse(post);
  }

  /**
   * 게시글 수정
   */
  static async updatePost(
    postId: string,
    userId: string,
    data: UpdatePostRequestDto
  ): Promise<PostResponseDto> {
    const post = await PostRepository.findById(postId);

    if (!post) {
      throw new ApiError(404, '게시글을 찾을 수 없습니다.', ERROR_CODES.POST_NOT_FOUND);
    }

    // 작성자 본인만 수정 가능
    if (post.authorId !== userId) {
      throw new ApiError(403, '게시글 수정 권한이 없습니다.', ERROR_CODES.FORBIDDEN);
    }

    const updatedPost = await PostRepository.update(postId, data);
    return this.formatPostResponse(updatedPost);
  }

  /**
   * 게시글 삭제
   */
  static async deletePost(postId: string, userId: string, isAdmin = false): Promise<void> {
    const post = await PostRepository.findById(postId);

    if (!post) {
      throw new ApiError(404, '게시글을 찾을 수 없습니다.', ERROR_CODES.POST_NOT_FOUND);
    }

    // 작성자 본인 또는 관리자만 삭제 가능
    if (!isAdmin && post.authorId !== userId) {
      throw new ApiError(403, '게시글 삭제 권한이 없습니다.', ERROR_CODES.FORBIDDEN);
    }

    await PostRepository.delete(postId);
  }

  /**
   * 게시글 응답 포맷팅
   */
  private static formatPostResponse(post: any): PostResponseDto {
    return {
      postId: post.postId,
      boardType: post.boardType,
      status: post.status,
      author: {
        userId: post.author.id,
        memberId: post.author.memberId,
        nickname: post.author.nickname,
        memberType: post.author.memberType,
      },
      title: post.title,
      content: post.content,
      images: post.images,
      attachments: post.attachments,
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      dislikeCount: post.dislikeCount,
      commentCount: post.commentCount,
      reportCount: post.reportCount,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  }
}
