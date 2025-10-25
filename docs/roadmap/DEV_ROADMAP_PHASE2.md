# DEV_ROADMAP - Phase 2: Admin Dashboard 연동 & 핵심 기능

**기간**: Week 9-16 (1.5-2개월)
**목표**: Admin Dashboard 실시간 데이터 연동 및 관리자 시스템 완성
**작성일**: 2025-10-23
**버전**: 2.0 (상세 버전)
**상태**: ✅ 작성 완료

---

## 📋 Phase 2 개요

### 목표
- Admin Dashboard 16개 페이지를 샘플 데이터에서 **실제 API 연동**으로 전환
- 파일 업로드, 이메일 발송 등 **핵심 인프라** 구축
- AI MVP 기능으로 **차별화 요소** 확보
- 관리자 시스템을 **완전히 작동**하는 상태로 완성

### 산출물
- Admin Dashboard 16개 페이지 API 완전 연동
- 파일 업로드 API (S3) 3개 엔드포인트
- 이메일 발송 서비스 (SES)
- AI 서비스 2개 기능 (3줄 요약, 감정 온도계)
- 불편/제안 접수 시스템
- 공지사항/팝업/배너 관리

---

## Week 9-10: Admin Dashboard API 완전 연동

### 목표
Phase 1에서 구현한 Backend API를 Admin Dashboard와 **100% 연동**하여 실시간 데이터 표시

### 작업 상세

#### 1. 대시보드 페이지 (Dashboard)
**현재 상태**: 샘플 데이터 기반 차트 표시
**목표**: 실시간 통계 API 연동

**작업 항목**:
- [ ] 통계 API 엔드포인트 구현
  - GET /api/stats/members - 회원 통계 (일/주/월/년)
  - GET /api/stats/posts - 게시글 통계 (게시판별)
  - GET /api/stats/visitors - 방문자 통계 (일/주/월/년)
- [ ] Admin Dashboard API 호출 로직 수정
  - 샘플 데이터 → 실제 API 호출로 교체
  - React Query 활용 (캐싱, 로딩 상태)
- [ ] 차트 데이터 포맷 변환
  - Backend 응답 → Chart.js 포맷 변환
- [ ] 필터링 기능 연동
  - 기간별 필터 (일/주/월/년) API 파라미터 전달
  - 누적/변동 전환 로직 Backend 처리

**예상 시간**: 8-12시간

---

#### 2. 회원 관리 페이지 (4개)
**페이지 목록**:
- AllMembersPage (전체회원관리)
- PoliticiansPage (정치인관리)
- MemberStatusHistoryPage (회원상태 변경이력)
- LikesHistoryPage (좋아요/싫어요 이력)

**작업 항목**:
- [ ] 회원 목록 API 연동
  - 페이지네이션 (page, limit)
  - 검색 필터 (이름, 이메일, 상태, 유형)
  - 정렬 (가입일, 이름, 활동)
- [ ] 회원 상세 팝업 API 연동
  - 회원 정보 조회
  - 상태 변경 (승인, 정지, 강퇴)
  - 변경 이력 조회
- [ ] 정치인 승인 프로세스 API 연동
- [ ] 통계 카드 클릭 시 자동 필터 적용

**예상 시간**: 10-14시간

---

#### 3. 게시글/댓글 관리 페이지 (2개)
**페이지 목록**:
- PostsManagementPage (게시글 관리)
- CommentsManagementPage (댓글 관리)

**작업 항목**:
- [ ] 게시글 목록 API 연동
  - 게시판별 필터 (자유게시판, 정치방망이)
  - 상태별 필터 (게시, 숨김, 삭제)
  - 검색 (제목, 내용, 작성자)
- [ ] 게시글 상세 팝업 API 연동
  - 게시글 정보, 댓글, 통계
  - 상태 변경 (숨김, 삭제, 재게시)
- [ ] 댓글 목록 API 연동
  - 게시글별 필터
  - 상태 관리

**예상 시간**: 8-12시간

---

#### 4. 신고/투표 관리 페이지 (3개)
**페이지 목록**:
- ReportsHistoryPage (신고이력)
- VotesManagementPage (투표관리)
- VotesHistoryPage (투표 이력)

