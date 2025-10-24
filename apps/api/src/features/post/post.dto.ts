import { BoardType, PostStatus } from '@prisma/client';

/**
 * 게시글 목록 조회 Query DTO
 */
export interface GetPostsQueryDto {
  page?: number;
  limit?: number;
  boardType?: BoardType; // FREE, POLITICIAN, VOTE
  status?: PostStatus; // PUBLISHED, PINNED, HIDDEN, DELETED
  authorId?: string;
  search?: string; // 제목, 내용 검색
  sortBy?: 'createdAt' | 'viewCount' | 'likeCount' | 'commentCount';
  sortOrder?: 'asc' | 'desc';
}

/**
 * 게시글 작성 Request DTO
 */
export interface CreatePostRequestDto {
  boardType: BoardType;
  title: string;
  content: string;
  images?: string[]; // 이미지 URL 배열
  attachments?: string[]; // 첨부파일 URL 배열
}

/**
 * 게시글 수정 Request DTO
 */
export interface UpdatePostRequestDto {
  title?: string;
  content?: string;
  images?: string[];
  attachments?: string[];
  status?: PostStatus;
}

/**
 * 게시글 응답 DTO
 */
export interface PostResponseDto {
  postId: string;
  boardType: BoardType;
  status: PostStatus;
  author: {
    userId: string;
    memberId: string;
    nickname: string;
    memberType: string;
  };
  title: string;
  content: string;
  images: string[];
  attachments: string[];
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  reportCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 게시글 목록 응답 DTO
 */
export interface GetPostsResponseDto {
  posts: PostResponseDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
