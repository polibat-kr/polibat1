import { z } from 'zod';

/**
 * 댓글 작성 검증 스키마
 */
export const createCommentSchema = z.object({
  body: z.object({
    content: z
      .string({ required_error: '댓글 내용을 입력해주세요.' })
      .min(1, '댓글 내용을 입력해주세요.')
      .max(1000, '댓글은 최대 1,000자까지 가능합니다.'),
  }),
});

/**
 * 댓글 수정 검증 스키마
 */
export const updateCommentSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(1, '댓글 내용을 입력해주세요.')
      .max(1000, '댓글은 최대 1,000자까지 가능합니다.')
      .optional(),
    status: z.enum(['PUBLISHED', 'HIDDEN', 'DELETED']).optional(),
  }),
});

/**
 * 댓글 목록 조회 검증 스키마
 */
export const getCommentsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    status: z.enum(['PUBLISHED', 'HIDDEN', 'DELETED']).optional(),
    authorId: z.string().uuid().optional(),
    sortBy: z.enum(['createdAt', 'likeCount']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});