**작업 항목**:
- [ ] 신고 목록 API 연동 (Phase 1 Week 7 완료)
- [ ] 신고 처리 API 연동 (관리자 조치)
- [ ] 투표 목록 API 연동 (Phase 1 Week 8 예정)
- [ ] 투표 상세/결과 API 연동
- [ ] 투표 상태 제어 (진행, 마감)

**예상 시간**: 6-8시간

---

#### 5. 기타 관리 페이지 (6개)
**페이지 목록**:
- SuggestionsManagementPage (불편/제안 접수 관리)
- NoticesManagementPage (공지사항 관리)
- PopupsManagementPage (팝업 관리)
- BannersManagementPage (배너 관리)
- PolicyTemplatesPage (서비스정책 템플릿 관리)
- PolicyContentPage (서비스정책 관리)

**작업 항목**:
- [ ] 불편/제안 접수 API 연동 (Week 11-12 구현 예정)
- [ ] 공지사항 CRUD API 연동
- [ ] 팝업 CRUD API 연동
- [ ] 배너 CRUD API 연동
- [ ] 정책 템플릿 및 콘텐츠 API 연동

**예상 시간**: 10-14시간

---

### Week 9-10 마일스톤
**완료 기준**:
- ✅ Admin Dashboard 16개 페이지 모두 실제 API 연동
- ✅ 샘플 데이터 완전 제거
- ✅ 실시간 통계 및 필터링 작동
- ✅ 모든 CRUD 작업 정상 동작

**예상 총 시간**: 40-60시간 (5-7일)

---

## Week 11-12: 파일 업로드 & 이메일 발송

### 목표
파일 업로드 및 이메일 발송 인프라를 구축하여 **핵심 기능 지원**

---

### 1. 파일 업로드 시스템 (S3)

#### 인프라 구성
**AWS S3 버킷 구조**:
```
polibat-storage/
├── profiles/           # 회원 프로필 이미지
├── posts/             # 게시글 첨부 이미지
├── notices/           # 공지사항 첨부 파일
├── popups/            # 팝업 이미지
└── banners/           # 배너 이미지
```

**CloudFront CDN**:
- S3 앞단에 CloudFront 배치
- 이미지 캐싱 및 빠른 전송
- HTTPS 지원

---

#### API 엔드포인트 구현
**작업 항목**:
- [ ] POST /api/upload/image - 이미지 업로드
  - 파일 검증 (타입, 크기)
  - S3 업로드
  - 썸네일 자동 생성 (Sharp)
  - CloudFront URL 반환
- [ ] POST /api/upload/file - 일반 파일 업로드
  - PDF, DOCX 등 허용
  - 바이러스 스캔 (선택적)
- [ ] DELETE /api/upload/:fileId - 파일 삭제
  - S3 객체 삭제
  - DB 레코드 삭제

**예상 시간**: 10-14시간

---

#### 이미지 최적화
**작업 항목**:
- [ ] Sharp 라이브러리 연동
- [ ] 자동 리사이징 (원본, 대형, 중형, 썸네일)
- [ ] WebP 포맷 변환 (용량 절감)
- [ ] Lazy Loading 지원

**예상 시간**: 6-8시간

---

### 2. 이메일 발송 시스템 (SES)

#### 이메일 템플릿
**템플릿 종류**:
1. **회원 가입 환영** (Welcome Email)
2. **비밀번호 재설정** (Password Reset)
3. **정치인 지목 알림** (Politician Mention)
4. **댓글 알림** (Comment Notification)
5. **신고 처리 결과** (Report Status)
6. **불편/제안 답변** (Feedback Response)

---

#### API 엔드포인트 구현
**작업 항목**:
- [ ] 이메일 발송 서비스 구현
  - AWS SES 연동
  - 템플릿 엔진 (Handlebars/EJS)
  - 발송 큐 (Bull Queue + Redis)
- [ ] POST /api/email/send - 이메일 발송
- [ ] GET /api/email/status/:emailId - 발송 상태 조회
- [ ] 이메일 발송 실패 재시도 로직

**예상 시간**: 12-16시간

---

#### 이메일 템플릿 작성
**작업 항목**:
- [ ] HTML 템플릿 6종 작성
- [ ] 반응형 디자인 (모바일 대응)
- [ ] 브랜딩 (오구링 캐릭터 활용)
- [ ] 다국어 지원 준비 (한국어 우선)

**예상 시간**: 8-10시간

---

