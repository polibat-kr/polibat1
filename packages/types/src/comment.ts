/**
 * 댓글 관련 타입 정의
 */

export enum CommentStatus {
  PUBLISHED = '게시',
  HIDDEN = '숨김',
  DELETED = '삭제',
}

export interface Comment {
  id: string;
  commentId: string; // FB000001-CM0001
  content: string;
  status: CommentStatus;
  postId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentCreateInput {
  postId: string;
  content: string;
}

export interface CommentUpdateInput {
  content?: string;
  status?: CommentStatus;
}
