# Windows PostgreSQL 설정 가이드

## ⚠️ 레거시 문서

**주의**: 이 문서는 레거시 문서입니다. 현재는 **원격 PostgreSQL 16 서버** (43.201.115.132)를 사용합니다.

## 📋 개요

Docker PostgreSQL 대신 Windows 로컬 PostgreSQL 18을 사용하도록 전환하는 가이드입니다.
(현재는 사용하지 않음 - 참고용으로만 보관)

---

## ✅ 전제 조건

- ✅ Windows PostgreSQL 18 설치 완료 (C:\Program Files\PostgreSQL\18)
- ✅ PostgreSQL 서비스 실행 중
- ✅ postgres 슈퍼유저 비밀번호 확인

---

## 🚀 설정 방법

### 방법 1: PowerShell 자동화 스크립트 (권장)

```powershell
# PowerShell을 관리자 권한으로 실행
cd C:\polibat
.\scripts\setup-windows-db.ps1
```

**실행 시 postgres 비밀번호 입력 필요**

스크립트가 자동으로 다음 작업을 수행합니다:
1. polibat 데이터베이스 생성
2. polibat 사용자 생성 (비밀번호: polibat_dev_password)
3. 권한 부여

---

### 방법 2: 수동 설정 (PowerShell)

#### 1단계: PostgreSQL 서비스 확인

```powershell
Get-Service -Name *postgresql*
```

**예상 출력**:
```
Status   Name               DisplayName
------   ----               -----------
Running  postgresql-x64-18  postgresql-x64-18
```

#### 2단계: 데이터베이스 및 사용자 생성

```powershell
# PostgreSQL 접속 (postgres 비밀번호 입력 필요)
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres

# PostgreSQL 프롬프트에서 아래 SQL 명령어 실행
```

```sql
-- 데이터베이스 생성
CREATE DATABASE polibat_dev;

-- 사용자 생성
CREATE USER polibat WITH PASSWORD 'polibat_dev_password';

-- 권한 부여
GRANT ALL PRIVILEGES ON DATABASE polibat_dev TO polibat;
GRANT ALL ON SCHEMA public TO polibat;

-- 확인
\l
\du

-- 종료
\q
```

#### 3단계: 연결 테스트

```powershell
# polibat 사용자로 접속 테스트
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U polibat -d polibat_dev
# 비밀번호: polibat_dev_password

# PostgreSQL 프롬프트가 나타나면 성공!
# polibat_dev=>
```

---

## 📊 Prisma 마이그레이션 실행

### 1. Prisma Client 생성

```powershell
cd C:\polibat\apps\api
npx prisma generate
```

### 2. 마이그레이션 SQL 적용

마이그레이션 SQL 파일이 이미 생성되어 있습니다: `C:\polibat\migration_windows.sql`

```powershell
# 방법 A: psql로 직접 적용
Get-Content C:\polibat\migration_windows.sql | & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U polibat -d polibat_dev
# 비밀번호: polibat_dev_password

# 방법 B: PowerShell에서 환경 변수 사용
$env:PGPASSWORD = "polibat_dev_password"
Get-Content C:\polibat\migration_windows.sql | & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U polibat -d polibat_dev
Remove-Item Env:\PGPASSWORD
```

### 3. 테이블 생성 확인

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U polibat -d polibat_dev -c "\dt"
```

**예상 출력**: 15개 테이블 목록
```
             List of relations
 Schema |         Name          | Type  | Owner
--------+-----------------------+-------+--------
 public | banners               | table | polibat
 public | comments              | table | polibat
 public | member_status_history | table | polibat
 public | members               | table | polibat
 public | notices               | table | polibat
 public | policies              | table | polibat
 public | policy_templates      | table | polibat
 public | popups                | table | polibat
 public | posts                 | table | polibat
 public | reactions             | table | polibat
 public | reports               | table | polibat
 public | suggestions           | table | polibat
 public | vote_options          | table | polibat
 public | vote_participants     | table | polibat
 public | votes                 | table | polibat
(15 rows)
```

---

## ✅ 최종 확인

### 1. API 서버 실행 테스트

```powershell
cd C:\polibat\apps\api
npm run dev
```

**예상 출력**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 정치방망이(PoliBAT) API Server Starting...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ PostgreSQL connected successfully (Windows 로컬)
✅ Redis connected successfully (Docker)
✅ Server is running!
🌐 Server URL: http://localhost:4000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 2. Health Check

```powershell
curl http://localhost:4000/health
```

---

## 🔄 롤백 (Docker PostgreSQL로 복귀)

문제 발생 시 Docker PostgreSQL로 롤백:

```powershell
# 1. docker-compose.yml에서 PostgreSQL 주석 해제
# 2. .env 수정
# DATABASE_URL=postgresql://polibat:polibat_dev_password@127.0.0.1:5432/polibat_dev

# 3. Docker PostgreSQL 재시작
docker compose up -d postgres

# 4. API 서버 재시작
cd apps/api
npm run dev
```

---

## 🛠️ 트러블슈팅

### PostgreSQL 서비스가 실행되지 않는 경우

```powershell
# 서비스 시작
Start-Service postgresql-x64-18

# 서비스 상태 확인
Get-Service postgresql-x64-18
```

### 포트 5432가 사용 중인 경우

```powershell
# 포트 사용 확인
netstat -ano | findstr :5432

# Docker PostgreSQL이 아직 실행 중이면 중지
docker compose stop postgres
```

### "psql: error: connection to server" 오류

```powershell
# pg_hba.conf 확인 (C:\Program Files\PostgreSQL\18\data\pg_hba.conf)
# 다음 라인이 있는지 확인:
# host    all             all             127.0.0.1/32            scram-sha-256
# host    all             all             ::1/128                 scram-sha-256

# PostgreSQL 재시작
Restart-Service postgresql-x64-18
```

### Prisma 연결 오류

```powershell
# .env 파일 확인
Get-Content apps\api\.env | Select-String "DATABASE_URL"

# 올바른 형식:
# DATABASE_URL=postgresql://polibat:polibat_dev_password@localhost:5432/polibat_dev
```

---

## 📚 참고 자료

- [PostgreSQL 18 공식 문서](https://www.postgresql.org/docs/18/)
- [Prisma 마이그레이션](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [프로젝트 README](./README.md)
- [개발 로드맵](./DEV_ROADMAP.md)

---

**문서 작성일**: 2025-10-19
**프로젝트**: 정치방망이(PoliBAT)
