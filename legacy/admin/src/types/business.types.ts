/**
 * 정치방망이(PoliBAT) 비즈니스 타입 정의
 */

// 회원 관련 타입
export type MemberStatus = '승인' | '승인대기' | '탈퇴' | '정지' | '강퇴';
export type MemberType = '일반회원' | '정치인' | '보좌진' | '운영자';
export type PoliticianType = '국회의원' | '지자체' | '대통령실';

// 게시글/댓글 관련 타입
export type PostStatus = '게시' | '게시(고정)' | '숨김' | '삭제';
export type CommentStatus = '게시' | '숨김' | '삭제';

// 투표 관련 타입
export type VoteStatus = '진행' | '마감' | '예정';

// 조치/처리 관련 타입
export type ActionStatus = '접수대기' | '검토중' | '처리완료' | '처리불가' | '추후검토';
export type ProcessType = '숨김' | '삭제' | '재게시';

// 공지사항 관련 타입
export type NoticeCategory = '이용안내' | '업데이트' | '소통소식' | '외부활동';

// 불편/제안 관련 타입
export type ReportType = '기능제안' | '불편사항' | '투표제안';

// 서비스 정책 대상
export type PolicyTarget = '전체' | '회원전체' | '일반회원' | '정치인회원';

// ID 체계 인터페이스
export interface IdPrefix {
  // 회원
  normalMember: 'NM';      // 일반회원
  politicianMember: 'PM';  // 정치인
  politicianAssist: 'PA';  // 보좌진
  
  // 게시판
  freeBoard: 'FB';         // 자유게시판
  polibatBoard: 'PB';      // 정치방망이
  comment: 'CM';           // 댓글
  
  // 기타
  vote: 'VP';              // 투표
  complaint: 'RC';         // 불편사항
  suggestion: 'RS';        // 제안사항
  report: 'RP';            // 신고
  notice: 'NT';            // 공지사항
  popup: 'PU';             // 팝업
  banner: 'BN';            // 배너
  templatePolicy: 'TP';    // 정책 템플릿
  versionNumber: 'VN';     // 정책 버전
}

// ID 생성 헬퍼 함수
export function generateId(prefix: string, number: number, digits: number = 6): string {
  return `${prefix}${number.toString().padStart(digits, '0')}`;
}

// 하위 ID 생성 헬퍼 함수 (댓글 등)
export function generateSubId(parentId: string, prefix: string, number: number, digits: number = 4): string {
  return `${parentId}-${prefix}${number.toString().padStart(digits, '0')}`;
} 