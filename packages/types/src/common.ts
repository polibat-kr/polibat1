/**
 * 공통 타입 정의
 */

export enum LikeType {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}

export enum ReportStatus {
  PENDING = '접수대기',
  REVIEWING = '검토중',
  RESOLVED = '처리완료',
  REJECTED = '처리불가',
  DEFERRED = '추후검토',
}

export enum SuggestionType {
  FEATURE = '기능제안',
  COMPLAINT = '불편사항',
  VOTE = '투표제안',
}

export enum SuggestionStatus {
  PENDING = '접수대기',
  REVIEWING = '검토중',
  RESOLVED = '처리완료',
  REJECTED = '처리불가',
  DEFERRED = '추후검토',
}

export enum NoticeCategory {
  GUIDE = '이용안내',
  UPDATE = '업데이트',
  COMMUNICATION = '소통소식',
  EXTERNAL = '외부활동',
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: PaginationMeta;
}

export interface DateRangeFilter {
  startDate?: Date;
  endDate?: Date;
}
