# 정치방망이(PoliBAT) 코드베이스 현황

**작성일**: 2025-10-19
**버전**: 1.0
**목적**: 현재 구현된 코드베이스의 상세 현황 문서

---

## 📋 문서 목적

본 문서는 정치방망이 프로젝트의 **현재 구현 상태**를 상세히 기록합니다.
개발 시작 전 이 문서를 참조하여 기존 코드를 이해하고, 100% 기능 동등성을 유지하면서 개발할 수 있습니다.

---

## 1. Admin Dashboard Implementation (16 Pages)

### 1.1 구현된 화면 목록

1. **Dashboard (대시보드)** - `/dashboard`
   - 회원/게시글/방문자 통계 차트
   - 기간별 필터링 (일간/주간/월간/연간)
   - 누적/변동 차트 전환
   - Chart.js 기반 데이터 시각화

2. **AllMembersPage (전체회원관리)** - `/members/all`
   - 회원 목록 조회 및 필터링
   - 회원상태/유형별 통계 카드
   - 검색 및 날짜 기간 필터
   - 회원 상세정보 팝업

3. **PoliticiansPage (정치인관리)** - `/members/politicians`
   - 정치인 및 보좌진 관리
   - 승인대기 처리 기능
   - 정치인 유형 분류

4. **MemberStatusHistoryPage (회원상태 변경이력)** - `/members/status-history`
   - 회원 상태 변경 이력 추적
   - 변경 사유 및 시점 기록

5. **LikesHistoryPage (좋아요/싫어요 이력)** - `/likes-history`
   - 회원별 반응 이력
   - 게시글/댓글별 분류

6. **VotesHistoryPage (투표 이력)** - `/votes-history`
   - 회원별 투표 참여 이력
   - 투표 결과 조회

7. **PostsManagementPage (게시글 관리)** - `/posts`
   - 자유게시판/정치방망이 게시글 관리
   - 게시 상태 변경 (게시/숨김/삭제)
   - 게시판별 필터링

8. **CommentsManagementPage (댓글 관리)** - `/comments`
   - 댓글 목록 및 상태 관리
   - 게시글 연동 조회

9. **ReportsHistoryPage (신고이력)** - `/reports`
   - 게시글/댓글 신고 처리
   - 신고 사유 및 조치 내역

10. **VotesManagementPage (투표관리)** - `/votes`
    - 투표 생성 및 관리
    - 투표 상태 제어 (진행/마감/예정)

11. **SuggestionsManagementPage (불편/제안 접수 관리)** - `/suggestions`
    - 불편사항/제안사항 접수 관리
    - 처리 상태 업데이트

12. **NoticesManagementPage (공지사항 관리)** - `/notices`
    - 공지사항 작성 및 발행
    - 카테고리별 분류

13. **PopupsManagementPage (팝업 관리)** - `/popups`
    - 팝업 이미지 및 링크 관리
    - 표시 기간 설정

14. **BannersManagementPage (배너 관리)** - `/banners`
    - 배너 이미지 관리
    - 위치별 배치

15. **PolicyTemplatesPage (서비스정책 템플릿 관리)** - `/policies/templates`
    - 정책 템플릿 관리

16. **PolicyContentPage (서비스정책 관리)** - `/policies/content`
    - 실제 서비스 정책 콘텐츠 관리

### 1.2 컴포넌트 아키텍처

#### Layout Component (`src/components/Layout.tsx`)
- 사이드바 네비게이션
- 반응형 모바일 메뉴
- 확장 가능한 메뉴 구조
- 사용자 정보 표시

#### Popup Components (`src/components/popups/`)
- `MemberDetailPopup.tsx` - 회원 상세 정보 및 조치
- `PostDetailPopup.tsx` - 게시글 상세 및 관리
- `CommentDetailPopup.tsx` - 댓글 상세 및 관리
- `VoteDetailPopup.tsx` - 투표 상세 정보
- `SuggestionDetailPopup.tsx` - 제안/불편 사항 상세
- `PolicyDetailPopup.tsx` - 정책 상세 정보
- `PopupDetailPopup.tsx` - 팝업 설정 상세
- `BannerDetailPopup.tsx` - 배너 설정 상세

### 1.3 상태 관리

- **Local State**: React useState for component-level state
- **URL Parameters**: Cross-page navigation parameters
- **Navigation Utility**: `src/utils/navigation.ts` for page transitions with filters

### 1.4 핵심 패턴

1. **Optional Chaining**: `data?.property || defaultValue`
2. **Array Safety**: `Array.isArray(items) && items.length > 0`
3. **Filter Triple Implementation**: state + display + reset
4. **Card Click Navigation**: Auto-filter application on statistics cards
5. **Cross-Page Parameter Passing**: URL params + useEffect parsing

### 1.5 기술 스택

