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

- [TO-BE 아키텍처 명세서](./TO-BE-ARCHITECTURE.md) - 전체 시스템 아키텍처 및 기술 스펙
- [CLAUDE.md](./CLAUDE.md) - AI 개발 가이드라인
- [정치방망이 지침서](./정치방망이(POLIBAT)%20지침서.md) - 프로젝트 미션 및 비전
- [정치방망이 개발참고서](./정치방망이(POLIBAT)%20개발참고서.md) - ID 체계 및 상태값 정의
- [정치방망이 통합 화면명세서](./정치방망이(POLIBAT)%20통합%20화면명세서.md) - 화면별 상세 스펙

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
