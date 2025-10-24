/**
 * Reaction DTO (Data Transfer Objects)
 * 반응(좋아요/싫어요) 요청/응답 타입 정의
 */

import { ReactionType, ReactionTargetType } from '@prisma/client';

/**
 * 반응 추가/변경 요청 DTO
 */
export interface CreateReactionDto {
  targetType: ReactionTargetType; // 'POST' | 'COMMENT'
  targetId: string; // postId 또는 commentId
  reactionType: ReactionType; // 'LIKE' | 'DISLIKE'
}

/**
 * 반응 응답 DTO
 */
export interface ReactionResponseDto {
  id: string;
  userId: string;
  targetType: ReactionTargetType;
  targetId: string; // postId 또는 commentId (UUID가 아닌 문자열)
  reactionType: ReactionType;
  createdAt: Date;
  user?: {
    memberId: string;
    nickname: string;
  };
}

/**
 * 반응 통계 응답 DTO
 */
export interface ReactionStatsDto {
  targetType: ReactionTargetType;
  targetId: string;
  likeCount: number;
  dislikeCount: number;
  totalCount: number;
  userReaction?: ReactionType | null; // 현재 사용자의 반응 (없으면 null)
}

/**
 * 반응 목록 쿼리 파라미터 DTO
 */
export interface GetReactionsQueryDto {
  reactionType?: ReactionType; // 특정 반응 유형만 조회
  page?: number;
  limit?: number;
}

/**
 * 반응 목록 응답 DTO
 */
export interface ReactionListResponseDto {
  reactions: ReactionResponseDto[];
  stats: ReactionStatsDto;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