- **Frontend**: React 19.1.0
- **Language**: TypeScript 4.9.5
- **Router**: React Router v7.7.0
- **Styling**: Tailwind CSS 3.4.x (⚠️ DO NOT upgrade to v4)
- **Charts**: Chart.js 4.5.0 + react-chartjs-2 5.3.0
- **Icons**: Lucide React 0.525.0
- **Testing**: React Testing Library 16.3.0, Jest

---

## 2. Frontend Website Implementation (22 Pages)

### 2.1 구현된 페이지 목록

1. **index.html** - 메인 홈페이지
2. **login.html** - 로그인 (일반회원/정치인 탭)
3. **signup.html** - 회원가입
4. **board.html** - 자유게시판 목록
5. **board_01.html** - 게시글 상세보기
6. **voice.html** - 정치방망이 게시판 목록
7. **write.html** - 게시글 작성
8. **write_voice.html** - 정치방망이 게시글 작성
9. **edit.html** - 게시글 수정
10. **vote_board.html** - 투표 게시판
11. **vote.html** - 투표 상세
12. **feedback.html** - 불편/제안 접수 목록
13. **feedback_01.html** - 불편사항 상세
14. **feedback_02.html** - 제안사항 상세
15. **notice.html** - 공지사항 목록
16. **notice_01.html** - 공지사항 상세
17. **member_info.html** - 마이페이지
18. **find_account.html** - 계정 찾기
19. **terms.html** - 이용약관
20. **privacy.html** - 개인정보처리방침
21. **header.html** - 공통 헤더
22. **footer.html** - 공통 푸터

### 2.2 핵심 JavaScript 모듈

#### page-manager.js (페이지 통합 관리 시스템)
- **PageDetector**: 현재 페이지 자동 감지
- **HeaderFooterLoader**: 헤더/푸터 동적 로딩
- **RedirectionManager**: 로그인 후 스마트 리디렉션
- **PageManager**: 메인 페이지 관리자

#### login.js (통합 로그인 시스템)
- **LoginManager**: 로그인 폼 처리 및 인증
- **HeaderStateManager**: 헤더 로그인 상태 동기화
- Test accounts with type validation
- Smart redirection (URL params → sessionStorage → referrer)

### 2.3 상태 관리

- **localStorage**: 로그인 유지 (Remember Me)
- **sessionStorage**: 세션 기반 로그인, previousPage 저장
- **Custom Events**: `userLoginSuccess`, `userLogout`
- **Storage Events**: 다른 탭 간 로그인 상태 동기화

### 2.4 인증 흐름

1. 탭 선택 (일반회원/정치인)
2. 이메일/비밀번호 입력
3. 계정 타입 검증
4. 로그인 상태 저장 (localStorage/sessionStorage)
5. 헤더 상태 업데이트 이벤트 발생
6. 스마트 리디렉션 실행

### 2.5 기술 스택

- **Structure**: HTML5 semantic markup
- **Styling**: Bootstrap 3.x + custom CSS
- **JavaScript**: ES5 vanilla JS + jQuery 3.x
- **Fonts**: Nanum Gothic, Google Fonts
- **Icons**: Font Awesome 6.5.0, IcoMoon

---

## 3. API 엔드포인트 (예상)

### 주의사항
현재 Admin과 Frontend 모두 **실제 백엔드 API가 연결되어 있지 않습니다**.
모든 데이터는 하드코딩된 샘플 데이터를 사용하며, API 호출은 `console.log`로 대체되어 있습니다.

### 예상 API 구조

#### 인증
- POST `/api/v1/auth/register` - 회원가입
- POST `/api/v1/auth/login` - 로그인
- POST `/api/v1/auth/logout` - 로그아웃
- POST `/api/v1/auth/refresh` - 토큰 갱신

#### 회원
- GET `/api/v1/members` - 회원 목록 조회 (관리자)
- GET `/api/v1/members/:id` - 회원 상세 조회
- PUT `/api/v1/members/:id` - 회원 정보 수정
- DELETE `/api/v1/members/:id` - 회원 탈퇴
- PUT `/api/v1/members/:id/status` - 회원 상태 변경 (관리자)

#### 게시글
- GET `/api/v1/posts` - 게시글 목록
- POST `/api/v1/posts` - 게시글 작성
- GET `/api/v1/posts/:id` - 게시글 상세
- PUT `/api/v1/posts/:id` - 게시글 수정
- DELETE `/api/v1/posts/:id` - 게시글 삭제
- POST `/api/v1/posts/:id/like` - 좋아요
- POST `/api/v1/posts/:id/report` - 신고

#### 댓글
- GET `/api/v1/posts/:postId/comments` - 댓글 목록
- POST `/api/v1/posts/:postId/comments` - 댓글 작성
- PUT `/api/v1/comments/:id` - 댓글 수정
- DELETE `/api/v1/comments/:id` - 댓글 삭제

