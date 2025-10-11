# CLAUDE_KO.md

이 파일은 이 저장소의 코드를 작업할 때 Claude Code(claude.ai/code)에 대한 지침을 제공합니다.

## 📄 파일 동기화 / File Synchronization

**필수**: CLAUDE.md 파일을 수정할 때는 반드시 CLAUDE_KO.md 파일도 함께 수정하여 두 파일 간의 동기화를 유지해야 합니다. 두 파일은 각각의 언어로 동일한 정보를 포함해야 합니다.

**CRITICAL**: When modifying CLAUDE.md, you MUST also update CLAUDE_KO.md to maintain synchronization between both files. Both files should contain the same information in their respective languages.

## 프로젝트 개요
정치방망이 (PoliBAT) - 정치인과 시민 간의 소통을 촉진하는 정치 커뮤니티 플랫폼. 프로젝트는 두 개의 별도 애플리케이션으로 구성:
- **관리자 대시보드** (/admin) - 플랫폼 콘텐츠 관리를 위한 React TypeScript 관리자 패널
- **프론트엔드 웹사이트** (/front) - Vanilla HTML/JS/CSS로 구성된 공개 웹사이트

## 📚 필수 프로젝트 문서 / Essential Project Documentation

정치방망이(POLIBAT) 프로젝트를 완전히 이해하기 위해 다음 문서들을 충분히 숙지하세요:

### 필수 숙지 문서 / Required Reading
1. **정치방망이(POLIBAT) 지침서.md**
   - 프로젝트 미션, 비전, 전략
   - 브랜딩 및 캐릭터 (오구링 마스코트)
   - AI 기능 로드맵 및 차별화 포인트
   - 비즈니스 규칙 및 플랫폼 구조

2. **정치방망이(POLIBAT) 개발참고서.md**
   - ID 구조 정의 (NM, PM, PA, FB, PB 등)
   - 상태값 정의 (회원, 게시글, 투표, 조치 상태)
   - 개발 요구사항 (이메일 보안, 승인 프로세스 등)
   - 기술 명세 및 시스템 제약사항

3. **정치방망이(POLIBAT) 통합 화면명세서.md**
   - 프론트엔드 및 백오피스 상세 화면 명세
   - 페이지별 기능 및 UI/UX 정의
   - 공통 컴포넌트 및 비즈니스 규칙
   - ⚠️ 명세서 내용이 불명확할 때는 **정치방망이(POLIBAT) 화면캡쳐.pdf**에서 해당 화면 참조
   - PDF에는 명세서의 넘버링과 일치하는 페이지 번호가 있는 실제 화면 캡쳐가 포함되어 있음

4. **정치방망이(POLIBAT) 화면캡쳐.pdf**
   - 시각적 참조가 포함된 실제 UI/UX 화면 캡쳐
   - ⚠️ 컨텍스트 사용량 최소화를 위해 필요시에만 읽기
   - 마크다운 명세서가 불충분할 때 시각적 검증을 위해 사용

### 참고 문서 / Reference Documentation
- `C:\polibat\admin\CLAUDE.md` - 관리자 대시보드 전용 가이드라인 (React/TypeScript)
- `C:\polibat\front\CLAUDE.md` - 프론트엔드 웹사이트 전용 가이드라인 (HTML/JS/jQuery)

## 🔧 개발 원칙 / Development Principles

### 문서 기반 개발 우선순위 / Documentation-Based Development Priority

1. **소스 코드 우선 (Source Code First)**
   - 구현은 실제 소스 코드 패턴을 따라야 함
   - 문서는 참조용이며, 실제 구현된 코드가 최종 기준
   - 문서를 따르기 전에 항상 소스에서 구현 확인

2. **필수 숙지 문서 참조 (Documentation Reference)**
   - 비즈니스 로직, ID 체계, 상태값은 필수 문서 참조
   - 화면 명세서는 UI/UX 구현 참조로 사용
   - 명세가 불명확할 때는 문서 간 교차 참조

### 기존 소스 최소 수정 원칙 / Minimum Modification Principle

**필수**: 기존 소스 코드에 대해 최소 수정 원칙을 따르세요. 필요한 기능을 달성하기 위한 필수적인 변경만 수행하세요.

**CRITICAL**: Follow the principle of minimum modification to existing source code. Only make necessary changes to achieve the required functionality.

