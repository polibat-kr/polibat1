/**
 * ID Prefix 상수 정의
 * 정치방망이(POLIBAT) 개발참고서.md 기준
 */

export const ID_PREFIXES = {
  // 회원
  NORMAL_MEMBER: 'NM',
  POLITICIAN_MEMBER: 'PM',
  ASSISTANT_MEMBER: 'PA',

  // 게시판
  FREE_BOARD: 'FB',
  POLIBAT_BOARD: 'PB',

  // 댓글
  COMMENT: 'CM',

  // 투표
  VOTE: 'VP',

  // 불편/제안
  COMPLAINT: 'RC',
  SUGGESTION: 'RS',

  // 신고
  REPORT: 'RP',

  // 공지/팝업/배너
  NOTICE: 'NT',
  POPUP: 'PU',
  BANNER: 'BN',

  // 정책 템플릿
  TEMPLATE_POLICY: 'TP',
  VERSION_NUMBER: 'VN',
} as const;

export type IdPrefix = (typeof ID_PREFIXES)[keyof typeof ID_PREFIXES];

/**
 * ID 자리수 정의
 */
export const ID_DIGITS = {
  [ID_PREFIXES.NORMAL_MEMBER]: 6,
  [ID_PREFIXES.POLITICIAN_MEMBER]: 6,
  [ID_PREFIXES.ASSISTANT_MEMBER]: 6,
  [ID_PREFIXES.FREE_BOARD]: 6,
  [ID_PREFIXES.POLIBAT_BOARD]: 6,
  [ID_PREFIXES.COMMENT]: 4,
  [ID_PREFIXES.VOTE]: 6,
  [ID_PREFIXES.COMPLAINT]: 6,
  [ID_PREFIXES.SUGGESTION]: 6,
  [ID_PREFIXES.REPORT]: 4,
  [ID_PREFIXES.NOTICE]: 6,
  [ID_PREFIXES.POPUP]: 6,
  [ID_PREFIXES.BANNER]: 6,
  [ID_PREFIXES.TEMPLATE_POLICY]: 4,
  [ID_PREFIXES.VERSION_NUMBER]: 4,
} as const;
