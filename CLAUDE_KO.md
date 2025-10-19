# CLAUDE.md

## 프로젝트 개요

- **모노레포 구조** (Turborepo)
- **앱**: admin, web, api
- **패키지**: types, constants, utils
- **레거시**: legacy/admin, legacy/front

## 필수 문서

- `정치방망이(POLIBAT) 지침서.md` - 프로젝트 미션 및 비전
- `정치방망이(POLIBAT) 개발참고서.md` - 개발 가이드라인
- `정치방망이(POLIBAT) 통합 화면명세서.md` - UI/UX 명세서
- `DEV_ROADMAP.md` - 상세 구현 가이드 및 코드베이스 현황
- `TO-BE-ARCHITECTURE.md` - 목표 아키텍처 및 기술 스택
- `MONOREPO_GUIDE.md` - 모노레포 구조 및 명령어

## 개발 원칙

- **소스 코드 우선**: 변경 전 항상 실제 코드 검토
- **AI 최적화 개발**: 명확한 추상화, 타입 안전성, 예측 가능한 패턴
- **100% 기능 동등성**: 원본 UI/UX 및 비즈니스 로직 유지
- **기능 기반 구조**: 기술 레이어가 아닌 비즈니스 기능별 코드 구성

## 개발 환경

- **OS**: Windows 10/11
- **셸**: PowerShell 7 (pwsh.exe)
- **Node.js**: v18+ (LTS 권장)
- **패키지 매니저**: npm
- **설정**: `C:\Users\[username]\.cursor\settings.json`

## 명령어

### 관리자 대시보드
```powershell
cd apps/admin
npm install
npm start          # 개발 서버 (http://localhost:3000)
npm run build      # 프로덕션 빌드
npm test           # 테스트 실행
```

### 프론트엔드 웹사이트
```powershell
cd apps/web
python -m http.server 8000  # 개발 서버 (http://localhost:8000)
```

### API 서버
```powershell
cd apps/api
npm install
npm run dev        # 개발 서버
npm run build      # 프로덕션 빌드
```

## 프로젝트 아키텍처

### 관리자 대시보드
- **프레임워크**: React 19.1.0 + TypeScript 4.9.5
- **라우터**: React Router v7.7.0
- **스타일링**: Tailwind CSS 3.4.x (v4로 업그레이드 금지)
- **차트**: Chart.js 4.5.0 + react-chartjs-2 5.3.0
- **아이콘**: Lucide React 0.525.0
- **핵심 구조**: `features/`, `shared/`, `core/`

### 프론트엔드 웹사이트
- **구조**: HTML5, Bootstrap 3, jQuery, Vanilla JS (ES5)
- **핵심 파일**: `page-manager.js`, `login.js`
- **인증**: localStorage/sessionStorage 기반

### API 서버
- **프레임워크**: Node.js + Express.js + TypeScript
- **데이터베이스**: PostgreSQL 15 + Prisma
- **인증**: JWT + Redis
- **보안**: Helmet, CORS, Rate limiting

## 비즈니스 로직

### 엔티티 ID 형식
| 엔티티 | 형식 | 예시 |
|--------|------|------|
| 회원 | M + 6자리 | M000001 |
| 게시글 | P + 6자리 | P000001 |
| 댓글 | C + 6자리 | C000001 |
| 투표 | V + 6자리 | V000001 |
| 공지사항 | N + 6자리 | N000001 |

### 상태값
- **회원**: active, inactive, suspended, pending
- **게시글**: published, hidden, deleted
- **댓글**: active, hidden, deleted
- **투표**: active, closed, cancelled
- **신고**: pending, resolved, dismissed

## 개발 가이드라인

### 관리자 대시보드 규칙
1. **타입 안전성**: 옵셔널 체이닝 사용 (`data?.property || defaultValue`)
2. **필터 삼중 구현**: 모든 필터에 대해 state + display + reset 구현
3. **카드 클릭 로직**: 통계 카드 클릭 시 자동 필터 적용
4. **페이지 간 네비게이션**: 필터 지속성을 위해 URL 파라미터 사용

### 프론트엔드 규칙
1. **ES5만 사용**: 최신 JavaScript 기능 사용 금지
2. **jQuery 확인**: 사용 전 jQuery 로드 확인
3. **파일 로딩 순서**: CSS → JS → 페이지별 JS
4. **로그인 테스트**: 개발용 테스트 계정 사용

## 안전 패턴

```typescript
// 안전한 데이터 접근
const value = data?.property || defaultValue;
const items = Array.isArray(data) ? data : [];

// 안전한 배열 연산
const filteredItems = items?.filter(item => item.status === 'active') || [];

// 안전한 함수 호출
const result = callback?.(data);
```

## 테스팅

### 관리자 대시보드
- **단위 테스트**: React Testing Library + Jest
- **테스트 파일**: `*.test.tsx`, `*.test.ts`
- **커버리지**: 컴포넌트, 유틸리티, 훅

### 프론트엔드 웹사이트
- **수동 테스트**: 브라우저 DevTools
- **크로스 브라우저**: Chrome, Firefox, Safari, Edge
- **모바일**: 반응형 디자인 테스트

## SuperClaude 명령어

- `/sc:help` - 사용 가능한 명령어 표시
- `/sc:implement [기능]` - 특정 기능 구현
- `/sc:analyze [경로]` - 코드 구조 분석
- `/sc:load` - 세션 컨텍스트 로드 (자동 트리거)
- `/sc:save` - 세션 컨텍스트 저장 (80% 토큰 사용 시 자동 트리거)

## 세션 관리

- **자동 로드**: 세션 시작 시 컨텍스트 복원
- **자동 저장**: 80% 토큰 사용 또는 30분마다 컨텍스트 저장
- **토큰 모니터링**: 최적 성능을 위해 필요
- **컨텍스트 지속성**: 세션 간 개발 상태 유지

## 중요 경고사항

1. **Tailwind CSS v3.4만 사용** - v4로 업그레이드 금지
2. **옵셔널 체이닝 필수** - 데이터 접근 시 항상 `?.` 사용
3. **프론트엔드는 ES5 문법** - 최신 JavaScript 기능 사용 금지
4. **PowerShell 명령어만 사용** - Windows PowerShell 문법 사용
5. **API 연동 없음** - 모든 데이터는 현재 하드코딩된 샘플

## 참조

- **상세 구현**: `DEV_ROADMAP.md` (부록 A: 코드베이스 구현 현황)
- **아키텍처**: `TO-BE-ARCHITECTURE.md`
- **모노레포 가이드**: `MONOREPO_GUIDE.md`
- **프로젝트 미션**: `정치방망이(POLIBAT) 지침서.md`