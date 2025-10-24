import { z } from 'zod';
import { VoteStatus } from '@prisma/client';

/**
 * 투표 생성 스키마
 */
export const createVoteSchema = z.object({
  body: z.object({
    postId: z.string().min(1, '게시글 ID는 필수입니다.'),
    startDate: z.string().datetime({ message: '유효한 ISO 8601 날짜 형식이어야 합니다.' }),
    endDate: z.string().datetime({ message: '유효한 ISO 8601 날짜 형식이어야 합니다.' }),
    allowMultiple: z.boolean(),
    options: z
      .array(
        z.object({
          content: z.string().min(1, '옵션 내용은 필수입니다.').max(200, '옵션 내용은 최대 200자입니다.'),
          displayOrder: z.number().int().min(0, '표시 순서는 0 이상이어야 합니다.'),
        })
      )
      .min(2, '투표 옵션은 최소 2개 이상이어야 합니다.')
      .max(10, '투표 옵션은 최대 10개까지 가능합니다.'),
  }),
});

/**
 * 투표 수정 스키마
 */
export const updateVoteSchema = z.object({
  params: z.object({
    voteId: z.string().uuid('유효한 UUID 형식이어야 합니다.'),
  }),
  body: z.object({
    startDate: z.string().datetime({ message: '유효한 ISO 8601 날짜 형식이어야 합니다.' }).optional(),
    endDate: z.string().datetime({ message: '유효한 ISO 8601 날짜 형식이어야 합니다.' }).optional(),
    status: z.nativeEnum(VoteStatus).optional(),
  }),
});

/**
 * 투표 참여 스키마
 */
export const participateVoteSchema = z.object({
  params: z.object({
    voteId: z.string().uuid('유효한 UUID 형식이어야 합니다.'),
  }),
  body: z.object({
    optionIds: z
      .array(z.string().uuid('유효한 UUID 형식이어야 합니다.'))
      .min(1, '최소 1개의 옵션을 선택해야 합니다.')
      .max(10, '최대 10개까지 선택할 수 있습니다.'),
  }),
});

/**
 * 투표 ID 파라미터 스키마
 */
export const voteIdParamSchema = z.object({
  params: z.object({
    voteId: z.string().uuid('유효한 UUID 형식이어야 합니다.'),
  }),
});

/**
 * 게시글 ID 파라미터 스키마
 */
export const postIdParamSchema = z.object({
  params: z.object({
    postId: z.string().min(1, '게시글 ID는 필수입니다.'),
  }),
});
