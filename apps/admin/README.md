# @polibat/admin

정치방망이 Admin Dashboard - React + TypeScript + Vite

## 기술 스택

- **Framework**: React 19.1.0
- **Language**: TypeScript 5.3
- **Build Tool**: Vite 5.1
- **Router**: React Router v7.7.0
- **State Management**: Zustand 4.x
- **Data Fetching**: TanStack Query (React Query) 5.x
- **Styling**: Tailwind CSS 3.4.x (v4 업그레이드 금지)
- **Charts**: Chart.js 4.5.0 + react-chartjs-2
- **Testing**: Vitest + React Testing Library

## 개발 명령어

```bash
# 개발 서버 시작 (Port 3000)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# 테스트 실행
npm run test

# 테스트 UI
npm run test:ui

# Lint 실행
npm run lint

# 타입 체크
npm run type-check
```

## 프로젝트 구조

```
/apps/admin
├── /src
│   ├── /core            # 앱 초기화
│   │   ├── main.tsx     # 엔트리 포인트
│   │   └── App.tsx      # 메인 앱 컴포넌트
│   ├── /features        # Feature-based 구조
│   │   ├── /members
│   │   ├── /posts
│   │   ├── /votes
│   │   └── /dashboard
│   ├── /shared          # 공유 리소스
│   │   ├── /components  # 공통 컴포넌트
│   │   ├── /hooks       # 커스텀 훅
│   │   ├── /stores      # Zustand 스토어
│   │   ├── /utils       # 유틸리티 함수
│   │   └── /styles      # 글로벌 스타일
│   └── /assets          # 이미지, 폰트 등
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 중요 사항

### Tailwind CSS 버전
**필수**: Tailwind CSS v3.4.x 사용, v4로 업그레이드 금지
- v4는 호환성 문제 발생
- package.json에서 `"tailwindcss": "~3.4.0"` 유지

### 한글 우선 정책
- 모든 UI 텍스트는 한글
- 날짜 형식: YYYY-MM-DD
- 커밋 메시지: 한글 필수

### TypeScript 경로 별칭
- `@/*` → `src/*`
- `@/features/*` → `src/features/*`
- `@/shared/*` → `src/shared/*`
- `@/core/*` → `src/core/*`

## Legacy 마이그레이션

기존 `/legacy/admin` 코드를 점진적으로 마이그레이션합니다:
- 100% 기능 동등성 유지
- CRA → Vite 전환
- Feature-based 구조로 재구성
- 공유 타입을 `@polibat/types`로 이동

## 참고 문서

- [TO-BE 아키텍처 명세서](../../TO-BE-ARCHITECTURE.md)
- [프로젝트 CLAUDE.md](../../CLAUDE.md)