#### 기존 소스 위치 / Existing Source Locations
- 관리자 대시보드: `C:\polibat\admin\`
- 프론트엔드 웹사이트: `C:\polibat\front\`

#### 지침 / Guidelines
- **기존 패턴 유지**: 현재 코드 스타일과 아키텍처 일치
- **점진적 변경**: 작고 명확한 수정만 수행
- **철저한 테스트**: 기존 기능 손상 여부 검증

## 명령어

### 관리자 대시보드
```bash
cd admin
npm install              # 종속성 설치
npm start               # 개발 서버 시작 (http://localhost:3000/backoffice)
npm run build           # 프로덕션 빌드
npm test                # 테스트 실행
npm test -- [file] --watch  # 특정 테스트 파일 실행
```

### 프론트엔드 웹사이트
```bash
cd front
python -m http.server 8000    # 로컬 개발 서버 시작
# 테스트 로그인: test@example.com / test123
```

## 프로젝트 아키텍처

### 관리자 대시보드 (/admin)
**기술 스택**: React 19, TypeScript, Tailwind CSS v3.4 (v4로 업그레이드 금지), React Router v7

**주요 구조**:
- `src/components/popups/` - 모든 엔티티 타입에 대한 상세 팝업
- `src/pages/` - 각 관리자 라우트에 대한 페이지 컴포넌트
- `src/types/business.types.ts` - 핵심 비즈니스 타입 정의
- `src/utils/navigation.ts` - 페이지 간 네비게이션 헬퍼

**중요 패턴**:
- 항상 옵셔널 체이닝 사용: `data?.property || defaultValue`
- 배열 안전성: `Array.isArray(items) && items.length > 0`
- 객체 매핑 안전성: `mapping[key] || defaultValue`
- 페이지 레이아웃 순서: 헤더 → 통계 카드 → 필터 → 테이블

### 프론트엔드 웹사이트 (/front)
**기술 스택**: HTML5, Bootstrap 3, jQuery, Vanilla JavaScript (ES5 전용)

**주요 파일**:
- `page-manager.js` - 페이지 상태 관리 (반드시 마지막에 로드)
- `login.js` - 테스트 계정이 있는 인증 시스템
- `header.html` / `footer.html` - div import를 통해 포함

## 비즈니스 로직 및 ID 시스템

### 엔티티 ID 형식 / Entity ID Format

**참고**: 이 ID 구조는 소스 코드(`admin/src/types/business.types.ts`)의 실제 구현을 반영합니다.

| 엔티티 | Prefix | 자리수 | 예시 | 설명 |
|--------|--------|--------|------|------|
| 일반회원 | NM | 6 | NM000001 | Normal Member |
| 정치인 | PM | 6 | PM000001 | Politician Member |
| 보좌관 | PA | 6 | PA000001 | Politician Assistant |
| 자유게시판 | FB | 6 | FB000001 | Free Board Post |
| 정치인게시판 | PB | 6 | PB000001 | Polibat Board Post |
| 댓글 | CM | 4 | FB000001-CM0001 | Comment (게시글 기반) |
| 투표 | VP | 6 | VP000001 | Vote Poll |
| 불편사항 | RC | 6 | RC000001 | Report Complaint |
| 제안사항 | RS | 6 | RS000001 | Report Suggestion |
| 신고 | RP | 4 | FB000001-RP0001 | Report (게시글/댓글 기반) |
| 공지사항 | NT | 6 | NT000001 | Notice |
| 팝업 | PU | 6 | PU000001 | Popup |
| 배너 | BN | 6 | BN000001 | Banner |
| 정책 템플릿 | TP | 4 | TP0001-VN0001 | Template Policy-버전 |

**ID 생성 규칙**:
- 앞자리 0을 포함한 고정 자리수 (예: NM000001 ~ NM999999)
- 하위 엔티티 ID는 상위 ID + 구분자 + 하위 prefix (예: FB000001-CM0001)
- 정책 템플릿은 버전 번호 포함 (TP0001-VN0001)

### 상태값 / Status Values

**참고**: 상태값은 `admin/src/types/business.types.ts`에 정의되어 있습니다.

#### 회원 상태 (Member Status)
- `승인` - 승인됨 (일반회원 자동승인, 정치인/보좌관 관리자승인)
- `승인대기` - 승인 대기 중 (정치인/보좌관만 해당)
- `탈퇴` - 탈퇴 (사용자 자발적 탈퇴)
- `정지` - 정지됨 (일시적 활동 제한)
- `강퇴` - 강제 퇴출 (영구적 활동 제한)

#### 게시글/댓글 상태 (Post/Comment Status)
- `게시` - 게시됨 (공개 표시)
- `게시(고정)` - 고정 게시 (상단 고정 표시)
- `숨김` - 숨김 (관리자/작성자만 열람)
- `삭제` - 삭제됨 (소프트 삭제, 복구 가능)

#### 투표 상태 (Vote Status)
- `진행` - 진행 중 (투표 활성)
- `마감` - 마감됨 (투표 종료)
- `예정` - 예정됨 (투표 시작 전)

#### 조치 상태 (Action Status)
- `접수대기` - 접수됨 (신고/제안 접수)
- `검토중` - 검토 중 (관리자 검토)
- `처리완료` - 처리 완료 (조치 완료)
- `처리불가` - 처리 불가 (조치 불가능)
- `추후검토` - 추후 검토 (향후 재검토 예정)

### 날짜 기간 표준
- 일간: 오늘만 (시작일 = 종료일 = 오늘)
- 주간: 오늘부터 지난 7일
- 월간: 오늘부터 지난 1개월
- 연간: 오늘부터 지난 1년

## 개발 가이드라인

### 관리자 대시보드 규칙
1. **타입 안전성**: 옵셔널 체이닝 없이 직접 속성 접근 금지
2. **필터 완전성**: 필터 추가 시 세 가지 모두 구현: 상태, 표시, 리셋
3. **카드 클릭 로직**: 정치인/보좌진은 `statusFilter('승인')` 설정
4. **페이지 간 네비게이션**: URL 파라미터의 송신과 수신 모두 구현
5. **UI 일관성**: 통계 카드는 항상 검색 필터 위에 배치

### 프론트엔드 규칙
1. **ES5 전용**: 화살표 함수, const/let, 현대 구문 사용 금지
2. **jQuery 확인**: 사용 전 항상 jQuery 로드 확인
3. **파일 로딩**: page-manager.js는 body에서 마지막에 로드
4. **로그인 테스트**: test@example.com / test123 사용

### 일반적인 개발 작업

**새 관리자 페이지 추가**:
1. `admin/src/pages/`에 컴포넌트 생성
2. `admin/src/App.tsx`에 라우트 추가
3. `admin/src/components/Layout.tsx`에 메뉴 항목 추가

**새 프론트엔드 페이지 추가**:
1. header/footer includes가 있는 HTML 생성
2. `front/page-manager.js`에 페이지 매핑 추가
3. 브라우저 콘솔에서 페이지 감지 테스트

**페이지 간 네비게이션 (관리자)**:
```typescript
// 소스 페이지
import { navigateToPage } from '../utils/navigation';
navigateToPage('/members', { type: '정치인', status: '승인' });

