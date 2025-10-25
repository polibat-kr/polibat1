# 정치방망이(PoliBAT) TO-BE 아키텍처 명세서

**작성일**: 2025-10-11
**버전**: 1.0
**목적**: AI 에이전트 개발에 최적화된 아키텍처 및 기술 스펙 정의

---

## 📋 목차

1. [개요](#1-개요)
2. [아키텍처 설계 원칙](#2-아키텍처-설계-원칙)
3. [시스템 아키텍처](#3-시스템-아키텍처)
4. [기술 스택](#4-기술-스택)
5. [프로젝트 구조](#5-프로젝트-구조)
6. [데이터베이스 설계](#6-데이터베이스-설계)
7. [API 설계](#7-api-설계)
8. [보안 및 인증](#8-보안-및-인증)
9. [AI 기능 구현](#9-ai-기능-구현)
10. [인프라 및 배포](#10-인프라-및-배포)
11. [개발 로드맵](#11-개발-로드맵)
12. [AS-IS vs TO-BE 비교](#12-as-is-vs-to-be-비교)

---

## 1. 개요

### 1.1 문서 목적
본 문서는 정치방망이(PoliBAT) 프로젝트의 AI 에이전트 개발에 최적화된 TO-BE 아키텍처를 정의합니다. 기존 AS-IS 구조를 분석하고, 100% 기능 동등성을 유지하면서 AI가 효율적으로 개발할 수 있는 구조로 개선합니다.

### 1.2 핵심 원칙
1. **100% 기능 동등성**: 모든 UI, 사용자 경험, 비즈니스 로직이 기존과 동일하게 작동
2. **AI 개발 최적화**: 명확한 추상화, 타입 안정성, 예측 가능한 패턴
3. **확장 가능성**: 향후 기능 추가 및 변경이 용이한 구조
4. **유지보수성**: 코드 가독성과 유지보수 용이성 극대화

### 1.3 AS-IS 현황 요약
- **Admin Dashboard**: React 19 + TypeScript, 16개 페이지, 샘플 데이터
- **Frontend Website**: HTML5 + jQuery + Vanilla JS, 22개 페이지
- **Backend**: 없음 (프론트엔드 전용)
- **Database**: 없음 (localStorage 기반 인증)

### 1.4 TO-BE 목표
- **Full-Stack**: Backend API + 실제 데이터베이스 연동
- **모노레포**: 전체 프로젝트 통합 관리
- **타입 안정성**: TypeScript 전체 스택 통일
- **AI 기능**: 단계적 AI 기능 구현
- **하이브리드 환경**: PostgreSQL 16 (원격 서버: 43.201.115.132) + Redis (Docker)

---

## 2. 아키텍처 설계 원칙

### 2.1 AI 개발 최적화 원칙

#### 명확한 계층 분리
```
Presentation Layer (UI)
    ↓
Business Logic Layer (Service)
    ↓
Data Access Layer (Repository)
    ↓
Database Layer
```

**AI 최적화 포인트**:
- 각 계층이 독립적으로 테스트 가능
- AI가 한 계층에만 집중하여 코드 생성 가능
- 의존성이 명확하여 AI가 임포트 자동 생성

#### 타입 안정성
- **Full TypeScript**: Frontend + Backend 전체 TypeScript
- **공유 타입**: `@polibat/types` 패키지로 타입 공유
- **자동 타입 생성**: OpenAPI → TypeScript 자동 생성

**AI 최적화 포인트**:
- AI가 타입 추론으로 올바른 코드 생성
- 컴파일 타임 에러 방지
- 자동완성으로 개발 속도 향상

#### 명명 규칙 표준화
- **파일**: kebab-case (`member-service.ts`)
- **컴포넌트**: PascalCase (`MemberDetailPopup.tsx`)
- **함수/변수**: camelCase (`getMemberById`)
- **타입/인터페이스**: PascalCase (`MemberType`, `IUser`)
- **상수**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)

**AI 최적화 포인트**:
- AI가 일관된 네이밍 규칙 학습
- 코드 리뷰 및 유지보수 용이

#### Feature-Based 구조
```
/features
  /members
    /api         # API 호출
    /components  # 관련 컴포넌트
    /hooks       # 커스텀 훅
    /types       # 타입 정의
    /utils       # 유틸리티
    index.ts     # Public API
```

**AI 최적화 포인트**:
- 기능별로 격리된 코드
- AI가 독립적으로 기능 개발 가능
- 영향 범위가 명확하여 안전한 수정

### 2.2 100% 기능 동등성 보장

#### AS-IS 화면 완벽 재현
- **Admin Dashboard**: 16개 페이지 모든 기능 동일
- **Frontend Website**: 22개 페이지 모든 UI/UX 동일
- **비즈니스 로직**: ID 체계, 상태값, 승인 프로세스 동일

#### 검증 전략
1. **화면 단위 검증**: 각 화면별 체크리스트 작성
2. **사용자 플로우 검증**: 주요 사용자 시나리오 테스트
3. **데이터 검증**: 모든 데이터 필드 및 관계 검증
4. **성능 검증**: 로딩 속도 및 응답 시간 동일 수준 유지

---

## 3. 시스템 아키텍처

### 3.1 전체 시스템 구조

#### 운영 환경 (AWS)
```
┌─────────────────────────────────────────────────────────────┐
│                      CloudFront CDN                          │
│                  (정적 파일, 이미지 캐싱)                      │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│              Application Load Balancer                       │
│                 (HTTPS, 트래픽 분산)                          │
└─────────────┬───────────────┬───────────────────────────────┘
              │               │
    ┌─────────▼─────────┐    │
    │  Admin Dashboard  │    │
    │   (React SPA)     │    │
    │   Port: 3000      │    │
    └───────────────────┘    │
                             │
    ┌────────────────────────▼────────┐
    │    Frontend Website             │
    │    (Static HTML + JS)           │
    │    Port: 8000                   │
    └─────────────────────────────────┘
                  │
    ┌─────────────▼─────────────────────┐
    │       API Server                  │
    │   (Node.js + Express)             │
    │   ECS Fargate                     │
    │   Port: 4000                      │
    └─────┬──────────┬─────────┬────────┘
          │          │         │
    ┌─────▼───┐  ┌───▼────┐  ┌▼────────┐
    │   RDS   │  │ElastiCache│   S3    │
    │Postgres │  │  Redis  │  │  Files  │
    │  18     │  │   7.x   │  │         │
    └─────────┘  └────────┘  └─────────┘
          │
    ┌─────▼──────────────────────────┐
    │    AI Service (독립)           │
    │  - OpenAI API                  │
    │  - Claude API                  │
    │  - Self-hosted Models          │
    └────────────────────────────────┘
```

#### 개발 환경 (Windows 로컬)
```
┌────────────────────────────────────┐
│    Admin Dashboard (React SPA)     │
│    localhost:3000                  │
└──────────────┬─────────────────────┘
               │
┌──────────────▼─────────────────────┐
│    Frontend Website (Static)       │
│    localhost:8000                  │
└──────────────┬─────────────────────┘
               │
┌──────────────▼─────────────────────┐
│    API Server (Node.js + Express)  │
│    localhost:4000                  │
└─────┬──────────────┬───────────────┘
      │              │
┌─────▼────────┐  ┌──▼──────────┐
│  PostgreSQL  │  │  Redis      │
│  16 (원격)   │  │  7 (Docker) │
│ 43.201.*.*   │  │  Port: 6379 │
│  Port: 5432  │  │             │
└──────────────┘  └─────────────┘
```

### 3.2 마이크로서비스 아키텍처 (선택적)

**초기**: Monolith로 시작 (빠른 개발)
**확장**: 트래픽 증가 시 마이크로서비스 분리

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Auth Service │  │ Post Service │  │ Vote Service │
└──────────────┘  └──────────────┘  └──────────────┘
        │                 │                 │
        └─────────────────┴─────────────────┘
                          │
                ┌─────────▼─────────┐
                │   API Gateway     │
                │   (Kong/Nginx)    │
                └───────────────────┘
```

---

## 4. 기술 스택

### 4.1 Backend

#### 핵심 기술
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js 4.x
- **Language**: TypeScript 5.x
- **ORM**: Prisma 5.x
- **Validation**: Zod (타입 안전 검증)

#### 선택 이유
- **TypeScript**: Frontend와 타입 공유, AI가 타입 추론 가능
- **Prisma**: 타입 안전 ORM, 마이그레이션 자동화, AI가 스키마 이해 용이
- **Express**: 표준화된 패턴, 풍부한 미들웨어, AI가 패턴 학습 쉬움

#### 추가 라이브러리
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "zod": "^3.22.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "express-rate-limit": "^7.0.0",
    "helmet": "^7.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0"
  }
}
```

### 4.2 Frontend - Admin Dashboard

#### 핵심 기술
- **Framework**: React 19.1.0
- **Language**: TypeScript 4.9.5
- **Router**: React Router v7.7.0
- **State**: Zustand 4.x (경량, AI 친화적)
- **Data Fetching**: TanStack Query (React Query) 5.x
- **Styling**: Tailwind CSS 3.4.x (v4 업그레이드 금지)
- **Forms**: React Hook Form 7.x
- **Charts**: Chart.js 4.5.0 + react-chartjs-2 5.3.0

#### 선택 이유
- **Zustand**: Redux보다 간단, Context API보다 성능 좋음, AI가 이해하기 쉬움
- **TanStack Query**: 캐싱, 로딩/에러 상태 자동 관리, AI가 패턴 파악 용이
- **React Hook Form**: 타입 안정성, 검증 로직 명확, 성능 우수

#### 상태 관리 구조
```typescript
// stores/member-store.ts
import { create } from 'zustand';

interface MemberStore {
  members: Member[];
  selectedMember: Member | null;
  setMembers: (members: Member[]) => void;
  setSelectedMember: (member: Member | null) => void;
}

export const useMemberStore = create<MemberStore>((set) => ({
  members: [],
  selectedMember: null,
  setMembers: (members) => set({ members }),
  setSelectedMember: (member) => set({ selectedMember: member }),
}));
```

### 4.3 Frontend - Website

#### 핵심 기술
- **Base**: HTML5 + CSS3
- **Bundler**: Vite 5.x (점진적 마이그레이션)
- **JavaScript**: ES6+ Modules (트랜스파일링으로 호환성 유지)
- **Styling**: Bootstrap 3.x (기존 유지) + Custom CSS
- **Icons**: Font Awesome 6.5.0

#### 마이그레이션 전략
1. **Phase 1**: 기존 jQuery 코드 유지, 새 기능만 ES6 모듈
2. **Phase 2**: page-manager.js → ES6 모듈 변환
3. **Phase 3**: 점진적 jQuery → Vanilla JS 전환
4. **Phase 4**: Vite로 번들링, 브라우저 호환성 유지

### 4.4 Database

#### 핵심 기술
- **RDBMS**: PostgreSQL 16 (개발: AWS 개발 서버, 운영: AWS RDS)
- **Cache**: Redis 7.x (Docker)
- **Migration**: Prisma SQL 직접 생성 (migrate diff)
- **Backup**: AWS RDS 자동 백업 (일일, 7일 보관)

#### 개발 환경 구성
- **PostgreSQL 16**: AWS 개발 서버 (43.201.115.132:5432)
- **Redis 7**: Docker 컨테이너로 실행
- **하이브리드 환경**: 안정성과 격리의 균형

#### 선택 이유
- **PostgreSQL**: 타입 안정성, JSON 지원, 복잡한 쿼리 지원, 확장성
- **Redis**: 세션 관리, API 캐싱, Rate Limiting
- **Windows 로컬 PostgreSQL**: Prisma migrate 호환성, 개발 환경 안정성

### 4.5 공유 패키지

#### 모노레포 구조
```
/packages
  /types        # 공유 TypeScript 타입
  /constants    # 공유 상수 (ID prefix, status 등)
  /utils        # 공유 유틸리티 함수
  /ui           # 공통 UI 컴포넌트 (선택적)
```

#### @polibat/types 예시
```typescript
// packages/types/src/member.ts
export enum MemberType {
  NORMAL = 'NORMAL',
  POLITICIAN = 'POLITICIAN',
  ASSISTANT = 'ASSISTANT',
  ADMIN = 'ADMIN',
}

export enum MemberStatus {
  APPROVED = '승인',
  PENDING_APPROVAL = '승인대기',
  WITHDRAWN = '탈퇴',
  SUSPENDED = '정지',
  BANNED = '강퇴',
}

export interface Member {
  id: string;
  memberId: string; // NM000001 형식
  memberType: MemberType;
  email: string;
  nickname: string;
  status: MemberStatus;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 5. 프로젝트 구조

### 5.1 모노레포 구조 (Turborepo)

```
/polibat
├── /apps
│   ├── /admin              # Admin Dashboard (React)
│   │   ├── /src
│   │   │   ├── /features   # Feature-based 구조
│   │   │   │   ├── /members
│   │   │   │   │   ├── /api
│   │   │   │   │   ├── /components
│   │   │   │   │   ├── /hooks
│   │   │   │   │   ├── /types
│   │   │   │   │   └── index.ts
│   │   │   │   ├── /posts
│   │   │   │   ├── /votes
│   │   │   │   └── /dashboard
│   │   │   ├── /shared     # 공유 리소스
│   │   │   │   ├── /components
│   │   │   │   ├── /hooks
│   │   │   │   ├── /stores (Zustand)
│   │   │   │   └── /utils
│   │   │   ├── /core       # 앱 초기화
│   │   │   │   ├── App.tsx
│   │   │   │   ├── router.tsx
│   │   │   │   └── main.tsx
│   │   │   └── /assets
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   ├── /web                # Frontend Website (HTML/JS)
│   │   ├── /src
│   │   │   ├── /pages      # HTML 페이지
│   │   │   ├── /scripts    # JavaScript 모듈
│   │   │   ├── /styles     # CSS
│   │   │   └── /assets     # 이미지, 폰트
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── /api                # Backend API Server
│       ├── /src
│       │   ├── /features   # Feature-based 구조
│       │   │   ├── /members
│       │   │   │   ├── member.controller.ts
│       │   │   │   ├── member.service.ts
│       │   │   │   ├── member.repository.ts
│       │   │   │   ├── member.routes.ts
│       │   │   │   ├── member.dto.ts
│       │   │   │   └── member.spec.ts
│       │   │   ├── /posts
│       │   │   ├── /votes
│       │   │   └── /auth
│       │   ├── /shared     # 공유 리소스
│       │   │   ├── /middleware
│       │   │   ├── /utils
│       │   │   └── /config
│       │   ├── /core       # 앱 초기화
│       │   │   ├── app.ts
│       │   │   ├── server.ts
│       │   │   └── database.ts
│       │   └── /prisma
│       │       ├── schema.prisma
│       │       └── /migrations
│       ├── package.json
│       └── tsconfig.json
│
├── /packages
│   ├── /types              # 공유 TypeScript 타입
│   │   ├── /src
│   │   │   ├── member.ts
│   │   │   ├── post.ts
│   │   │   ├── vote.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── /constants          # 공유 상수
│   │   ├── /src
│   │   │   ├── id-prefixes.ts
│   │   │   ├── status-values.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── /utils              # 공유 유틸리티
│       ├── /src
│       │   ├── id-generator.ts
│       │   ├── date-utils.ts
│       │   └── index.ts
│       └── package.json
│
├── /docs                   # 통합 문서
│   ├── TO-BE-ARCHITECTURE.md
│   ├── API-SPEC.md
│   └── DATABASE-SCHEMA.md
│
├── /tools                  # 개발 도구
│   ├── /scripts
│   └── /generators
│
├── turbo.json
├── package.json
└── tsconfig.json
```

### 5.2 Feature 구조 상세 (Backend 예시)

```
/api/src/features/members
├── member.controller.ts    # HTTP 요청 처리
├── member.service.ts       # 비즈니스 로직
├── member.repository.ts    # 데이터 액세스
├── member.routes.ts        # 라우팅 정의
├── member.dto.ts           # Data Transfer Object
├── member.types.ts         # 타입 정의
├── member.validation.ts    # Zod 검증 스키마
├── member.spec.ts          # 테스트
└── index.ts                # Public API
```

**AI 최적화 포인트**:
- 파일명과 역할이 명확하게 매핑
- AI가 각 파일의 목적을 즉시 파악
- 새 기능 추가 시 패턴 복제 가능

### 5.2 모노레포 사용법

#### 5.2.1 개발 시작하기

**1. 의존성 설치**:
```bash
npm install
```

**2. 개발 서버 시작**:
```bash
# 모든 앱 동시 실행
npm run dev

# 개별 앱 실행
cd apps/admin && npm run dev  # Port 3000
cd apps/web && npm run dev    # Port 8000
cd apps/api && npm run dev    # Port 4000
```

**3. 빌드**:
```bash
# 모든 앱 빌드
npm run build

# 개별 앱 빌드
cd apps/admin && npm run build
```

#### 5.2.2 주요 명령어

```bash
npm run dev          # 모든 앱 개발 서버 시작
npm run build        # 모든 앱 빌드
npm run test         # 모든 앱 테스트 실행
npm run lint         # 린트 검사
npm run type-check   # TypeScript 타입 검사
npm run clean        # 빌드 결과물 정리
```

#### 5.2.3 공유 패키지 사용법

**@polibat/types**:
```typescript
import { Member, MemberType, MemberStatus } from '@polibat/types';

const member: Member = {
  id: 'uuid',
  memberId: 'NM000001',
  memberType: MemberType.NORMAL,
  status: MemberStatus.APPROVED,
  // ...
};
```

**@polibat/constants**:
```typescript
import { ID_PREFIXES, MEMBER_STATUS } from '@polibat/constants';

const prefix = ID_PREFIXES.NORMAL_MEMBER; // 'NM'
const status = MEMBER_STATUS.APPROVED; // '승인'
```

**@polibat/utils**:
```typescript
import { IdGenerator, DateUtils } from '@polibat/utils';

// ID 생성
const newId = IdGenerator.generate('NM', 123); // 'NM000124'

// 날짜 포맷
const formatted = DateUtils.formatBoardDate(new Date());
```

#### 5.2.4 문제 해결

**의존성 문제**:
```bash
# 모든 node_modules 삭제 및 재설치
npm run clean
rm -rf node_modules
npm install
```

**빌드 캐시 문제**:
```bash
# Turbo 캐시 삭제
rm -rf .turbo
npm run clean
npm run build
```

**새 패키지 추가**:
```bash
# 1. packages 디렉토리에 새 패키지 생성
mkdir -p packages/새패키지/src

# 2. package.json 생성
# {
#   "name": "@polibat/새패키지",
#   "version": "1.0.0",
#   "main": "./dist/index.js",
#   "types": "./dist/index.d.ts"
# }

# 3. Apps에서 사용
# "dependencies": {
#   "@polibat/새패키지": "workspace:*"
# }
```

---

## 6. 데이터베이스 설계

### 6.1 Prisma 스키마 (핵심 모델)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== 회원 ====================

model Member {
  id              String       @id @default(uuid())
  memberId        String       @unique // NM000001, PM000001, PA000001
  memberType      MemberType
  email           String       @unique // AES-256 암호화 저장
  passwordHash    String       // bcrypt
  nickname        String       @unique
  status          MemberStatus @default(APPROVED)

  // 정치인 전용 필드
  politicianType  String?      // 국회의원, 지방자치단체, 대통령실
  profileImage    String?
  bio             String?      @db.Text

  // 타임스탬프
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  lastLoginAt     DateTime?

  // Relations
  posts           Post[]
  comments        Comment[]
  votes           VoteParticipation[]
  likes           Like[]
  reports         Report[]
  suggestions     Suggestion[]

  // 정치인게시판 타겟으로 지목된 게시글
  targetedPosts   Post[]       @relation("TargetPolitician")

  @@map("members")
}

enum MemberType {
  NORMAL      // 일반회원
  POLITICIAN  // 정치인
  ASSISTANT   // 보좌관
  ADMIN       // 운영자
}

enum MemberStatus {
  APPROVED            // 승인
  PENDING_APPROVAL    // 승인대기
  WITHDRAWN           // 탈퇴
  SUSPENDED           // 정지
  BANNED              // 강퇴
}

// ==================== 게시글 ====================

model Post {
  id                  String      @id @default(uuid())
  postId              String      @unique // FB000001, PB000001
  boardType           BoardType
  title               String
  content             String      @db.Text
  aiSummary           String?     // AI 3줄 요약
  status              PostStatus  @default(PUBLISHED)
  views               Int         @default(0)
  isPinned            Boolean     @default(false)

  // 작성자
  authorId            String
  author              Member      @relation(fields: [authorId], references: [id])

  // 정치인게시판 전용
  targetPoliticianId  String?
  targetPolitician    Member?     @relation("TargetPolitician", fields: [targetPoliticianId], references: [id])

  // 타임스탬프
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt

  // Relations
  comments            Comment[]
  likes               Like[]
  reports             Report[]
  images              PostImage[]

  @@map("posts")
  @@index([boardType, status, createdAt])
  @@index([authorId])
}

enum BoardType {
  FREE      // 자유게시판
  POLIBAT   // 정치인게시판
}

enum PostStatus {
  PUBLISHED       // 게시
  PUBLISHED_PINNED // 게시(고정)
  HIDDEN          // 숨김
  DELETED         // 삭제
}

// ==================== 댓글 ====================

model Comment {
  id            String        @id @default(uuid())
  commentId     String        @unique // FB000001-CM0001
  content       String        @db.Text
  status        CommentStatus @default(PUBLISHED)

  // Relations
  postId        String
  post          Post          @relation(fields: [postId], references: [id])

  authorId      String
  author        Member        @relation(fields: [authorId], references: [id])

  // 타임스탬프
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  // Relations
  likes         Like[]
  reports       Report[]

  @@map("comments")
  @@index([postId, createdAt])
  @@index([authorId])
}

enum CommentStatus {
  PUBLISHED   // 게시
  HIDDEN      // 숨김
  DELETED     // 삭제
}

// ==================== 투표 ====================

model Vote {
  id                String              @id @default(uuid())
  voteId            String              @unique // VP000001
  title             String
  description       String?             @db.Text
  status            VoteStatus          @default(SCHEDULED)

  // 기간
  startDate         DateTime
  endDate           DateTime

  // 타임스탬프
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt

  // Relations
  options           VoteOption[]
  participations    VoteParticipation[]

  @@map("votes")
  @@index([status, startDate])
}

enum VoteStatus {
  SCHEDULED   // 예정
  IN_PROGRESS // 진행
  CLOSED      // 마감
}

model VoteOption {
  id            String              @id @default(uuid())
  optionText    String
  order         Int

  voteId        String
  vote          Vote                @relation(fields: [voteId], references: [id])

  // Relations
  participations VoteParticipation[]

  @@map("vote_options")
  @@unique([voteId, order])
}

model VoteParticipation {
  id            String      @id @default(uuid())

  memberId      String
  member        Member      @relation(fields: [memberId], references: [id])

  voteId        String
  vote          Vote        @relation(fields: [voteId], references: [id])

  optionId      String
  option        VoteOption  @relation(fields: [optionId], references: [id])

  createdAt     DateTime    @default(now())

  @@map("vote_participations")
  @@unique([memberId, voteId]) // 중복 투표 방지
}

// ==================== 좋아요/싫어요 ====================

model Like {
  id            String      @id @default(uuid())
  likeType      LikeType

  memberId      String
  member        Member      @relation(fields: [memberId], references: [id])

  postId        String?
  post          Post?       @relation(fields: [postId], references: [id])

  commentId     String?
  comment       Comment?    @relation(fields: [commentId], references: [id])

  createdAt     DateTime    @default(now())

  @@map("likes")
  @@unique([memberId, postId, commentId]) // 중복 방지
}

enum LikeType {
  LIKE      // 좋아요
  DISLIKE   // 싫어요
}

// ==================== 신고 ====================

model Report {
  id            String        @id @default(uuid())
  reportId      String        @unique // FB000001-RP0001
  reason        String
  status        ReportStatus  @default(PENDING)

  reporterId    String
  reporter      Member        @relation(fields: [reporterId], references: [id])

  postId        String?
  post          Post?         @relation(fields: [postId], references: [id])

  commentId     String?
  comment       Comment?      @relation(fields: [commentId], references: [id])

  // 관리자 처리
  adminNote     String?       @db.Text
  resolvedAt    DateTime?

  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@map("reports")
}

enum ReportStatus {
  PENDING       // 접수대기
  REVIEWING     // 검토중
  RESOLVED      // 처리완료
  REJECTED      // 처리불가
  DEFERRED      // 추후검토
}

// ==================== 불편/제안 접수 ====================

model Suggestion {
  id            String          @id @default(uuid())
  suggestionId  String          @unique // RS000001, RC000001
  type          SuggestionType
  title         String
  content       String          @db.Text
  status        SuggestionStatus @default(PENDING)
  isPublic      Boolean         @default(true)

  memberId      String
  member        Member          @relation(fields: [memberId], references: [id])

  // 관리자 답변
  adminReply    String?         @db.Text
  repliedAt     DateTime?

  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  @@map("suggestions")
  @@index([type, status])
}

enum SuggestionType {
  FEATURE     // 기능제안
  COMPLAINT   // 불편사항
  VOTE        // 투표제안
}

enum SuggestionStatus {
  PENDING       // 접수대기
  REVIEWING     // 검토중
  RESOLVED      // 처리완료
  REJECTED      // 처리불가
  DEFERRED      // 추후검토
}

// ==================== 공지사항 ====================

model Notice {
  id            String      @id @default(uuid())
  noticeId      String      @unique // NT000001
  category      NoticeCategory
  title         String
  content       String      @db.Text
  isPinned      Boolean     @default(false)
  views         Int         @default(0)

  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@map("notices")
  @@index([category, createdAt])
}

enum NoticeCategory {
  GUIDE       // 이용안내
  UPDATE      // 업데이트
  COMMUNICATION // 소통소식
  EXTERNAL    // 외부활동
}

// ==================== 이메일 복호화 이력 ====================

model EmailAccessLog {
  id              String    @id @default(uuid())
  accessorId      String    // 복호화한 관리자 ID
  accessorIp      String
  targetMemberId  String    // 복호화된 회원 ID
  deviceType      String    // PC, Mobile, Tablet
  purpose         String    // 조회 목적

  accessedAt      DateTime  @default(now())

  @@map("email_access_logs")
  @@index([targetMemberId, accessedAt])
  @@index([accessorId, accessedAt])
}
```

### 6.2 ID 생성 전략

```typescript
// packages/utils/src/id-generator.ts

import { ID_PREFIXES } from '@polibat/constants';

export class IdGenerator {
  /**
   * ID 생성
   * @param prefix ID 접두사 (NM, PM, FB 등)
   * @param digits 숫자 자리수 (4 또는 6)
   * @param parentId 상위 ID (댓글, 신고 등)
   */
  static async generate(
    prefix: keyof typeof ID_PREFIXES,
    digits: 4 | 6 = 6,
    parentId?: string
  ): Promise<string> {
    // 1. 최신 ID 조회
    const lastId = await this.getLastId(prefix, parentId);

    // 2. 숫자 부분 추출
    const lastNumber = this.extractNumber(lastId, digits);

    // 3. 다음 번호 생성
    const nextNumber = lastNumber + 1;

    // 4. 포맷팅
    const formattedNumber = String(nextNumber).padStart(digits, '0');

    // 5. 최종 ID 생성
    if (parentId) {
      return `${parentId}-${prefix}${formattedNumber}`;
    }
    return `${prefix}${formattedNumber}`;
  }

  // 예시: NM000001, FB123456-CM0001
}
```

---

## 7. API 설계

### 7.1 RESTful API 구조

#### 기본 원칙
- **Resource-based**: `/api/v1/members`, `/api/v1/posts`
- **HTTP Methods**: GET (조회), POST (생성), PUT (수정), DELETE (삭제)
- **Status Codes**: 200 (성공), 201 (생성), 400 (요청 오류), 401 (인증 오류), 404 (없음), 500 (서버 오류)
- **Response Format**: JSON

#### 엔드포인트 목록

```typescript
// ==================== 인증 ====================
POST   /api/v1/auth/register          // 회원가입
POST   /api/v1/auth/login             // 로그인
POST   /api/v1/auth/logout            // 로그아웃
POST   /api/v1/auth/refresh           // 토큰 갱신
POST   /api/v1/auth/forgot-password   // 비밀번호 찾기
POST   /api/v1/auth/reset-password    // 비밀번호 재설정

// ==================== 회원 ====================
GET    /api/v1/members                // 회원 목록 조회 (관리자)
GET    /api/v1/members/:id            // 회원 상세 조회
PUT    /api/v1/members/:id            // 회원 정보 수정
DELETE /api/v1/members/:id            // 회원 탈퇴
PUT    /api/v1/members/:id/status     // 회원 상태 변경 (관리자)
GET    /api/v1/members/:id/posts      // 특정 회원 게시글
GET    /api/v1/members/:id/comments   // 특정 회원 댓글

// ==================== 게시글 ====================
GET    /api/v1/posts                  // 게시글 목록 (필터, 페이지네이션)
POST   /api/v1/posts                  // 게시글 작성
GET    /api/v1/posts/:id              // 게시글 상세
PUT    /api/v1/posts/:id              // 게시글 수정
DELETE /api/v1/posts/:id              // 게시글 삭제
POST   /api/v1/posts/:id/like         // 좋아요
POST   /api/v1/posts/:id/dislike      // 싫어요
POST   /api/v1/posts/:id/report       // 신고
GET    /api/v1/posts/:id/ai-summary   // AI 요약 조회

// ==================== 댓글 ====================
GET    /api/v1/posts/:postId/comments        // 댓글 목록
POST   /api/v1/posts/:postId/comments        // 댓글 작성
PUT    /api/v1/comments/:id                  // 댓글 수정
DELETE /api/v1/comments/:id                  // 댓글 삭제
POST   /api/v1/comments/:id/like             // 좋아요
POST   /api/v1/comments/:id/report           // 신고

// ==================== 투표 ====================
GET    /api/v1/votes                  // 투표 목록
POST   /api/v1/votes                  // 투표 생성 (관리자)
GET    /api/v1/votes/:id              // 투표 상세
PUT    /api/v1/votes/:id              // 투표 수정 (관리자)
DELETE /api/v1/votes/:id              // 투표 삭제 (관리자)
POST   /api/v1/votes/:id/cast         // 투표 참여
GET    /api/v1/votes/:id/results      // 투표 결과

// ==================== 불편/제안 ====================
GET    /api/v1/suggestions            // 접수 목록
POST   /api/v1/suggestions            // 접수 작성
GET    /api/v1/suggestions/:id        // 접수 상세
PUT    /api/v1/suggestions/:id        // 접수 수정
DELETE /api/v1/suggestions/:id        // 접수 삭제
PUT    /api/v1/suggestions/:id/reply  // 답변 작성 (관리자)

// ==================== 공지사항 ====================
GET    /api/v1/notices                // 공지사항 목록
POST   /api/v1/notices                // 공지사항 작성 (관리자)
GET    /api/v1/notices/:id            // 공지사항 상세
PUT    /api/v1/notices/:id            // 공지사항 수정 (관리자)
DELETE /api/v1/notices/:id            // 공지사항 삭제 (관리자)

// ==================== 신고 ====================
GET    /api/v1/reports                // 신고 목록 (관리자)
GET    /api/v1/reports/:id            // 신고 상세 (관리자)
PUT    /api/v1/reports/:id/resolve    // 신고 처리 (관리자)

// ==================== 관리자 전용 ====================
GET    /api/v1/admin/dashboard/stats  // 대시보드 통계
GET    /api/v1/admin/members/pending  // 승인 대기 회원
PUT    /api/v1/admin/members/:id/approve // 회원 승인
```

### 7.2 Request/Response 예시

#### 회원 가입
```typescript
// POST /api/v1/auth/register
interface RegisterRequest {
  email: string;
  password: string;
  nickname: string;
  memberType: 'NORMAL' | 'POLITICIAN' | 'ASSISTANT';
  politicianType?: string; // 정치인인 경우 필수
}

interface RegisterResponse {
  success: boolean;
  data: {
    memberId: string;
    email: string;
    nickname: string;
    status: string;
  };
  message: string;
}
```

#### 게시글 목록 조회
```typescript
// GET /api/v1/posts?boardType=FREE&page=1&limit=10&search=정치
interface PostListRequest {
  boardType?: 'FREE' | 'POLIBAT';
  page?: number;
  limit?: number;
  search?: string;
  status?: 'PUBLISHED' | 'HIDDEN' | 'DELETED';
  sortBy?: 'latest' | 'popular' | 'views';
}

interface PostListResponse {
  success: boolean;
  data: {
    posts: Post[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
```

### 7.3 에러 응답 표준

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;      // ERROR_CODE_001
    message: string;   // 사용자 친화적 메시지
    details?: any;     // 개발 환경에서만 포함
  };
}

// 에러 코드 예시
enum ErrorCode {
  // 인증/인가
  UNAUTHORIZED = 'AUTH_001',
  INVALID_TOKEN = 'AUTH_002',
  TOKEN_EXPIRED = 'AUTH_003',

  // 유효성 검증
  INVALID_INPUT = 'VALIDATION_001',
  MISSING_FIELD = 'VALIDATION_002',

  // 비즈니스 로직
  DUPLICATE_EMAIL = 'BUSINESS_001',
  ALREADY_VOTED = 'BUSINESS_002',
  CANNOT_REPORT_OWN_POST = 'BUSINESS_003',

  // 시스템
  SERVER_ERROR = 'SYSTEM_001',
  DATABASE_ERROR = 'SYSTEM_002',
}
```

### 7.4 API 클라이언트 (Frontend)

```typescript
// admin/src/shared/api/api-client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (인증 토큰 추가)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor (에러 처리, 토큰 갱신)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 토큰 갱신 로직
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post('/api/v1/auth/refresh', { refreshToken });
          localStorage.setItem('accessToken', data.accessToken);
          // 원래 요청 재시도
          error.config.headers.Authorization = `Bearer ${data.accessToken}`;
          return axios(error.config);
        } catch (refreshError) {
          // 로그아웃 처리
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 8. 보안 및 인증

### 8.1 이메일 암호화 시스템

#### 암호화 구현
```typescript
// api/src/shared/utils/encryption.ts
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex'); // 32 bytes
const IV_LENGTH = 16;

export class EmailEncryption {
  /**
   * 이메일 암호화
   */
  static encrypt(email: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

    let encrypted = cipher.update(email, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // IV + AuthTag + 암호화된 데이터
    return iv.toString('hex') + authTag.toString('hex') + encrypted;
  }

  /**
   * 이메일 복호화 (이력 기록 포함)
   */
  static async decrypt(
    encryptedEmail: string,
    accessorId: string,
    accessorIp: string,
    targetMemberId: string,
    purpose: string
  ): Promise<string> {
    // 1. 복호화 수행
    const iv = Buffer.from(encryptedEmail.slice(0, 32), 'hex');
    const authTag = Buffer.from(encryptedEmail.slice(32, 64), 'hex');
    const encrypted = encryptedEmail.slice(64);

    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    // 2. 복호화 이력 기록
    await prisma.emailAccessLog.create({
      data: {
        accessorId,
        accessorIp,
        targetMemberId,
        deviceType: this.detectDeviceType(accessorIp), // User-Agent 분석
        purpose,
      },
    });

    return decrypted;
  }
}
```

### 8.2 JWT 인증/인가

#### 토큰 생성
```typescript
// api/src/features/auth/auth.service.ts
import jwt from 'jsonwebtoken';

interface TokenPayload {
  memberId: string;
  memberType: string;
}

export class AuthService {
  /**
   * Access Token 생성 (15분)
   */
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '15m',
    });
  }

  /**
   * Refresh Token 생성 (7일)
   */
  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
    });
  }

  /**
   * 토큰 검증
   */
  verifyToken(token: string, isRefreshToken = false): TokenPayload {
    const secret = isRefreshToken
      ? process.env.JWT_REFRESH_SECRET!
      : process.env.JWT_SECRET!;

    return jwt.verify(token, secret) as TokenPayload;
  }
}
```

#### 인증 미들웨어
```typescript
// api/src/shared/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: { code: 'AUTH_001', message: '인증이 필요합니다' }
      });
    }

    const token = authHeader.substring(7);
    const payload = authService.verifyToken(token);

    // 회원 정보 조회 및 req에 추가
    const member = await prisma.member.findUnique({
      where: { memberId: payload.memberId },
    });

    if (!member || member.status !== 'APPROVED') {
      return res.status(401).json({
        success: false,
        error: { code: 'AUTH_002', message: '유효하지 않은 사용자입니다' }
      });
    }

    req.user = member;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { code: 'AUTH_003', message: '토큰이 만료되었습니다' }
    });
  }
};
```

#### RBAC 미들웨어
```typescript
// api/src/shared/middleware/authorize.middleware.ts
export const authorize = (...allowedRoles: MemberType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'AUTH_001', message: '인증이 필요합니다' }
      });
    }

    if (!allowedRoles.includes(req.user.memberType)) {
      return res.status(403).json({
        success: false,
        error: { code: 'AUTH_004', message: '권한이 없습니다' }
      });
    }

    next();
  };
};

// 사용 예시
router.get(
  '/admin/members',
  authenticate,
  authorize('ADMIN'),
  memberController.getMembers
);
```

### 8.3 보안 미들웨어

```typescript
// api/src/core/app.ts
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

const app = express();

// Helmet (보안 헤더)
app.use(helmet());

// CORS
app.use(cors({
  origin: [
    'http://localhost:3000', // Admin Dev
    'http://localhost:8000', // Web Dev
    'https://www.polibat.com',
    'https://admin.polibat.com',
  ],
  credentials: true,
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 최대 100 요청
  message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
});
app.use('/api', limiter);

// 로그인 Rate Limiting (더 엄격)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: '로그인 시도 횟수를 초과했습니다. 15분 후 다시 시도해주세요.',
});
app.use('/api/v1/auth/login', loginLimiter);
```

---

## 9. AI 기능 구현

### 9.1 AI 서비스 아키텍처

```
[API Server]
    ↓
[AI Service] (독립 마이크로서비스 또는 모듈)
    ↓
┌────────────┬──────────────┬───────────────┐
│ OpenAI API │  Claude API  │ Self-hosted   │
│ (GPT-4o)   │ (Haiku/Sonnet)│  (HF Models) │
└────────────┴──────────────┴───────────────┘
    ↓
[Vector DB] (Pinecone/Weaviate)
[Redis Cache] (24시간 캐시)
```

### 9.2 MVP 기능 (즉시 구현)

#### 1. AI 3줄 요약

```typescript
// api/src/features/ai/ai.service.ts
import OpenAI from 'openai';

export class AiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * 게시글 3줄 요약 생성
   */
  async generateSummary(post: Post): Promise<string> {
    // 1. 캐시 확인
    const cached = await redis.get(`ai:summary:${post.id}`);
    if (cached) return cached;

    // 2. AI 요약 생성
    const prompt = `
다음 게시글을 3줄로 요약해주세요. 핵심 내용과 주요 의견을 포함하세요.

제목: ${post.title}
내용: ${post.content}

요약:
    `.trim();

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini', // 비용 효율적
      messages: [
        { role: 'system', content: '당신은 정치 게시글을 요약하는 전문가입니다.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.3,
    });

    const summary = response.choices[0].message.content?.trim() || '';

    // 3. 캐시 저장 (24시간)
    await redis.setex(`ai:summary:${post.id}`, 86400, summary);

    // 4. DB 저장
    await prisma.post.update({
      where: { id: post.id },
      data: { aiSummary: summary },
    });

    return summary;
  }
}
```

#### 2. AI 온도계 (감정 분석)

```typescript
// api/src/features/ai/sentiment.service.ts
import { pipeline } from '@huggingface/transformers';

export class SentimentService {
  private classifier: any;

  async initialize() {
    // 경량 한국어 감정 분석 모델
    this.classifier = await pipeline(
      'sentiment-analysis',
      'snunlp/KR-FinBert-SC'
    );
  }

  /**
   * 게시글 + 댓글 감정 분석
   */
  async analyzePostSentiment(postId: string): Promise<SentimentAnalysis> {
    // 1. 게시글 및 댓글 조회
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { comments: true },
    });

    if (!post) throw new Error('게시글을 찾을 수 없습니다');

    // 2. 모든 텍스트 분석
    const texts = [post.content, ...post.comments.map(c => c.content)];
    const results = await Promise.all(
      texts.map(text => this.classifier(text))
    );

    // 3. 결과 집계
    let positive = 0;
    let negative = 0;
    let neutral = 0;

    results.forEach(result => {
      const label = result[0].label.toLowerCase();
      if (label.includes('positive')) positive++;
      else if (label.includes('negative')) negative++;
      else neutral++;
    });

    const total = results.length;

    return {
      positive: (positive / total) * 100,
      negative: (negative / total) * 100,
      neutral: (neutral / total) * 100,
      score: ((positive - negative) / total), // -1 ~ +1
      temperature: this.calculateTemperature(positive, negative, neutral),
    };
  }

  /**
   * 온도 계산 (시각화용)
   */
  private calculateTemperature(pos: number, neg: number, neu: number): number {
    // 긍정 많으면 뜨거움 (100), 부정 많으면 차가움 (0)
    const total = pos + neg + neu;
    return Math.round(((pos - neg) / total + 1) * 50);
  }
}
```

### 9.3 중기 기능 (3-6개월)

#### 3. 오늘의 정치 AI 브리핑

```typescript
// api/src/features/ai/briefing.service.ts
export class BriefingService {
  /**
   * 일일 정치 뉴스 브리핑 생성
   */
  async generateDailyBriefing(): Promise<Briefing> {
    // 1. 주요 정치 뉴스 크롤링
    const news = await this.crawlNews();

    // 2. 중요도 분석 (AI)
    const rankedNews = await this.rankNewsByImportance(news);

    // 3. 상위 5개 선택 및 요약
    const topNews = rankedNews.slice(0, 5);
    const summaries = await Promise.all(
      topNews.map(article => this.summarizeArticle(article))
    );

    // 4. 전체 브리핑 생성
    const briefing = await this.composeBriefing(summaries);

    // 5. DB 저장
    await prisma.briefing.create({
      data: {
        date: new Date(),
        content: briefing,
        sources: topNews.map(n => n.url),
      },
    });

    return briefing;
  }

  /**
   * 크론잡으로 매일 아침 6시 실행
   */
  @Cron('0 6 * * *')
  async scheduleDailyBriefing() {
    await this.generateDailyBriefing();
    // 팀즈 웹훅 알림
    await this.notifyTeams();
  }
}
```

#### 4. 정치인 글 작성 지원

```typescript
// api/src/features/ai/writing-assistant.service.ts
export class WritingAssistantService {
  /**
   * 관련 여론 데이터 인사이트 제공
   */
  async getInsights(topic: string): Promise<WritingInsights> {
    // 1. 관련 게시글 검색
    const relatedPosts = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: topic } },
          { content: { contains: topic } },
        ],
        boardType: 'POLIBAT',
      },
      include: { comments: true, likes: true },
    });

    // 2. 감정 분석
    const sentiments = await Promise.all(
      relatedPosts.map(post =>
        this.sentimentService.analyzePostSentiment(post.id)
      )
    );

    // 3. 주요 키워드 추출
    const keywords = await this.extractKeywords(relatedPosts);

    // 4. 요청 사항 추출
    const requests = await this.extractRequests(relatedPosts);

    return {
      totalPosts: relatedPosts.length,
      averageSentiment: this.calculateAverageSentiment(sentiments),
      topKeywords: keywords.slice(0, 10),
      commonRequests: requests.slice(0, 5),
      recommendedTone: this.recommendTone(sentiments),
    };
  }
}
```

### 9.4 비용 최적화 전략

```typescript
// api/src/features/ai/cost-optimizer.ts
export class AiCostOptimizer {
  /**
   * 모델 선택 로직
   */
  selectModel(task: AiTask): AiModel {
    switch (task.type) {
      case 'summary':
        return 'gpt-4o-mini'; // 저렴하고 빠름

      case 'sentiment':
        return 'self-hosted'; // Hugging Face Transformers

      case 'complex-analysis':
        return 'gpt-4o'; // 복잡한 작업

      default:
        return 'gpt-4o-mini';
    }
  }

  /**
   * 캐싱 전략
   */
  async getCachedOrGenerate<T>(
    cacheKey: string,
    generator: () => Promise<T>,
    ttl: number = 86400 // 24시간
  ): Promise<T> {
    // 1. 캐시 확인
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // 2. 생성
    const result = await generator();

    // 3. 캐시 저장
    await redis.setex(cacheKey, ttl, JSON.stringify(result));

    return result;
  }

  /**
   * 배치 처리
   */
  async batchProcess(tasks: AiTask[]): Promise<void> {
    // 비급한 작업은 큐에 추가
    await queue.addBulk(tasks.map(task => ({
      name: 'ai-task',
      data: task,
      opts: {
        priority: task.priority,
        delay: task.urgent ? 0 : 60000, // 1분 지연
      },
    })));
  }
}
```

---

## 10. 인프라 및 배포

### 10.1 AWS 인프라 구조

```
┌─────────────────────────────────────────────────────────┐
│                    Route 53 (DNS)                        │
│              www.polibat.com / api.polibat.com          │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                 CloudFront CDN                           │
│         - 정적 파일 캐싱                                  │
│         - HTTPS 종료                                     │
│         - DDoS 방어 (AWS Shield)                         │
└────────────┬──────────────────────┬────────────────────┘
             │                       │
┌────────────▼────────┐   ┌─────────▼──────────┐
│   S3 (Static)       │   │   ALB              │
│   - Admin SPA       │   │   (Load Balancer)  │
│   - Web Static      │   └─────────┬──────────┘
│   - Images/Assets   │             │
└─────────────────────┘   ┌─────────▼──────────┐
                          │  ECS Fargate        │
                          │  (API Containers)   │
                          │  - Auto Scaling     │
                          │  - Health Check     │
                          └──┬────────┬─────────┘
                             │        │
                  ┌──────────▼───┐   │
                  │  RDS Postgres│   │
                  │  - Multi-AZ  │   │
                  │  - Auto Backup│  │
                  └──────────────┘   │
                             │        │
                  ┌──────────▼───┐   │
                  │ElastiCache   │   │
                  │  Redis       │   │
                  └──────────────┘   │
                                     │
┌────────────────────────────────────▼──────────┐
│             Support Services                   │
│  - SES (Email)                                │
│  - CloudWatch (Logs/Metrics)                  │
│  - Secrets Manager (Keys/Passwords)           │
│  - KMS (Encryption Keys)                      │
│  - ECR (Container Registry)                   │
└───────────────────────────────────────────────┘
```

> 📋 **현재 인프라 환경**: [INFRASTRUCTURE.md](./INFRASTRUCTURE.md) 참조

**설계 원칙**:
- **고가용성**: Multi-AZ 구성 (RDS, ElastiCache)
- **확장성**: Auto Scaling (ECS Fargate), CloudFront CDN
- **보안**: VPC 격리, AWS Shield, KMS 암호화, Secrets Manager
- **비용 최적화**: S3 정적 호스팅, CloudFront 캐싱, 적절한 인스턴스 크기 선택

---

## 11. 개발 로드맵

**⚠️ 상세 로드맵은 별도 문서 참조**

컨텍스트 엔지니어링 관점의 상세 개발 로드맵은 [`DEV_ROADMAP.md`](./DEV_ROADMAP.md) 파일을 참조하세요.

### 11.1 개발 로드맵 개요

**Phase 1: Foundation** (1-2개월)
- Backend 기반 구축 (Prisma, Express, JWT)
- 회원 및 게시글 관리 API
- Admin Dashboard API 연동

**Phase 2: Core Features** (2-3개월)
- 댓글, 투표, 불편/제안 시스템
- 파일 업로드 및 이메일
- AI MVP 기능 (3줄 요약, 온도계)
- Frontend Website API 연동

**Phase 3: Enhancement** (2-3개월)
- 실시간 알림 (WebSocket)
- 고급 검색 (Elasticsearch)
- AI 중기 기능 (정치 브리핑, 글 작성 지원)
- 성능 최적화

**Phase 4: Scale** (지속적)
- AI 장기 기능 (팩트체크, 연관 정보 추천)
- 다국어 지원
- 모바일 앱

**📚 상세 내용**: [`DEV_ROADMAP.md`](./DEV_ROADMAP.md) 참조

---

## 12. AS-IS vs TO-BE 비교

### 12.1 아키텍처 비교

| 항목 | AS-IS | TO-BE | 개선 효과 |
|------|-------|-------|-----------|
| **Backend** | 없음 (프론트엔드 전용) | Node.js + Express + TypeScript | 실제 데이터 처리, API 제공 |
| **Database** | localStorage (클라이언트) | PostgreSQL 16 + Redis 7 | 데이터 영속성, 동시성 제어 |
| **개발 환경** | N/A | 하이브리드 (PostgreSQL: AWS 개발 서버, Redis: Docker) | 안정성과 격리의 균형 |
| **인증** | localStorage 기반 | JWT + Refresh Token | 보안 강화, 세션 관리 |
| **상태 관리** | Local useState | Zustand + TanStack Query | 전역 상태 관리, 캐싱 |
| **타입 시스템** | 부분 TypeScript | Full TypeScript | 타입 안정성, AI 개발 효율 |
| **프로젝트 구조** | 분리된 2개 앱 | 모노레포 (Turborepo) | 코드 공유, 통합 관리 |
| **AI 기능** | 없음 | MVP + 중기 + 장기 | 차별화, 사용자 경험 향상 |

### 12.2 개발 경험 비교

| 항목 | AS-IS | TO-BE | AI 개발 효과 |
|------|-------|-------|--------------|
| **타입 추론** | 제한적 | 전체 스택 TypeScript | AI가 타입 기반 코드 생성 |
| **코드 공유** | 불가능 (중복) | @polibat/* 패키지 | 중복 제거, 일관성 |
| **API 통합** | 샘플 데이터 | 실제 API 연동 | 실제 환경 개발 가능 |
| **테스트** | 제한적 | 체계적 (Jest, RTL) | AI가 테스트 자동 생성 |
| **배포** | 수동 | CI/CD 자동화 | 배포 시간 단축, 안정성 |

### 12.3 성능 비교 (예상)

| 항목 | AS-IS | TO-BE | 개선율 |
|------|-------|-------|--------|
| **초기 로딩 시간** | 2-3초 | 1-1.5초 | 50% 개선 |
| **API 응답 시간** | N/A | <200ms | - |
| **캐싱 효율** | 없음 | Redis + CDN | 대폭 개선 |
| **동시 사용자** | 제한적 | 10,000+ | 확장성 확보 |

### 12.4 보안 비교

| 항목 | AS-IS | TO-BE | 보안 강화 |
|------|-------|-------|-----------|
| **이메일 보안** | 평문 저장 | AES-256 암호화 | 데이터 보호 |
| **인증 보안** | localStorage | JWT + HttpOnly Cookie | XSS 방지 |
| **API 보안** | 없음 | Rate Limiting + CORS | DDoS/CSRF 방지 |
| **감사 로그** | 없음 | 복호화 이력 기록 | 규제 준수 |

---

## 13. 결론

### 13.1 핵심 성과 요약

본 TO-BE 아키텍처는 다음 핵심 원칙을 달성합니다:

1. **100% 기능 동등성**: 모든 기존 UI/UX 및 비즈니스 로직 완벽 재현
2. **AI 개발 최적화**: 명확한 계층 분리, 타입 안정성, 표준화된 패턴
3. **확장 가능성**: 모노레포, 마이크로서비스 준비, 명확한 인터페이스
4. **유지보수성**: Feature-based 구조, 일관된 네이밍, 풍부한 문서

### 13.2 예상 개발 기간

- **Phase 1 (Foundation)**: 2개월
- **Phase 2 (Core Features)**: 3개월
- **Phase 3 (Enhancement)**: 3개월
- **Phase 4 (Scale)**: 지속적

**총 개발 기간**: 약 8개월 (MVP 완성 기준)

### 13.3 예상 비용

**개발 비용** (AI 에이전트 활용 시 50% 절감):
- Backend 개발: 4개월 → 2개월
- Frontend 리팩토링: 2개월 → 1개월
- AI 기능 구현: 2개월 → 1개월

**인프라 비용** (월 기준):
- AWS ECS: $100-200
- RDS PostgreSQL: $50-100
- ElastiCache Redis: $30-50
- S3 + CloudFront: $20-50
- AI API (OpenAI): $50-150

**총 월 비용**: $250-550

### 13.4 다음 단계

1. **문서 승인**: 이해관계자 검토 및 승인
2. **환경 구축**: AWS 계정, 도메인, CI/CD 설정
3. **팀 구성**: Backend 1명, Frontend 1명, DevOps 0.5명
4. **Sprint 시작**: Phase 1 Week 1 시작

---

## 14. 부록

### 14.1 용어 사전

| 용어 | 설명 |
|------|------|
| **모노레포** | 여러 프로젝트를 하나의 저장소에서 관리하는 구조 |
| **Turborepo** | 모노레포 빌드 최적화 도구 |
| **Prisma** | 타입 안전 ORM (Object-Relational Mapping) |
| **Zustand** | 경량 React 상태 관리 라이브러리 |
| **TanStack Query** | 서버 상태 관리 및 캐싱 라이브러리 |
| **JWT** | JSON Web Token, 토큰 기반 인증 방식 |
| **RBAC** | Role-Based Access Control, 역할 기반 접근 제어 |
| **ECS Fargate** | 서버리스 컨테이너 실행 환경 |
| **Vector DB** | 임베딩 벡터 저장 및 유사도 검색 데이터베이스 |

### 14.2 참고 자료

- **Prisma 공식 문서**: https://www.prisma.io/docs
- **Express 공식 문서**: https://expressjs.com
- **React 공식 문서**: https://react.dev
- **Zustand 공식 문서**: https://zustand-demo.pmnd.rs
- **TanStack Query**: https://tanstack.com/query
- **AWS ECS**: https://aws.amazon.com/ecs
- **Turborepo**: https://turbo.build/repo

### 14.3 연락처

**프로젝트 관리**: [프로젝트 관리자 정보]
**기술 문의**: [기술 리더 정보]
**문서 수정 이력**: [GitHub Repository]

---

**문서 작성**: AI Agent (Claude 3.5 Sonnet)
**최종 검토**: [검토자 이름]
**승인**: [승인자 이름]
**버전**: 1.0
**작성일**: 2025-10-11
