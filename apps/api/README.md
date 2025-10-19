# @polibat/api - Backend API Server

정치방망이(PoliBAT) Backend API 서버입니다.

## 기술 스택

- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js 4.x
- **Language**: TypeScript 5.x
- **ORM**: Prisma 5.x
- **Database**: PostgreSQL 15
- **Cache**: Redis 7.x
- **Validation**: Zod

## 시작하기

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env

# Prisma 스키마 생성
npm run prisma:generate

# 데이터베이스 마이그레이션
npm run prisma:migrate

# 개발 서버 시작
npm run dev
```

## 프로젝트 구조

```
/src
├── /features          # Feature-based 구조
│   ├── /members       # 회원 관리
│   ├── /posts         # 게시글 관리
│   ├── /votes         # 투표 관리
│   └── /auth          # 인증/인가
├── /shared            # 공유 리소스
│   ├── /middleware    # Express 미들웨어
│   ├── /utils         # 유틸리티 함수
│   └── /config        # 설정 파일
├── /core              # 앱 초기화
│   ├── app.ts         # Express 앱 설정
│   ├── server.ts      # HTTP 서버
│   └── database.ts    # 데이터베이스 연결
└── /prisma
    ├── schema.prisma  # Prisma 스키마
    └── /migrations    # 마이그레이션 파일
```

## API 문서

API 엔드포인트 문서는 `TO-BE-ARCHITECTURE.md` 파일을 참고하세요.

- **Base URL**: `http://localhost:4000/api/v1`
- **인증**: JWT Bearer Token

## 환경 변수

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/polibat

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# Encryption
ENCRYPTION_KEY=your-encryption-key

# Port
PORT=4000
```

## 개발 가이드

- Feature-based 구조를 따릅니다
- 각 feature는 독립적으로 개발 가능해야 합니다
- 공유 타입은 `@polibat/types` 패키지를 사용합니다
- 상수는 `@polibat/constants` 패키지를 사용합니다