### Week 11-12 마일스톤
**완료 기준**:
- ✅ S3 파일 업로드 정상 작동
- ✅ 이미지 자동 최적화 및 썸네일 생성
- ✅ 이메일 발송 시스템 구축
- ✅ 6종 이메일 템플릿 작성 완료

**예상 총 시간**: 36-48시간 (4-6일)

---

## Week 13-14: AI MVP 기능 구현

### 목표
AI 기반 **차별화 기능**을 구축하여 서비스 경쟁력 확보

---

### 1. AI 3줄 요약 기능

#### 기능 설명
- 긴 게시글 및 댓글을 **3줄로 핵심 요약**
- 사용자 이해도 향상 및 콘텐츠 소비 효율화
- 관리자 대시보드에서 신고/게시글 빠른 검토 지원

---

#### AI 모델 선택
**옵션 비교**:
| 모델 | 비용 | 품질 | 속도 | 비고 |
|------|------|------|------|------|
| OpenAI GPT-4 | 높음 | 최고 | 보통 | 정확도 우수 |
| OpenAI GPT-3.5 | 보통 | 우수 | 빠름 | 가성비 |
| Claude 3.5 Sonnet | 보통 | 최고 | 빠름 | 한국어 우수 |
| Gemini Pro | 낮음 | 우수 | 빠름 | 무료 티어 |

**권장**: Claude 3.5 Sonnet (한국어 이해도 최고)

---

#### API 엔드포인트 구현
**작업 항목**:
- [ ] POST /api/ai/summarize - 3줄 요약 생성
  - 게시글 본문 입력
  - AI 모델 호출
  - 3줄 요약 반환
- [ ] GET /api/posts/:postId/summary - 게시글 요약 조회
  - 캐싱 (Redis, 1일 TTL)
  - 재생성 옵션
- [ ] Admin Dashboard 통합
  - 게시글 상세 팝업에 요약 표시
  - 신고 검토 시 빠른 파악

**예상 시간**: 12-16시간

---

#### 프롬프트 엔지니어링
**프롬프트 템플릿**:
```
당신은 정치 관련 게시글을 요약하는 전문가입니다.
다음 게시글을 정확히 3줄로 요약해주세요.

요구사항:
1. 핵심 내용만 포함
2. 객관적인 톤 유지
3. 각 문장은 50자 이하

게시글:
{content}

3줄 요약:
```

**예상 시간**: 4-6시간

---

### 2. AI 감정 분석 온도계

#### 기능 설명
- 게시글과 댓글의 **감정 톤 분석**
- 찬성/반대/중립 비율을 **온도계 UI**로 시각화
- 여론 동향 파악 및 민감한 주제 식별

---

#### AI 모델 선택
**옵션 비교**:
| 모델 | 비용 | 품질 | 속도 | 비고 |
|------|------|------|------|------|
| OpenAI GPT-4 | 높음 | 최고 | 보통 | 감정 분석 우수 |
| Hugging Face BERT | 무료 | 우수 | 빠름 | 한국어 파인튜닝 모델 |
| Claude 3.5 Sonnet | 보통 | 최고 | 빠름 | 맥락 이해 우수 |

**권장**: Claude 3.5 Sonnet (맥락 이해 + 한국어)

---

#### API 엔드포인트 구현
**작업 항목**:
- [ ] POST /api/ai/sentiment - 감정 분석
  - 게시글/댓글 본문 입력
  - AI 모델 호출
  - 감정 점수 반환 (찬성, 반대, 중립)
- [ ] GET /api/posts/:postId/sentiment - 게시글 감정 조회
  - 댓글 감정 집계
  - 온도계 데이터 반환
- [ ] Admin Dashboard 통합
  - 게시글 목록에 온도계 아이콘 표시
  - 민감한 주제 자동 플래그

**예상 시간**: 12-16시간

---

#### 온도계 UI 구현
**작업 항목**:
- [ ] 온도계 컴포넌트 (React)
  - 찬성 (빨강), 반대 (파랑), 중립 (회색)
  - 애니메이션 효과
- [ ] 게시글 상세 페이지 통합
- [ ] Admin Dashboard 통합

**예상 시간**: 6-8시간

---

### Week 13-14 마일스톤
**완료 기준**:
- ✅ AI 3줄 요약 기능 정상 작동
- ✅ AI 감정 분석 온도계 정상 작동
- ✅ Admin Dashboard 통합 완료
- ✅ 캐싱으로 응답 속도 최적화

