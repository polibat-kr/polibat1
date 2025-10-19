# 정치방망이(PoliBAT) 개발 환경 설정 가이드

## 📋 목차

1. [필수 요구사항](#1-필수-요구사항)
2. [프로젝트 설치](#2-프로젝트-설치)
3. [데이터베이스 설정](#3-데이터베이스-설정)
4. [Redis 설정](#4-redis-설정)
5. [환경 변수 설정](#5-환경-변수-설정)
6. [API 서버 실행](#6-api-서버-실행)
7. [테스트](#7-테스트)
8. [트러블슈팅](#8-트러블슈팅)

---

## 1. 필수 요구사항

### 소프트웨어

- **Node.js**: v18 이상 (LTS 권장)
- **npm**: v9 이상
- **PostgreSQL**: v15 이상
- **Redis**: v7 이상
- **Git**: 최신 버전

### 권장 도구

- **Docker Desktop**: 로컬 개발 환경 (선택)
- **VS Code**: 추천 에디터
- **Postman** 또는 **Insomnia**: API 테스트

---

## 2. 프로젝트 설치

### 2.1 저장소 클론

```powershell
git clone <repository-url>
cd polibat
```

### 2.2 의존성 설치

```powershell
# 루트에서 모든 패키지 설치
npm install

# API 서버 패키지 설치
cd apps/api
npm install
```

---

## 3. 데이터베이스 설정

### Windows PostgreSQL 18 (현재 사용 중)

**전제 조건**: PostgreSQL 18이 Windows에 설치되어 있어야 합니다.

**상세 설정 가이드**: [SETUP_WINDOWS_POSTGRESQL.md](./SETUP_WINDOWS_POSTGRESQL.md)

**빠른 설정**:

```powershell
# 1. PowerShell 자동화 스크립트 실행
cd C:\polibat
.\scripts\setup-windows-db.ps1

# 2. 또는 수동 설정
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres

# PostgreSQL 프롬프트에서:
CREATE DATABASE polibat_dev;
CREATE USER polibat WITH PASSWORD 'polibat_dev_password';
GRANT ALL PRIVILEGES ON DATABASE polibat_dev TO polibat;
GRANT ALL ON SCHEMA public TO polibat;
\q
```

**접속 정보**:
- Host: localhost
- Port: 5432
- Database: polibat_dev
- Username: polibat
- Password: polibat_dev_password

### 3.1 Prisma 마이그레이션

```powershell
cd apps/api

# Prisma 클라이언트 생성
npx prisma generate

# 마이그레이션 SQL 적용 (Windows PostgreSQL)
$env:PGPASSWORD = "polibat_dev_password"
Get-Content C:\polibat\migration_windows.sql | & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U polibat -d polibat_dev
Remove-Item Env:\PGPASSWORD

# 테이블 생성 확인
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U polibat -d polibat_dev -c "\dt"

# Prisma Studio 실행 (선택)
npx prisma studio
```

---

## 4. Redis 설정

### Docker Redis (현재 사용 중)

```powershell
# Docker Compose로 Redis 실행
docker compose up -d redis

# Redis 상태 확인
docker exec -it polibat-redis redis-cli -a polibat_redis_password PING
# 응답: PONG
```

**접속 정보**:
- Host: localhost
- Port: 6379
- Password: polibat_redis_password

**참고**: [Redis Docker 가이드](./README.docker.md)

---

## 5. 환경 변수 설정

### 5.1 .env 파일 확인

`apps/api/.env` 파일이 자동 생성되어 있습니다:

```env
# Database
DATABASE_URL="postgresql://polibat:polibat_dev_password@localhost:5432/polibat_dev"

# Redis
REDIS_URL="redis://:polibat_redis_password@localhost:6379"

# JWT (개발용)
JWT_SECRET="dev-secret-key-please-change-in-production-12345678"
JWT_REFRESH_SECRET="dev-refresh-secret-key-please-change-in-production-87654321"

# Server
PORT=4000
NODE_ENV=development
```

⚠️ **주의**: 프로덕션 환경에서는 반드시 보안 키를 변경하세요!

### 5.2 환경 변수 검증

```powershell
cd apps/api
npm run type-check
```

---

## 6. API 서버 실행

### 6.1 개발 모드 실행

```powershell
cd apps/api
npm run dev
```

**서버 시작 확인**:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 정치방망이(PoliBAT) API Server Starting...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ PostgreSQL connected successfully
✅ Redis connected successfully
✅ Server is running!
🌐 Server URL: http://localhost:4000
🏥 Health Check: http://localhost:4000/health
📚 API Info: http://localhost:4000/api
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 6.2 Health Check

```powershell
# PowerShell
Invoke-WebRequest http://localhost:4000/health

# 또는 브라우저에서
http://localhost:4000/health
```

**예상 응답**:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2025-10-19T...",
    "uptime": 12.345,
    "environment": "development"
  }
}
```

---

## 7. 테스트

### 7.1 인증 API 테스트

#### 회원가입

```powershell
# PowerShell
Invoke-WebRequest -Uri http://localhost:4000/api/auth/signup `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test@example.com","password":"Test1234!@#","nickname":"테스트유저","memberType":"NORMAL"}'
```

#### 로그인

```powershell
Invoke-WebRequest -Uri http://localhost:4000/api/auth/login `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test@example.com","password":"Test1234!@#"}'
```

#### 현재 사용자 정보

```powershell
$accessToken = "your-access-token-here"
Invoke-WebRequest -Uri http://localhost:4000/api/auth/me `
  -Headers @{ "Authorization" = "Bearer $accessToken" }
```

#### 로그아웃

```powershell
Invoke-WebRequest -Uri http://localhost:4000/api/auth/logout `
  -Method POST `
  -Headers @{ "Authorization" = "Bearer $accessToken" }
```

### 7.2 Redis 토큰 확인

```powershell
# Redis에 저장된 Refresh Token 확인
docker exec -it polibat-redis redis-cli -a polibat_redis_password KEYS 'refresh:*'

# 특정 사용자의 Refresh Token 조회
docker exec -it polibat-redis redis-cli -a polibat_redis_password GET 'refresh:<user-id>'
```

---

## 8. 트러블슈팅

### 8.1 데이터베이스 연결 실패

**증상**: `Error: connect ECONNREFUSED ::1:5432`

**해결 방법**:

```powershell
# PostgreSQL이 실행 중인지 확인
docker compose ps

# PostgreSQL 로그 확인
docker compose logs postgres

# PostgreSQL 재시작
docker compose restart postgres
```

### 8.2 Redis 연결 실패

**증상**: `Redis 연결 실패`

**해결 방법**:

```powershell
# Redis가 실행 중인지 확인
docker compose ps

# Redis 재시작
docker compose restart redis

# Redis 접속 테스트
docker exec -it polibat-redis redis-cli -a polibat_redis_password PING
```

### 8.3 Prisma 마이그레이션 오류

**증상**: `Migration failed`

**해결 방법**:

```powershell
# 1. 데이터베이스 초기화 (주의: 모든 데이터 삭제)
docker compose down -v
docker compose up -d postgres

# 2. Prisma 재설정
cd apps/api
npm run prisma:generate
npm run prisma:migrate
```

### 8.4 포트 충돌

**증상**: `Error: listen EADDRINUSE: address already in use :::4000`

**해결 방법**:

```powershell
# 포트 사용 중인 프로세스 확인 (PowerShell)
netstat -ano | findstr :4000

# 프로세스 종료 (PID 확인 후)
taskkill /PID <PID> /F

# 또는 .env에서 다른 포트로 변경
PORT=4001
```

### 8.5 npm install 실패

**증상**: `npm ERR! code ERESOLVE`

**해결 방법**:

```powershell
# node_modules 삭제 후 재설치
rm -r node_modules
rm package-lock.json
npm install

# 또는 강제 설치
npm install --legacy-peer-deps
```

---

## 🎯 다음 단계

1. ✅ 개발 환경 설정 완료
2. ⏳ 게시글 관리 API 구현
3. ⏳ 댓글 시스템 구현
4. ⏳ 투표 시스템 구현

자세한 개발 로드맵은 `DEV_ROADMAP.md`를 참조하세요.

---

## 📚 추가 문서

- [Docker 사용 가이드](./README.docker.md)
- [API 명세서](./API-SPEC.md)
- [개발 로드맵](./DEV_ROADMAP.md)
- [아키텍처 문서](./TO-BE-ARCHITECTURE.md)

---

**문서 업데이트**: 2025-10-19
**프로젝트**: 정치방망이(PoliBAT)
