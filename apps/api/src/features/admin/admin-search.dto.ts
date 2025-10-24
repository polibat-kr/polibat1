/**
 * Admin Search DTO
 *
 * 통합 검색 관련 요청/응답 타입 정의
 */

// ============================================
// 통합 검색 (GET /api/admin/search)
// ============================================

export type SearchCategory = 'all' | 'members' | 'posts' | 'comments' | 'reports';

export interface AdminSearchQueryDto {
  query: string; // 검색어 (필수)
  category?: SearchCategory; // 검색 카테고리 (기본: 'all')
  limit?: number; // 카테고리당 최대 결과 수 (기본: 5)
}

// 회원 검색 결과
export interface MemberSearchResult {
  id: string;
  memberId: string;
  nickname: string;
  email: string;
  memberType: string;
  status: string;
  createdAt: Date;
}

// 게시글 검색 결과
export interface PostSearchResult {
  id: string;
  postId: string;
  title: string;
  boardType: string;
  status: string;
  authorNickname: string;
  viewCount: number;
  likeCount: number;
  createdAt: Date;
}

// 댓글 검색 결과
export interface CommentSearchResult {
  id: string;
  commentId: string;
  content: string;
  postTitle: string;
  status: string;
  authorNickname: string;
  likeCount: number;
  createdAt: Date;
}

// 신고 검색 결과
export interface ReportSearchResult {
  id: string;
  reportId: string;
  reason: string;
  reporterNickname: string;
  reportedUserNickname: string;
  targetType: string;
  status: string;
  createdAt: Date;
}

export interface AdminSearchResponseDto {
  success: boolean;
  data: {
    query: string;
    category: SearchCategory;
    results: {
      members: MemberSearchResult[];
      posts: PostSearchResult[];
      comments: CommentSearchResult[];
      reports: ReportSearchResult[];
    };
    totalCount: {
      members: number;
      posts: number;
      comments: number;
      reports: number;
    };
  };
}
