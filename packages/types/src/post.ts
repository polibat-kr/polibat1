/**
 * 게시글 관련 타입 정의
 */

export enum BoardType {
  FREE = 'FREE',
  POLIBAT = 'POLIBAT',
}

export enum PostStatus {
  PUBLISHED = '게시',
  PUBLISHED_PINNED = '게시(고정)',
  HIDDEN = '숨김',
  DELETED = '삭제',
}

export interface Post {
  id: string;
  postId: string; // FB000001, PB000001
  boardType: BoardType;
  title: string;
  content: string;
  aiSummary?: string;
  status: PostStatus;
  views: number;
  isPinned: boolean;
  authorId: string;
  targetPoliticianId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostCreateInput {
  boardType: BoardType;
  title: string;
  content: string;
  targetPoliticianId?: string;
  images?: string[];
}

export interface PostUpdateInput {
  title?: string;
  content?: string;
  status?: PostStatus;
  isPinned?: boolean;
}

export interface PostListFilters {
  boardType?: BoardType;
  status?: PostStatus;
  search?: string;
  authorId?: string;
  targetPoliticianId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
  sortBy?: 'latest' | 'popular' | 'views';
}
