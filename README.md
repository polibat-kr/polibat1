# 정치방망이(PoliBAT) - 정치인과 국민이 소통하는 플랫폼

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

정치방망이는 정치인과 국민이 부담 없이 소통할 수 있는 플랫폼입니다.

## 📋 프로젝트 구조

이 프로젝트는 **Turborepo 모노레포**로 구성되어 있습니다:

```
/polibat
├── /apps
│   ├── /admin         # Admin Dashboard (React + TypeScript)
│   ├── /web           # Frontend Website (HTML + JS)
│   └── /api           # Backend API Server (Node.js + Express)
├── /packages
│   ├── /types         # 공유 TypeScript 타입
│   ├── /constants     # 공유 상수
│   └── /utils         # 공유 유틸리티 함수
└── /docs              # 문서
```

## 🚀 시작하기

### 필수 요구사항

- **Node.js**: >= 20.0.0
- **npm**: >= 10.0.0
- **PostgreSQL**: 16 (원격 서버: 43.201.115.132)
- **Redis**: 7 (Docker)
- **Docker Desktop**: Redis용 (선택)

### 설치

```bash
# 저장소 클론
git clone https://github.com/yourusername/polibat.git
cd polibat

# 의존성 설치
npm install

# PostgreSQL 및 Redis 설정 (상세 가이드 참조)
# - PostgreSQL: 원격 서버 (43.201.115.132)
# - Redis: README.docker.md

# 데이터베이스 마이그레이션 (원격 PostgreSQL 16)
cd apps/api

# Prisma Client 생성
npx prisma generate

# 마이그레이션 실행 (로컬 DB에 테이블 생성)
npx prisma migrate dev

cd ../..
```

### 개발 서버 시작

```bash
# 모든 앱 동시 실행
npm run dev

# 또는 개별 실행
cd apps/admin && npm run dev  # Admin Dashboard (Port 3000)
cd apps/web && npm run dev    # Frontend Website (Port 8000)
cd apps/api && npm run dev    # Backend API (Port 4000)
```

## 📦 패키지 설명

### Apps

| 앱 | 설명 | 기술 스택 | 포트 |
|----|------|-----------|------|
| **admin** | 관리자 대시보드 | React 19 + TypeScript + Tailwind CSS | 3000 |
| **web** | 사용자 웹사이트 | HTML5 + Bootstrap 3 + jQuery | 8000 |
| **api** | Backend API 서버 | Node.js + Express + Prisma + PostgreSQL | 4000 |

### Packages

| 패키지 | 설명 | 사용처 |
|--------|------|--------|
| **@polibat/types** | 공유 TypeScript 타입 정의 | 전체 프로젝트 |
| **@polibat/constants** | 공유 상수 (ID prefix, 상태값 등) | 전체 프로젝트 |
| **@polibat/utils** | 공유 유틸리티 함수 | 전체 프로젝트 |

## 🛠️ 개발 명령어

```bash
# 개발 서버 시작 (모든 앱)
npm run dev

# 빌드 (모든 앱)
npm run build

# 테스트 실행
npm run test

# Lint 실행
npm run lint

# 타입 체크
npm run type-check

# 프로젝트 정리
npm run clean
```

## 📚 문서

### 핵심 문서 (루트)
- **[CLAUDE.md](./CLAUDE.md)** - AI 개발 가이드라인 및 프로젝트 전체 개요
- **[README.md](./README.md)** - 프로젝트 소개 및 Quick Start

### 문서 구조 (`doc/` 폴더)

프로젝트 문서는 카테고리별로 체계적으로 구성되어 있습니다:

#### 📐 아키텍처 (`doc/architecture/`)
설계 철학과 기술 선택, 현재 구현 상태를 다룹니다.
- **[ARCHITECTURE.md](./doc/architecture/ARCHITECTURE.md)** - 전체 시스템 아키텍처, 기술 스택, 모노레포 구조 및 사용법
- **[INFRASTRUCTURE.md](./doc/architecture/INFRASTRUCTURE.md)** - 인프라 환경 현황 (AWS EC2, PostgreSQL, Redis)
- **[IMPLEMENTATION_STATUS.md](./doc/architecture/IMPLEMENTATION_STATUS.md)** - 구현 완료 현황 (73개 API, 화면 진행률)

#### 🗺️ 로드맵 (`doc/roadmap/`)
개발 계획과 Phase별 상세 작업 내역을 확인할 수 있습니다.
- **[DEV_ROADMAP.md](./doc/roadmap/DEV_ROADMAP.md)** - 마스터 로드맵 (Phase 1-4 전체 개요)
- **[DEV_ROADMAP_PHASE1.md](./doc/roadmap/DEV_ROADMAP_PHASE1.md)** - Phase 1: Backend 기반 구축 (Week 1-8)
- **[DEV_ROADMAP_PHASE2.md](./doc/roadmap/DEV_ROADMAP_PHASE2.md)** - Phase 2: 핵심 기능 구현 (Week 9-20)
- **[DEV_ROADMAP_PHASE3.md](./doc/roadmap/DEV_ROADMAP_PHASE3.md)** - Phase 3: 고도화 기능 (Week 21-32)
- **[DEV_ROADMAP_PHASE4.md](./doc/roadmap/DEV_ROADMAP_PHASE4.md)** - Phase 4: 확장 및 장기 계획

