/**
 * 상태값 상수 정의
 * 정치방망이(POLIBAT) 개발참고서.md 기준
 */

/**
 * 회원 상태
 */
export const MEMBER_STATUS = {
  APPROVED: '승인',
  PENDING_APPROVAL: '승인대기',
  WITHDRAWN: '탈퇴',
  SUSPENDED: '정지',
  BANNED: '강퇴',
} as const;

/**
 * 회원 구분
 */
export const MEMBER_TYPE = {
  NORMAL: '일반회원',
  POLITICIAN: '정치인',
  ASSISTANT: '보좌진',
  ADMIN: '운영자',
} as const;

/**
 * 정치인 구분
 */
export const POLITICIAN_TYPE = {
  NATIONAL_ASSEMBLY: '국회의원',
  LOCAL_GOVERNMENT: '지방자치단체',
  PRESIDENTIAL_OFFICE: '대통령실',
} as const;

/**
 * 게시글/댓글 상태
 */
export const POST_STATUS = {
  PUBLISHED: '게시',
  PUBLISHED_PINNED: '게시(고정)',
  HIDDEN: '숨김',
  DELETED: '삭제',
} as const;

export const COMMENT_STATUS = {
  PUBLISHED: '게시',
  HIDDEN: '숨김',
  DELETED: '삭제',
} as const;

/**
 * 투표 상태
 */
export const VOTE_STATUS = {
  SCHEDULED: '예정',
  IN_PROGRESS: '진행',
  CLOSED: '마감',
} as const;

/**
 * 조치 상태 (신고, 불편/제안)
 */
export const ACTION_STATUS = {
  PENDING: '접수대기',
  REVIEWING: '검토중',
  RESOLVED: '처리완료',
  REJECTED: '처리불가',
  DEFERRED: '추후검토',
} as const;

/**
 * 공지사항 말머리
 */
export const NOTICE_CATEGORY = {
  GUIDE: '이용안내',
  UPDATE: '업데이트',
  COMMUNICATION: '소통소식',
  EXTERNAL: '외부활동',
} as const;

/**
 * 불편/제안 구분
 */
export const SUGGESTION_TYPE = {
  FEATURE: '기능제안',
  COMPLAINT: '불편사항',
  VOTE: '투표제안',
} as const;

/**
 * 서비스정책 적용대상
 */
export const POLICY_TARGET = {
  ALL: '전체',
  ALL_MEMBERS: '회원전체',
  NORMAL_MEMBERS: '일반회원',
  POLITICIAN_MEMBERS: '정치인회원',
} as const;
