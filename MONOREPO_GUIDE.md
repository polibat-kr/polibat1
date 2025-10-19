# Turborepo 모노레포 가이드

## 개요

정치방망이 프로젝트는 Turborepo 기반 모노레포로 구성되어 있습니다.

## 프로젝트 구조

```
/polibat
├── /apps
│   ├── /admin              # Admin Dashboard (React)
│   ├── /web                # Frontend Website (HTML/JS)
│   └── /api                # Backend API Server
├── /packages
│   ├── /types              # 공유 TypeScript 타입
│   ├── /constants          # 공유 상수
│   └── /utils              # 공유 유틸리티
├── turbo.json              # Turborepo 설정
├── package.json            # 루트 package.json
└── tsconfig.json           # 루트 TypeScript 설정
```

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 시작

```bash
# 모든 앱 동시 실행
npm run dev

# 개별 앱 실행
cd apps/admin && npm run dev  # Port 3000
cd apps/web && npm run dev    # Port 8000
cd apps/api && npm run dev    # Port 4000
```

### 3. 빌드

```bash
# 모든 앱 빌드
npm run build

# 개별 앱 빌드
cd apps/admin && npm run build
```

## 공유 패키지 사용법

### @polibat/types

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

### @polibat/constants

```typescript
import { ID_PREFIXES, MEMBER_STATUS } from '@polibat/constants';

const prefix = ID_PREFIXES.NORMAL_MEMBER; // 'NM'
const status = MEMBER_STATUS.APPROVED; // '승인'
```

### @polibat/utils

```typescript
import { IdGenerator, DateUtils } from '@polibat/utils';

// ID 생성
const newId = IdGenerator.generate('NM', 123); // 'NM000124'

// 날짜 포맷
const formatted = DateUtils.formatBoardDate(new Date());
```

## 주요 명령어

```bash
npm run dev          # 모든 앱 개발 서버 시작
npm run build        # 모든 앱 빌드
npm run test         # 모든 앱 테스트 실행
npm run lint         # 린트 검사
npm run type-check   # TypeScript 타입 검사
npm run clean        # 빌드 결과물 정리
```

## 새 패키지 추가

### 1. packages 디렉토리에 새 패키지 생성

```bash
mkdir -p packages/새패키지/src
```

### 2. package.json 생성

```json
{
  "name": "@polibat/새패키지",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}
```

### 3. Apps에서 사용

```json
{
  "dependencies": {
    "@polibat/새패키지": "workspace:*"
  }
}
```

## 문제 해결

### 의존성 문제

```bash
# 모든 node_modules 삭제 및 재설치
npm run clean
rm -rf node_modules
npm install
```

### 빌드 캐시 문제

```bash
# Turbo 캐시 삭제
rm -rf .turbo
npm run clean
npm run build
```

## 참고 문서

- [Turborepo 공식 문서](https://turbo.build/repo)
- [TO-BE-ARCHITECTURE.md](./TO-BE-ARCHITECTURE.md)
- [README.md](./README.md)
