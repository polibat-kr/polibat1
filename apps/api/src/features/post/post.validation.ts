import { z } from 'zod';

/**
 * 게시글 작성 검증 스키마
 */
export const createPostSchema = z.object({
  body: z.object({
    boardType: z.enum(['FREE', 'POLITICIAN', 'VOTE'], {
      required_error: '게시판 타입을 선택해주세요.',
      invalid_type_error: '올바른 게시판 타입을 선택해주세요.',
    }),
    title: z
      .string({ required_error: '제목을 입력해주세요.' })
      .min(2, '제목은 최소 2자 이상이어야 합니다.')
      .max(200, '제목은 최대 200자까지 가능합니다.'),
    content: z
      .string({ required_error: '내용을 입력해주세요.' })
      .min(10, '내용은 최소 10자 이상이어야 합니다.')
      .max(10000, '내용은 최대 10,000자까지 가능합니다.'),
    images: z.array(z.string().url('올바른 이미지 URL이 아닙니다.')).optional(),
    attachments: z.array(z.string().url('올바른 첨부파일 URL이 아닙니다.')).optional(),
  }),
});

/**
 * 게시글 수정 검증 스키마
 */
export const updatePostSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(2, '제목은 최소 2자 이상이어야 합니다.')
      .max(200, '제목은 최대 200자까지 가능합니다.')
      .optional(),
    content: z
      .string()
      .min(10, '내용은 최소 10자 이상이어야 합니다.')
      .max(10000, '내용은 최대 10,000자까지 가능합니다.')
      .optional(),
    images: z.array(z.string().url('올바른 이미지 URL이 아닙니다.')).optional(),
    attachments: z.array(z.string().url('올바른 첨부파일 URL이 아닙니다.')).optional(),
    status: z.enum(['PUBLISHED', 'PINNED', 'HIDDEN', 'DELETED']).optional(),
  }),
});

/**
 * 게시글 목록 조회 검증 스키마
 */
export const getPostsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    boardType: z.enum(['FREE', 'POLITICIAN', 'VOTE']).optional(),
    status: z.enum(['PUBLISHED', 'PINNED', 'HIDDEN', 'DELETED']).optional(),
    authorId: z.string().uuid().optional(),
    search: z.string().optional(),
    sortBy: z.enum(['createdAt', 'viewCount', 'likeCount', 'commentCount']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});
