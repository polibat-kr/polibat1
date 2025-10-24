/**
 * Reaction Validation Schemas
 * Zod를 사용한 반응 API 요청 검증
 */

import { z } from 'zod';
import { ReactionType, ReactionTargetType } from '@prisma/client';

/**
 * 반응 추가/변경 요청 검증
 */
export const createReactionSchema = z.object({
  body: z.object({
    targetType: z.nativeEnum(ReactionTargetType, {
      errorMap: () => ({ message: 'targetType은 POST 또는 COMMENT여야 합니다.' }),
    }),
    targetId: z
      .string()
      .min(1, 'targetId는 필수입니다.')
      .regex(/^[A-Z]{2}\d{6}(-CM\d{4})?$/, 'targetId 형식이 올바르지 않습니다.'),
    reactionType: z.nativeEnum(ReactionType, {
      errorMap: () => ({ message: 'reactionType은 LIKE 또는 DISLIKE여야 합니다.' }),
    }),
  }),
});

/**
 * 반응 목록 조회 쿼리 검증
 */
export const getReactionsSchema = z.object({
  query: z.object({
    reactionType: z.nativeEnum(ReactionType).optional(),
    page: z
      .string()
      .regex(/^\d+$/, 'page는 양의 정수여야 합니다.')
      .optional(),
    limit: z
      .string()
      .regex(/^\d+$/, 'limit는 양의 정수여야 합니다.')
      .optional(),
  }),
});

/**
 * 반응 통계 조회 파라미터 검증
 */
export const getReactionStatsSchema = z.object({
  params: z.object({
    targetType: z.nativeEnum(ReactionTargetType),
    targetId: z.string().regex(/^[A-Z]{2}\d{6}(-CM\d{4})?$/),
  }),
});

/**
 * 반응 삭제 파라미터 검증
 */
export const deleteReactionSchema = z.object({
  params: z.object({
    reactionId: z.string().uuid('reactionId는 유효한 UUID여야 합니다.'),
  }),
});