#### 📋 프로젝트 명세 (`doc/specs/`)
프로젝트의 미션, 비전, 개발 규칙을 정의합니다.
- **[정치방망이(POLIBAT) 지침서.md](./doc/specs/정치방망이(POLIBAT)%20지침서.md)** - 프로젝트 미션 및 비전
- **[정치방망이(POLIBAT) 개발참고서.md](./doc/specs/정치방망이(POLIBAT)%20개발참고서.md)** - ID 체계, 상태값, 개발 규칙
- **[정치방망이(POLIBAT) 통합 화면명세서.md](./doc/specs/정치방망이(POLIBAT)%20통합%20화면명세서.md)** - 화면별 상세 스펙

#### 📚 개발 가이드 (`doc/guides/`)
개발 환경 설정 및 배포 관련 가이드입니다.
- **[DRAFT_README.setup.md](./doc/guides/DRAFT_README.setup.md)** - ⚠️ 개발 환경 설정 가이드 (구현 완료 후 작성 예정, 현재 참고하지 말 것)

#### 📊 대시보드 (`doc/dashboards/`)
프로젝트 진행 현황을 시각적으로 확인할 수 있습니다.
- **[project-status.html](./doc/dashboards/project-status.html)** - 프로젝트 현황 대시보드
- **[wbs.html](./doc/dashboards/wbs.html)** - WBS 진행률 대시보드

### 문서 활용 팁

**신규 팀원**:
1. `CLAUDE.md` 먼저 읽기 (프로젝트 전체 개요)
2. `doc/specs/정치방망이(POLIBAT) 지침서.md` (미션 이해)
3. `doc/architecture/ARCHITECTURE.md` (기술 스택 이해)
4. CLAUDE.md의 Development Environment 섹션 참고 (개발 환경 설정)

**기능 개발 시**:
1. `doc/roadmap/DEV_ROADMAP_PHASE*.md` (현재 Phase 확인)
2. `doc/architecture/IMPLEMENTATION_STATUS.md` (구현 현황 확인)
3. `doc/specs/정치방망이(POLIBAT) 통합 화면명세서.md` (UI/UX 스펙 확인)

**AI 코딩 도구 활용 시**:
1. `CLAUDE.md` 로드 (AI 개발 가이드라인)
2. `doc/architecture/ARCHITECTURE.md` (기술 스택 및 패턴)
3. 필요한 Phase별 로드맵만 선택적 로드 (토큰 절약)

## 🎯 주요 기능

### 현재 구현 (AS-IS)
- ✅ 회원 관리 (일반회원/정치인/보좌관)
- ✅ 게시글 관리 (자유게시판/정치방망이)
- ✅ 댓글 시스템
- ✅ 투표 기능
- ✅ 좋아요/싫어요
- ✅ 신고 시스템
- ✅ 불편/제안 접수
- ✅ 공지사항
- ✅ 팝업/배너 관리

### 개발 예정 (TO-BE)
- 🚧 실제 Backend API 연동
- 🚧 이메일 발송 시스템
- 🚧 파일 업로드 기능
- 🚧 AI 3줄 요약
- 🚧 AI 온도계 (감정 분석)
- 📅 오늘의 정치 AI 브리핑
- 📅 정치인 글 작성 지원
- 📅 실시간 알림 시스템

## 🔒 보안

- **이메일 암호화**: AES-256-GCM
- **인증**: JWT + Refresh Token
- **복호화 이력**: 감사 로그 자동 기록
- **Rate Limiting**: API 요청 제한
- **CORS**: 허용된 도메인만 접근 가능

## 🏗️ 개발 로드맵

### Phase 1: Foundation (1-2개월)
- Backend 기반 구축
- JWT 인증 시스템
- 이메일 암호화 시스템
- Admin API 연동

### Phase 2: Core Features (2-3개월)
- 투표 시스템 완성
- 파일 업로드 (S3)
- 이메일 발송 (SES)
- AI MVP (3줄 요약, AI 온도계)

### Phase 3: Enhancement (2-3개월)
- 실시간 알림 (WebSocket)
- 팀즈 웹훅 통합
- AI 중기 기능

### Phase 4: Scale (지속적)
- AI 장기 기능
- 글로벌 확장
- 모바일 앱

## 👥 기여하기

기여는 환영합니다! 이슈를 등록하거나 Pull Request를 제출해 주세요.

### 개발 가이드라인
- TypeScript 및 ESLint 규칙을 준수하세요
- 커밋 메시지는 한글로 작성합니다
- PR 제출 전 테스트를 실행하세요

## 📄 라이선스

MIT License

## 📧 연락처

프로젝트 관련 문의: [이메일 주소]

---

**🦦 정치방망이(PoliBAT)** - 국민과 정치인이 부담 없이 소통하는 플랫폼