#### 투표
- GET `/api/v1/votes` - 투표 목록
- POST `/api/v1/votes` - 투표 생성 (관리자)
- GET `/api/v1/votes/:id` - 투표 상세
- POST `/api/v1/votes/:id/cast` - 투표 참여
- GET `/api/v1/votes/:id/results` - 투표 결과

#### 불편/제안
- GET `/api/v1/suggestions` - 접수 목록
- POST `/api/v1/suggestions` - 접수 작성
- GET `/api/v1/suggestions/:id` - 접수 상세
- PUT `/api/v1/suggestions/:id/reply` - 답변 작성 (관리자)

#### 공지사항
- GET `/api/v1/notices` - 공지사항 목록
- POST `/api/v1/notices` - 공지사항 작성 (관리자)
- GET `/api/v1/notices/:id` - 공지사항 상세

---

## 4. 핵심 기능 체크리스트

### 4.1 Must-Have Features (필수 기능)

- [x] 회원 관리 (CRUD, 상태 관리, 승인)
- [x] 게시글 관리 (CRUD, 좋아요/신고)
- [x] 댓글 시스템
- [x] 투표 시스템
- [x] 불편/제안 접수
- [x] 공지사항 관리
- [ ] 실제 백엔드 API 연동
- [ ] 파일 업로드 (S3)
- [ ] 이메일 발송
- [ ] AI 3줄 요약
- [ ] AI 감정 분석 온도계

### 4.2 Nice-to-Have Features (선택 기능)

- [ ] 실시간 알림 (WebSocket)
- [ ] 고급 검색 (Elasticsearch)
- [ ] AI 정치 브리핑
- [ ] AI 글 작성 지원
- [ ] 팩트체크 시스템
- [ ] 다국어 지원 (i18n)
- [ ] 모바일 앱 (React Native)

---

## 5. Missing Implementation (미구현 항목)

### 5.1 Backend
- **전체 Backend API 미구현**: 모든 데이터가 프론트엔드 하드코딩 상태
- **데이터베이스 연동 미구현**: PostgreSQL 스키마 미생성
- **인증 시스템 미구현**: JWT 토큰 시스템 없음 (localStorage만 사용)
- **파일 업로드 미구현**: S3 연동 없음
- **이메일 발송 미구현**: SES 연동 없음
- **AI 기능 미구현**: OpenAI API 연동 없음

### 5.2 Admin Dashboard
- **API 연동 미완성**: 모든 API 호출이 `console.log`로 대체
- **파일 업로드 없음**: 이미지 업로드 기능 미구현
- **실시간 기능 없음**: WebSocket 없음

### 5.3 Frontend Website
- **API 연동 미완성**: 모든 데이터가 샘플 데이터
- **파일 업로드 없음**: 게시글 이미지 업로드 미구현
- **실시간 기능 없음**: 알림, 채팅 없음

---

## 6. Architecture Optimization Opportunities (최적화 기회)

### 6.1 Admin Dashboard Improvements

**상태 관리 최적화**:
- React Context API → Zustand 마이그레이션
- API 호출 → TanStack Query 도입
- 전역 상태 관리 체계화

**타입 안전성 강화**:
- API 응답 타입 정의 (@polibat/types)
- DTO 및 Validation 추가 (Zod)

### 6.2 Frontend Website Improvements

**모듈화**:
- ES6 Modules로 전환 (page-manager.js, login.js)
- Vite 번들러 도입

**상태 관리 개선**:
- localStorage/sessionStorage → 체계적인 상태 관리
- Custom Event → TypeScript 이벤트 시스템

---

## 7. Testing Strategy Recommendations (테스트 전략 권장사항)

### 7.1 Admin Dashboard
- **Unit Tests**: React Testing Library + Jest
- **Integration Tests**: API 연동 테스트
- **E2E Tests**: Playwright

### 7.2 Frontend Website
- **Manual Testing**: 브라우저 DevTools
- **Cross-Browser**: Chrome, Firefox, Safari, Edge
- **Mobile**: 반응형 디자인 테스트

---

## 8. Development Roadmap Recommendations (개발 로드맵 권장사항)

### Phase 1: Backend Foundation
- Prisma 스키마 완성
- Express 서버 구조 생성
- JWT 인증 시스템 구현

### Phase 2: Core Integration
- Admin Dashboard API 연동
- Frontend Website API 연동
- 파일 업로드 기능 (S3)

### Phase 3: Feature Enhancement
- 실시간 알림 (WebSocket)
- AI MVP 기능 (3줄 요약, 온도계)
- 성능 최적화

### Phase 4: AI Integration
- AI 정치 브리핑
- AI 글 작성 지원
- 팩트체크 시스템

---

**작성**: Claude Code (SuperClaude Framework)
**버전**: 1.0
**작성일**: 2025-10-19
**참고**: DEV_ROADMAP.md Appendix A에서 분리