**예상 총 시간**: 34-46시간 (4-6일)

---

## Week 15-16: 불편/제안 접수 & 공지사항 시스템

### 목표
사용자 피드백 및 운영진 소통 시스템 완성

---

### 1. 불편/제안 접수 시스템

#### Prisma 스키마 (Phase 1 완료)
```prisma
model Suggestion {
  id            String   @id @default(uuid())
  suggestionId  String   @unique // RC000001, RS000001
  type          SuggestionType // COMPLAINT, SUGGESTION
  title         String
  content       String
  status        SuggestionStatus @default(PENDING)
  authorId      String
  author        Member   @relation(...)
  adminResponse String?
  createdAt     DateTime @default(now())
}
```

---

#### API 엔드포인트 구현
**작업 항목**:
- [ ] POST /api/suggestions - 불편/제안 접수
- [ ] GET /api/suggestions/:suggestionId - 상세 조회
- [ ] GET /api/suggestions - 목록 조회 (관리자)
- [ ] GET /api/suggestions/my - 내 접수 목록
- [ ] PATCH /api/suggestions/:suggestionId/respond - 관리자 답변
- [ ] PATCH /api/suggestions/:suggestionId/status - 상태 변경

**예상 시간**: 10-12시간

---

### 2. 공지사항 시스템

#### API 엔드포인트 구현
**작업 항목**:
- [ ] POST /api/notices - 공지사항 작성
- [ ] GET /api/notices/:noticeId - 상세 조회
- [ ] GET /api/notices - 목록 조회
- [ ] PATCH /api/notices/:noticeId - 수정
- [ ] DELETE /api/notices/:noticeId - 삭제

**예상 시간**: 8-10시간

---

### 3. 팝업/배너 시스템

#### API 엔드포인트 구현
**작업 항목**:
- [ ] CRUD API (팝업)
- [ ] CRUD API (배너)
- [ ] 표시 기간 제어
- [ ] 위치별 배치

**예상 시간**: 8-10시간

---

### Week 15-16 마일스톤
**완료 기준**:
- ✅ 불편/제안 접수 시스템 완성
- ✅ 공지사항 관리 시스템 완성
- ✅ 팝업/배너 관리 시스템 완성
- ✅ Admin Dashboard 완전 통합

**예상 총 시간**: 26-32시간 (3-4일)

---

## Phase 2 완료 기준

### 기능적 완료
- ✅ Admin Dashboard 16개 페이지 실시간 데이터 연동
- ✅ 파일 업로드 시스템 (S3 + CloudFront)
- ✅ 이메일 발송 시스템 (SES + 템플릿 6종)
- ✅ AI 3줄 요약 기능
- ✅ AI 감정 분석 온도계
- ✅ 불편/제안 접수 시스템
- ✅ 공지사항/팝업/배너 관리

### 품질 기준
- ✅ 모든 API 응답 시간 < 200ms
- ✅ AI 기능 캐싱으로 비용 최적화
- ✅ 파일 업로드 보안 검증
- ✅ 이메일 발송 실패 재시도 로직

### 문서 기준
- ✅ API 명세서 업데이트
- ✅ Admin Dashboard 사용 가이드
- ✅ AI 기능 프롬프트 문서
- ✅ WBS 현행화 완료

---

## 다음 단계: Phase 2.5

**Phase 2 완료 후**:
1. `/sc:save` - 진행 상황 저장
2. 체크포인트 문서 작성
3. **기술 스택 결정 워크플로우** 실행
   - HTML+jQuery vs React vs Hybrid
   - 의사결정 매트릭스 작성
   - 팀 논의 및 최종 결정
4. Phase 2.5 시작 - Frontend Website 마이그레이션

---

## 예상 총 시간

| Week | 작업 | 예상 시간 |
|------|------|-----------|
| Week 9-10 | Admin API 연동 | 40-60시간 |
| Week 11-12 | 파일 업로드 & 이메일 | 36-48시간 |
| Week 13-14 | AI MVP 기능 | 34-46시간 |
| Week 15-16 | 불편/제안 & 공지사항 | 26-32시간 |

**총 예상 시간**: 136-186시간 (17-23일)

---

**작성**: Claude Code (SuperClaude Framework)
**버전**: 2.0 (상세 버전)
**작성일**: 2025-10-23
**다음 작업**: Phase 2.5 상세 문서 작성