// 타겟 페이지 - 파라미터 수신 및 적용
useEffect(() => {
  const params = new URLSearchParams(location.search);
  if (params.get('type')) setTypeFilter(params.get('type'));
  if (params.get('status')) setStatusFilter(params.get('status'));
}, [location.search]);
```

## 안전 가이드라인

### 필수 검증 패턴
```typescript
// ✅ 안전한 패턴 - 항상 이것을 사용
const value = data?.nested?.property || defaultValue;
const items = Array.isArray(data) ? data : [];
const color = colorMapping[key as keyof typeof colorMapping] || 'default';

// ❌ 안전하지 않은 패턴 사용 금지
const value = data.nested.property;  // undefined일 경우 충돌
```

### 파일 작업
- 대량 수정에 shell regex/sed 사용 금지
- 파일 변경에는 Edit 도구만 사용
- 1000줄 이상 파일은 섹션별로 수정
- 수정 후 항상 변경 사항 확인

## 테스트 접근 방법

### 관리자 대시보드
- Jest와 React Testing Library
- 테스트 파일: 컴포넌트와 함께 `*.test.tsx`
- 특정 실행: `npm test -- [filename] --watch`

### 프론트엔드
- DevTools로 수동 브라우저 테스트
- 콘솔에서 오류 확인
- 테스트 계정으로 로그인 플로우 테스트
- page-manager.js 초기화 확인

## 언어 설정 / Language Preferences

### 🇰🇷 한국어 우선 정책 (Korean First Policy)
**중요**: 이 프로젝트에서 작업할 때는 항상 한글로 응답하세요. 모든 작업 로그, 설명, 진행 상황 업데이트, 상호작용은 별도 요청이 없는 한 한글로 작성되어야 합니다.

**IMPORTANT**: Always respond in Korean (한글) when working on this project. All work logs, explanations, progress updates, and interactions should be in Korean unless explicitly requested otherwise.

### 작업 진행 표시 (Work Progress Display)
- **도구 사용 로그**: 한글로 표시 (예: "파일 읽는 중...", "코드 수정 중...")
- **진행 상황 업데이트**: 한글 설명 (예: "회원 관리 페이지 구현 완료")
- **오류 메시지**: 한글 설명 (예: "오류: 파일을 찾을 수 없습니다")
- **작업 설명**: TodoWrite 도구에서 한글 작업명 사용

### 코드 및 문서화 (Code and Documentation)
- **UI 텍스트**: 모든 사용자 대면 텍스트는 한국어
- **코드 주석**: 비즈니스 로직 설명은 한국어
- **커밋 메시지**: 한국어 필수 (예: "feat: 회원 필터 기능 추가")
- **변수명**: 코드는 영어, 주석은 한국어
- **날짜 형식**: YYYY-MM-DD (한국 표준)
- **작업 내역**: 모든 작업 내역과 로그는 한국어로

## 🚀 Claude Code 베스트 프랙티스

### 코드 작업을 위한 워크플로우
모든 코딩 작업에 대해 이 구조화된 접근 방식을 따르세요:
1. **탐색**: Read/Glob/Grep 도구를 사용하여 관련 파일 읽기 및 이해
2. **계획**: TodoWrite 도구로 상세한 구현 계획 작성
3. **구현**: 프로젝트 패턴에 따라 코드 작성
4. **검증**: 구현 테스트 및 엣지 케이스 확인
5. **커밋**: 한국어로 명확한 메시지와 함께 의미 있는 커밋 생성

### 효과적인 도구 사용
- **검색 우선**: 새 코드 생성 전 항상 기존 구현 검색
- **배치 작업**: 관련 파일 읽기 시 여러 도구를 병렬로 호출
- **컨텍스트 관리**: 컨텍스트가 너무 커지면 `/clear` 명령 사용
- **시각적 검증**: 필요 시 UI 변경에 대한 스크린샷 요청

### 코드 생성 가이드라인
- **패턴 따르기**: 항상 기존 코드 스타일과 패턴 일치
- **안전 우선**: 일관되게 옵셔널 체이닝과 기본값 사용
- **테스트 커버리지**: 새 기능에 대한 테스트 작성
- **점진적 변경**: 대규모 재작성보다 작고 집중된 변경 수행

### 성능 팁
- **병렬 처리**: 효율성을 위해 단일 응답에서 여러 도구 호출 사용
- **집중된 컨텍스트**: 관련 파일만 컨텍스트에 유지
- **스마트 네비게이션**: 수동 탐색 대신 Grep/Glob으로 파일 찾기

### 테스트 베스트 프랙티스
- **TDD 접근**: 새 기능 추가 시 구현 전 테스트 작성
- **빈번한 테스트 실행**: 중요한 변경 후 매번 테스트 실행
- **시각적 테스트**: 스크린샷을 사용하여 UI 컴포넌트 확인
- **엣지 케이스**: 항상 경계 조건과 오류 상태 테스트

## 중요 경고
1. **Tailwind CSS**: v3.4.x 사용 필수 - v4는 호환성 문제 발생
2. **옵셔널 체이닝**: 모든 객체 속성 접근에 필수
3. **필터 구현**: 세 가지 측면(상태, 표시, 리셋) 모두 필요
4. **페이지 레이아웃 순서**: 통계 카드는 검색 필터 위에 있어야 함
5. **ES5 구문**: 프론트엔드는 ES5 호환성 유지 필수 (현대 JS 금지)
6. **jQuery 로딩**: 종속 스크립트 전에 로드 필수
7. **페이지 간 네비게이션**: 송신과 수신 모두 구현 필수