# Redis Docker 환경 가이드

## 개요

정치방망이(PoliBAT) 프로젝트의 Redis 캐시 서버를 Docker Compose로 구성합니다.

**참고**: PostgreSQL은 Windows 로컬 환경을 사용합니다. [Windows PostgreSQL 설정 가이드](./SETUP_WINDOWS_POSTGRESQL.md)를 참조하세요.

## 서비스 구성

- **PostgreSQL 18**: Windows 로컬 환경 (C:\Program Files\PostgreSQL\18)
- **Redis 7**: Docker 컨테이너 (세션 관리 및 캐싱)

## 시작하기

### 1. Docker 설치 확인

```powershell
docker --version
docker-compose --version
```

### 2. Redis 서비스 시작

```powershell
# Redis 서비스 시작 (백그라운드)
docker-compose up -d redis

# 로그 확인
docker-compose logs -f redis

# 상태 확인
docker-compose ps
```

### 3. 서비스 상태 확인

```powershell
# 실행 중인 컨테이너 확인
docker-compose ps

# 헬스체크 상태 확인
docker ps
```

### 4. 서비스 중지

```powershell
# 모든 서비스 중지 (데이터 유지)
docker-compose stop

# 모든 서비스 중지 및 삭제 (데이터는 유지)
docker-compose down

# 모든 서비스 및 볼륨 삭제 (데이터 완전 삭제)
docker-compose down -v
```

## 접속 정보

### PostgreSQL (Windows 로컬)
- **Host**: localhost
- **Port**: 5432
- **Database**: polibat_dev
- **Username**: polibat
- **Password**: polibat_dev_password
- **설정 가이드**: [SETUP_WINDOWS_POSTGRESQL.md](./SETUP_WINDOWS_POSTGRESQL.md)

### Redis (Docker)
- **Host**: localhost
- **Port**: 6379
- **Password**: polibat_redis_password

## 유용한 명령어

### PostgreSQL (Windows 로컬)

```powershell
# PostgreSQL 접속
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U polibat -d polibat_dev

# 데이터베이스 백업
& "C:\Program Files\PostgreSQL\18\bin\pg_dump.exe" -U polibat polibat_dev > backup.sql

# 데이터베이스 복원
Get-Content backup.sql | & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U polibat polibat_dev

# 테이블 목록 확인
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U polibat -d polibat_dev -c "\dt"
```

### Redis (Docker)

```powershell
# Redis 컨테이너 접속
docker exec -it polibat-redis redis-cli -a polibat_redis_password

# Redis 모든 키 확인
docker exec -it polibat-redis redis-cli -a polibat_redis_password KEYS '*'

# Redis 특정 키 확인
docker exec -it polibat-redis redis-cli -a polibat_redis_password GET key_name

# Redis 캐시 초기화
docker exec -it polibat-redis redis-cli -a polibat_redis_password FLUSHALL
```

## 트러블슈팅

### 포트 충돌

이미 5432 또는 6379 포트를 사용 중인 경우:

1. 기존 서비스 중지
2. docker-compose.yml에서 포트 변경
3. .env 파일의 DATABASE_URL, REDIS_URL 업데이트

### 컨테이너 재시작

```powershell
# 특정 서비스 재시작
docker-compose restart postgres
docker-compose restart redis

# 모든 서비스 재시작
docker-compose restart
```

### 로그 확인

```powershell
# 실시간 로그
docker-compose logs -f

# 최근 100줄만
docker-compose logs --tail=100

# 타임스탬프 포함
docker-compose logs -t
```

### 완전 초기화

```powershell
# 1. 모든 컨테이너 및 볼륨 삭제
docker-compose down -v

# 2. 이미지 삭제 (선택사항)
docker rmi postgres:15-alpine redis:7-alpine

# 3. 재시작
docker-compose up -d
```

## 다음 단계

1. ✅ Docker Compose 설정 완료
2. ⏳ Prisma 마이그레이션 실행: `npm run prisma:migrate`
3. ⏳ API 서버 시작: `npm run dev`
4. ⏳ 인증 API 테스트

---

**문서 업데이트**: 2025-10-19
**프로젝트**: 정치방망이(PoliBAT)
