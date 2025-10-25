# 정치방망이(PoliBAT) 인프라 현황

**최종 업데이트**: 2025-10-25
**버전**: 1.1

---

## 📋 개요

본 문서는 정치방망이 프로젝트의 현재 인프라 구성 상태를 요약합니다.

---

## 1. 개발 환경 (Development)

### 1.0 EC2 개발 서버 (Ubuntu 24.04 LTS)

**서버 정보**:
- **호스트**: 43.201.115.132
- **OS**: Ubuntu 24.04 LTS
- **사용자**: ubuntu
- **접속 방식**: SSH (PEM 키 인증)
- **PEM 파일 위치**: `./keys/polibat-dev.pem`
- **상태**: ✅ 운영 중

#### 설치 완료된 소프트웨어

**1. PostgreSQL 16**
- **포트**: 5432
- **상태**: ✅ 정상 실행 중
- **용도**: 개발 환경 메인 데이터베이스
- **접속 정보**:
  - 데이터베이스: `polibat`
  - 사용자: `polibat`
  - 비밀번호: `Vhfflqpt183!`

**2. Nginx**
- **포트**: 80 (HTTP), 443 (HTTPS)
- **상태**: ✅ 정상 실행 중
- **SSL**: 설정 완료
- **용도**: 리버스 프록시, 정적 파일 서빙

**3. Node.js**
- **버전**: 20.19.5 LTS
- **설치 방식**: NVM (Node Version Manager)
- **상태**: ✅ 설치 완료
- **용도**: API 서버 실행 환경

**4. PM2**
- **버전**: 6.0.8
- **상태**: ✅ 설치 완료 (현재 프로세스 없음)
- **용도**: Node.js 프로세스 관리 및 자동 재시작

#### 설치 필요한 소프트웨어

**1. Redis 7**
- **상태**: ❌ 설치 필요
- **권장 포트**: 6379
- **용도**:
  - JWT Refresh Token 저장
  - API 캐싱
  - Rate Limiting
  - 세션 관리
- **설치 방법**:
  ```bash
  # Ubuntu 24.04에서 Redis 설치
  sudo apt update
  sudo apt install redis-server -y
  sudo systemctl enable redis-server
  sudo systemctl start redis-server

  # Redis 비밀번호 설정
  sudo nano /etc/redis/redis.conf
  # requirepass polibat_redis_password 추가
  sudo systemctl restart redis-server
  ```

**2. Certbot (Let's Encrypt SSL)**
- **상태**: ❌ 설치 필요
- **용도**: SSL 인증서 자동 갱신
- **설치 방법**:
  ```bash
  sudo apt install certbot python3-certbot-nginx -y
  sudo certbot --nginx -d yourdomain.com
  ```

**3. API 서버 배포**
- **상태**: ❌ 배포 필요
- **포트**: 4000
- **실행 방식**: PM2로 관리
- **배포 방법**:
  ```bash
  # 코드 업로드 (Git 또는 SCP)
  cd /var/www/polibat
  git clone <repository>

  # 의존성 설치
  cd apps/api
  npm install
  npm run build

  # PM2로 실행
  pm2 start dist/main.js --name polibat-api
  pm2 save
  pm2 startup
  ```

**4. Admin Dashboard 배포**
- **상태**: ❌ 배포 필요
- **포트**: 3000 (개발) / Nginx 프록시 (운영)
- **실행 방식**: PM2 또는 정적 빌드
- **배포 방법**:
  ```bash
  # 빌드
  cd apps/admin
  npm install
  npm run build

  # PM2로 실행 (개발 서버)
  pm2 start "npm start" --name polibat-admin

  # 또는 정적 파일로 Nginx에서 서빙
  sudo cp -r build/* /var/www/html/admin/
  ```

#### 환경 변수 (.env)

**로컬 개발 환경**:
```bash
# EC2 Development Server
EC2_HOST=43.201.115.132
EC2_USER=ubuntu
EC2_KEY_PATH=./keys/polibat-dev.pem
EC2_OS=Ubuntu 24.04 LTS

# PostgreSQL (EC2 서버)
DATABASE_URL=postgresql://polibat:Vhfflqpt183!@43.201.115.132:5432/polibat

# Redis (설치 후)
REDIS_URL=redis://:polibat_redis_password@43.201.115.132:6379
```

#### 보안 설정

**방화벽 (UFW)**:
```bash
# 현재 열려있는 포트 (추정)
22   - SSH
80   - HTTP (Nginx)
443  - HTTPS (Nginx)
5432 - PostgreSQL
6379 - Redis (설치 후 개방 필요)
4000 - API Server (배포 후 개방 필요)
```

**보안 권장 사항**:
1. SSH 키 기반 인증만 허용 (비밀번호 인증 비활성화)
2. PostgreSQL은 특정 IP만 접근 허용
3. Redis는 비밀번호 설정 및 로컬호스트만 접근
4. Nginx에서 API 서버로 프록시 (직접 노출 방지)
5. SSL 인증서 자동 갱신 설정 (Certbot)

---

### 1.1 하이브리드 환경 구성

**구성 전략**: PostgreSQL 원격 서버 + Redis 로컬 Docker

#### PostgreSQL 16 (원격 서버)
- **호스트**: 43.201.115.132
- **포트**: 5432
- **데이터베이스**: `polibat`
- **사용자**: `polibat`
- **버전**: PostgreSQL 16
- **상태**: ✅ 정상 운영 중
- **용도**:
  - 개발 환경 메인 데이터베이스
  - Prisma 마이그레이션 실행
  - 팀 공유 데이터베이스

**선택 이유**:
- Prisma migrate 안정성 (Docker PostgreSQL 18 호환성 이슈 회피)
- 팀 간 데이터 공유 용이
- 원격 서버로 격리된 환경 제공

#### Redis 7 (로컬 Docker)
- **호스트**: localhost
- **포트**: 6379
- **비밀번호**: `polibat_redis_password`
- **컨테이너명**: `polibat-redis`
- **이미지**: `redis:7-alpine`
- **상태**: ✅ 정상 운영 중
- **용도**:
  - JWT Refresh Token 저장
  - API 캐싱
  - Rate Limiting
  - 세션 관리

**Docker Compose 설정**:
```yaml
services:
  redis:
    image: redis:7-alpine
    container_name: polibat-redis
    command: redis-server --requirepass polibat_redis_password
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
```

#### 환경 변수 (.env)
```bash
# PostgreSQL (원격 서버)
DATABASE_URL=postgresql://polibat:Vhfflqpt183!@43.201.115.132:5432/polibat

# Redis (로컬 Docker)
REDIS_URL=redis://:polibat_redis_password@localhost:6379

# JWT
JWT_SECRET=dev-secret-key-change-this-in-production-12345
JWT_REFRESH_SECRET=dev-refresh-secret-key-change-this-in-production-67890
```

### 1.2 API 서버

- **Framework**: Node.js 20 LTS + Express + TypeScript
- **포트**: 4000
- **실행 방식**: 로컬 `npm run dev`
- **상태**: ✅ 정상 운영 중

**디렉토리**:
```
apps/api/
├── src/
│   ├── features/      # API 기능별 모듈
│   ├── core/          # 앱 초기화
│   └── shared/        # 공유 리소스
└── prisma/
    ├── schema.prisma  # 데이터베이스 스키마
    └── migrations/    # 마이그레이션 히스토리
```

### 1.3 Frontend

#### Admin Dashboard
- **Framework**: React 19.1.0 + TypeScript 4.9.5
- **포트**: 3000
- **실행 방식**: `npm start`
- **상태**: 개발 중

#### Frontend Website
- **구조**: HTML5 + Vanilla JS (ES5)
- **포트**: 8000 (Python HTTP Server)
- **실행 방식**: `python -m http.server 8000`
- **상태**: 레거시 유지 중

---

## 2. 운영 환경 (Production) - 계획

### 2.1 AWS 인프라 (예정)

#### Compute
- **ECS Fargate**: API 서버 컨테이너 실행
- **Auto Scaling**: CPU/메모리 기반 자동 확장

#### Database
- **RDS PostgreSQL 16**: Multi-AZ, 자동 백업
- **ElastiCache Redis 7**: 세션 및 캐싱

#### Storage
- **S3**: 정적 파일 (Admin SPA, Frontend Static)
- **S3**: 사용자 업로드 파일 (이미지 등)

#### Network
- **CloudFront CDN**: 정적 파일 캐싱 및 배포
- **Application Load Balancer**: HTTPS 종료, 트래픽 분산
- **Route 53**: DNS 관리

#### Security
- **Secrets Manager**: 환경 변수 및 비밀키 관리
- **KMS**: 암호화 키 관리
- **AWS Shield**: DDoS 방어

#### Monitoring
- **CloudWatch**: 로그 및 메트릭
- **CloudWatch Alarms**: CPU, 메모리, 에러율 알림
- **Teams Webhook**: 알림 통합

---

## 3. 데이터베이스 현황

### 3.1 Prisma 스키마

**총 모델 수**: 15개

#### 핵심 모델
1. **Member** (회원)
2. **MemberStatusHistory** (회원 상태 이력)
3. **Post** (게시글)
4. **Comment** (댓글)
5. **Vote** (투표)
6. **VoteOption** (투표 옵션)
7. **VoteParticipation** (투표 참여)
8. **Reaction** (좋아요/싫어요)
9. **Report** (신고)
10. **Suggestion** (불편/제안)
11. **Notice** (공지사항)
12. **Popup** (팝업)
13. **Banner** (배너)
14. **PolicyTemplate** (정책 템플릿)
15. **PolicyContent** (정책 콘텐츠)

#### 마이그레이션 상태
- ✅ 초기 마이그레이션 완료 (2025-10-19)
- ✅ 15개 테이블 생성 완료
- ✅ Prisma Client 생성 완료

### 3.2 데이터베이스 접속 방법

**PostgreSQL 원격 서버 접속**:
```powershell
# 테이블 목록 확인
psql -h 43.201.115.132 -U polibat -d polibat -c "\dt"

# 데이터베이스 접속
psql -h 43.201.115.132 -U polibat -d polibat

# Prisma Studio (GUI)
cd apps/api
npx prisma studio
```

**Redis 접속**:
```powershell
# Docker 컨테이너 시작
docker compose up -d redis

# Redis CLI 접속
docker exec -it polibat-redis redis-cli -a polibat_redis_password

# 연결 테스트
docker exec -it polibat-redis redis-cli -a polibat_redis_password PING
```

---

## 4. API 현황

### 4.1 구현 완료 API (총 73개 엔드포인트)

#### Phase 1 Backend API (42개)

##### 인증 (5개)
- ✅ POST /api/auth/signup
- ✅ POST /api/auth/login
- ✅ GET /api/auth/me
- ✅ POST /api/auth/logout
- ✅ POST /api/auth/refresh

##### 회원 관리 (4개)
- ✅ GET /api/members
- ✅ GET /api/members/:memberId
- ✅ PATCH /api/members/:memberId
- ✅ PATCH /api/members/:memberId/status

##### 게시글 (5개)
- ✅ GET /api/posts
- ✅ GET /api/posts/:postId
- ✅ POST /api/posts
- ✅ PATCH /api/posts/:postId
- ✅ DELETE /api/posts/:postId

##### 댓글 (5개)
- ✅ GET /api/posts/:postId/comments
- ✅ GET /api/comments/:commentId
- ✅ POST /api/posts/:postId/comments
- ✅ PATCH /api/comments/:commentId
- ✅ DELETE /api/comments/:commentId

##### 반응 (5개)
- ✅ POST /api/reactions
- ✅ DELETE /api/reactions/:reactionId
- ✅ GET /api/posts/:postId/reactions
- ✅ GET /api/comments/:commentId/reactions
- ✅ GET /api/reactions/stats/:targetType/:targetId

##### 신고 (6개)
- ✅ POST /api/reports
- ✅ GET /api/reports/:reportId
- ✅ GET /api/reports
- ✅ GET /api/reports/my
- ✅ PATCH /api/reports/:reportId/process
- ✅ DELETE /api/reports/:reportId

##### 투표 (11개)
- ✅ POST /api/votes
- ✅ GET /api/votes
- ✅ GET /api/votes/:voteId
- ✅ PATCH /api/votes/:voteId
- ✅ DELETE /api/votes/:voteId
- ✅ POST /api/votes/:voteId/participate
- ✅ DELETE /api/votes/:voteId/participate/:participationId
- ✅ GET /api/votes/:voteId/results
- ✅ PATCH /api/votes/:voteId/close
- ✅ POST /api/votes/:voteId/options
- ✅ PATCH /api/votes/:voteId/options/:optionId

##### 헬스체크 (1개)
- ✅ GET /health

#### Phase 2 Admin Backend API (31개)

##### Admin Stats API (6개)
- ✅ GET /api/admin/stats/members
- ✅ GET /api/admin/stats/posts
- ✅ GET /api/admin/stats/comments
- ✅ GET /api/admin/stats/votes
- ✅ GET /api/admin/stats/reports
- ✅ GET /api/admin/stats/dashboard

##### Admin Member API (5개)
- ✅ GET /api/admin/members
- ✅ GET /api/admin/members/:memberId
- ✅ PATCH /api/admin/members/:memberId
- ✅ PATCH /api/admin/members/:memberId/status
- ✅ GET /api/admin/members/:memberId/history

##### Admin Post API (4개)
- ✅ GET /api/admin/posts
- ✅ GET /api/admin/posts/:postId
- ✅ PATCH /api/admin/posts/:postId
- ✅ PATCH /api/admin/posts/:postId/status

##### Admin Comment API (2개)
- ✅ GET /api/admin/comments
- ✅ PATCH /api/admin/comments/:commentId/status

##### Admin Report API (2개)
- ✅ GET /api/admin/reports
- ✅ PATCH /api/admin/reports/:reportId/process

##### Admin Search API (1개)
- ✅ GET /api/admin/search

##### Admin Notice API (6개)
- ✅ GET /api/admin/notices
- ✅ GET /api/admin/notices/:noticeId
- ✅ POST /api/admin/notices
- ✅ PATCH /api/admin/notices/:noticeId
- ✅ DELETE /api/admin/notices/:noticeId
- ✅ PATCH /api/admin/notices/:noticeId/pin

##### Admin Popup API (5개)
- ✅ GET /api/admin/popups
- ✅ GET /api/admin/popups/:popupId
- ✅ POST /api/admin/popups
- ✅ PATCH /api/admin/popups/:popupId
- ✅ DELETE /api/admin/popups/:popupId

**총 Phase 1**: 42개 | **총 Phase 2**: 31개 | **전체 합계**: 73개

### 4.2 구현 예정 API

#### File Upload API (3개) - Phase 2 Week 7-8
- 🔲 POST /api/upload/image - 이미지 업로드 + 썸네일
- 🔲 POST /api/upload/file - 일반 파일 업로드
- 🔲 DELETE /api/upload/:fileId - 파일 삭제

#### Email Service API (2개) - Phase 2 Week 7-8
- 🔲 POST /api/email/send - 이메일 발송
- 🔲 POST /api/email/template - 템플릿 기반 발송

---

## 5. 개발 도구

### 5.1 필수 도구
- **Node.js**: v20 LTS
- **npm**: 패키지 관리자
- **Docker Desktop**: Redis 컨테이너 실행
- **PowerShell 7**: 개발 환경 명령어 실행

### 5.2 유용한 명령어

#### 환경 확인
```powershell
# PostgreSQL 연결 테스트
psql -h 43.201.115.132 -U polibat -d polibat -c "SELECT version();"

# Redis 연결 테스트
docker exec -it polibat-redis redis-cli -a polibat_redis_password PING

# API 서버 헬스체크
curl http://localhost:4000/health
```

#### 서버 실행
```powershell
# Redis 시작
docker compose up -d redis

# API 서버 실행
cd apps/api
npm run dev

# Admin Dashboard 실행
cd apps/admin
npm start
```

#### 데이터베이스 관리
```powershell
# Prisma Studio 실행
cd apps/api
npx prisma studio

# 마이그레이션 생성
npx prisma migrate dev --name <migration_name>

# 마이그레이션 배포
npx prisma migrate deploy
```

---

## 6. 보안

### 6.1 개발 환경 보안
- **이메일 암호화**: AES-256-GCM (예정)
- **비밀번호**: bcrypt 해싱
- **JWT**: Access Token (15분) + Refresh Token (7일)
- **환경 변수**: .env 파일로 관리 (Git 제외)

### 6.2 운영 환경 보안 (예정)
- **Secrets Manager**: AWS 시크릿 관리
- **KMS**: 암호화 키 관리
- **HTTPS**: CloudFront + ALB
- **Rate Limiting**: API 속도 제한
- **CORS**: 허용된 도메인만 접근

---

## 7. 백업 및 복구

### 7.1 개발 환경
- **PostgreSQL**: 원격 서버 자동 백업 (제공자 정책)
- **Redis**: 데이터 영속성 (Docker 볼륨)

### 7.2 운영 환경 (예정)
- **RDS**: 자동 백업 (일일, 7일 보관)
- **S3**: 버전 관리 활성화
- **Point-in-Time Recovery**: 5분 단위 복구

---

## 8. 모니터링

### 8.1 개발 환경
- **로그**: 콘솔 출력
- **에러 추적**: try-catch + 로그

### 8.2 운영 환경 (예정)
- **CloudWatch Logs**: 애플리케이션 로그 수집
- **CloudWatch Metrics**: CPU, 메모리, 네트워크 메트릭
- **CloudWatch Alarms**: 임계값 초과 시 알림
- **Teams Webhook**: 알림 통합

---

## 9. 비용 예측 (월간)

### 9.1 개발 환경
- **PostgreSQL**: 원격 서버 (제공자 정책)
- **Redis**: 로컬 Docker (무료)
- **총 비용**: ~$0

### 9.2 운영 환경 (예정)
- **ECS Fargate**: $100-200
- **RDS PostgreSQL**: $50-100
- **ElastiCache Redis**: $30-50
- **S3 + CloudFront**: $20-50
- **기타 (Secrets, KMS 등)**: $10-20
- **총 비용**: $250-550/월

---

## 10. 다음 단계

### 10.1 즉시 수행
- ✅ Phase 1 완료 (42개 Backend API)
- ✅ Phase 2 Week 1-4 완료 (31개 Admin API)
- 🔲 Phase 2 Week 5-6 진행 중 (Banner, Suggestion, Policy API)
- 🔲 Phase 2 Week 7-8 예정 (File Upload, Email Service)

### 10.2 단기 (1개월)
- Phase 1 완료 (Backend 기반 구축)
- Admin Dashboard API 완전 연동

### 10.3 중기 (3개월)
- Phase 2 완료 (핵심 기능 구현)
- Frontend Website API 연동

### 10.4 장기 (6개월+)
- AWS 운영 환경 구축
- CI/CD 파이프라인 구축
- 모니터링 및 알림 시스템 구축

---

**작성**: Claude Code (SuperClaude Framework)
**참조 문서**:
- [TO-BE-ARCHITECTURE.md](./TO-BE-ARCHITECTURE.md)
- [DEV_ROADMAP.md](./DEV_ROADMAP.md)
- [세션 기록](./claudedocs/sessions/)
