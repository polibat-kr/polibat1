# EC2 인프라 완성 워크플로우

**문서 버전**: 1.0
**작성일**: 2025-10-25
**대상 서버**: EC2 개발 서버 (43.201.115.132, Ubuntu 24.04 LTS)
**목표**: Redis 설치, SSL 인증서 설정, PM2 서비스 시작, API/Admin Dashboard 배포

---

## 📋 개요

본 문서는 EC2 개발 서버를 완전히 구성하고 정치방망이 프로젝트를 배포하기 위한 단계별 워크플로우를 제공합니다.

### 현재 상태
- ✅ EC2 인스턴스: Ubuntu 24.04 LTS
- ✅ PostgreSQL 16: 정상 실행 중
- ✅ Nginx: 정상 실행 중 (SSL 설정됨)
- ✅ Node.js 20.19.5: NVM 설치 완료
- ✅ PM2 6.0.8: 설치 완료 (프로세스 없음)

### 목표 상태
- ✅ Redis 7: 설치 및 실행
- ✅ SSL 인증서: Let's Encrypt 자동 갱신
- ✅ API 서버: PM2로 4000번 포트 실행
- ✅ Admin Dashboard: PM2로 3000번 포트 또는 정적 파일 배포
- ✅ Nginx: 리버스 프록시 설정

---

## 🎯 워크플로우 전체 구조

```mermaid
graph TD
    A[1. 사전 준비] --> B[2. Redis 설치]
    B --> C[3. SSL 인증서 설정]
    C --> D[4. 코드 배포]
    D --> E[5. API 서버 배포]
    E --> F[6. Admin Dashboard 배포]
    F --> G[7. Nginx 리버스 프록시]
    G --> H[8. 서비스 검증]
    H --> I[9. 모니터링 설정]
```

**총 예상 시간**: 2-3시간
**난이도**: 중급
**선행 조건**: SSH 접속 가능, sudo 권한

---

## Phase 1: 사전 준비 (15분)

### 목표
EC2 서버 접속 환경 구성 및 시스템 업데이트

### 작업 항목

#### 1.1 로컬 환경 준비

**PEM 파일 복사**:
```powershell
# Windows (로컬)
Copy-Item "다운로드경로\polibat-dev.pem" -Destination "C:\polibat\keys\"
```

**PEM 파일 권한 설정** (Linux/Mac):
```bash
chmod 400 C:/polibat/keys/polibat-dev.pem
```

#### 1.2 EC2 서버 접속 확인

```bash
# SSH 접속 테스트
ssh -i ./keys/polibat-dev.pem ubuntu@43.201.115.132

# 시스템 정보 확인
uname -a
lsb_release -a
```

**예상 출력**:
```
Ubuntu 24.04 LTS
Kernel 6.x
```

#### 1.3 시스템 업데이트

```bash
# 패키지 목록 업데이트
sudo apt update

# 보안 패치 및 업그레이드
sudo apt upgrade -y

# 재부팅 필요 여부 확인
[ -f /var/run/reboot-required ] && echo "재부팅 필요" || echo "재부팅 불필요"
```

**체크리스트**:
- [ ] SSH 접속 성공
- [ ] 시스템 정보 확인
- [ ] 패키지 업데이트 완료
- [ ] 디스크 용량 확인 (`df -h`)

---

## Phase 2: Redis 설치 및 설정 (20분)

### 목표
Redis 7 설치, 비밀번호 설정, 자동 시작 구성

### 작업 항목

#### 2.1 Redis 설치

```bash
# Redis 설치
sudo apt install redis-server -y

# 버전 확인
redis-server --version

# 예상 출력: Redis server v=7.x
```

#### 2.2 Redis 설정

```bash
# Redis 설정 파일 백업
sudo cp /etc/redis/redis.conf /etc/redis/redis.conf.backup

# 설정 파일 수정
sudo nano /etc/redis/redis.conf
```

**변경 사항**:
```conf
# 1. 비밀번호 설정 (650번째 줄 근처)
requirepass polibat_redis_password

# 2. 메모리 정책 설정 (추가)
maxmemory 256mb
maxmemory-policy allkeys-lru

# 3. 로컬 바인딩 확인 (70번째 줄 근처)
bind 127.0.0.1 ::1

# 4. 영속성 설정 (220번째 줄 근처)
save 900 1
save 300 10
save 60 10000
```

#### 2.3 Redis 시작 및 자동 시작 설정

```bash
# Redis 재시작
sudo systemctl restart redis-server

# 자동 시작 활성화
sudo systemctl enable redis-server

# 상태 확인
sudo systemctl status redis-server

# 예상 출력: Active: active (running)
```

#### 2.4 Redis 연결 테스트

```bash
# Redis CLI 접속
redis-cli -a polibat_redis_password

# PING 테스트
127.0.0.1:6379> PING
# 예상 출력: PONG

# 종료
127.0.0.1:6379> EXIT
```

**체크리스트**:
- [ ] Redis 설치 완료
- [ ] 비밀번호 설정 완료
- [ ] 자동 시작 설정 완료
- [ ] PING 테스트 성공

---

## Phase 3: SSL 인증서 설정 (30분)

### 목표
Let's Encrypt SSL 인증서 발급 및 자동 갱신 설정

### 사전 조건
- 도메인 이름 필요 (예: polibat.com)
- DNS A 레코드가 EC2 IP(43.201.115.132)를 가리켜야 함

### 작업 항목

#### 3.1 Certbot 설치

```bash
# Certbot 및 Nginx 플러그인 설치
sudo apt install certbot python3-certbot-nginx -y

# 버전 확인
certbot --version

# 예상 출력: certbot 2.x
```

#### 3.2 SSL 인증서 발급

**도메인이 있는 경우**:
```bash
# Nginx와 함께 자동 설정
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 이메일 입력: your-email@example.com
# 서비스 약관 동의: Y
# HTTPS 리디렉션: 2 (권장)
```

**도메인이 없는 경우**:
```bash
# 테스트용 자체 서명 인증서
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/nginx-selfsigned.key \
  -out /etc/ssl/certs/nginx-selfsigned.crt

# Nginx SSL 설정
sudo nano /etc/nginx/sites-available/default
```

**자체 서명 인증서 Nginx 설정**:
```nginx
server {
    listen 443 ssl;
    server_name _;

    ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;

    # ... 기타 설정
}
```

#### 3.3 자동 갱신 설정

```bash
# Certbot 자동 갱신 테스트 (Dry Run)
sudo certbot renew --dry-run

# 예상 출력: Congratulations, all simulated renewals succeeded

# 자동 갱신 크론잡 확인
sudo systemctl status certbot.timer

# 예상 출력: Active: active (waiting)
```

**체크리스트**:
- [ ] Certbot 설치 완료
- [ ] SSL 인증서 발급 완료
- [ ] HTTPS 접속 가능
- [ ] 자동 갱신 설정 완료

---

## Phase 4: 코드 배포 준비 (20분)

### 목표
Git 저장소 클론, 환경 변수 설정, 의존성 설치

### 작업 항목

#### 4.1 프로젝트 디렉토리 생성

```bash
# 웹 루트 디렉토리 생성
sudo mkdir -p /var/www/polibat
sudo chown -R ubuntu:ubuntu /var/www/polibat

# 디렉토리로 이동
cd /var/www/polibat
```

#### 4.2 Git 저장소 클론

**GitHub Private Repository 경우**:
```bash
# Personal Access Token 사용
git clone https://<YOUR_TOKEN>@github.com/your-org/polibat.git .

# 또는 SSH 키 사용
git clone git@github.com:your-org/polibat.git .
```

**로컬에서 직접 업로드**:
```powershell
# Windows (로컬)
scp -i ./keys/polibat-dev.pem -r C:\polibat ubuntu@43.201.115.132:/var/www/polibat
```

#### 4.3 환경 변수 설정

```bash
# .env 파일 생성
cd /var/www/polibat/apps/api
nano .env
```

**.env 내용**:
```bash
# ============================================
# Production Environment Variables
# ============================================

# Node Environment
NODE_ENV=production

# Server Configuration
PORT=4000
API_URL=https://yourdomain.com

# Database Configuration
DATABASE_URL=postgresql://polibat:Vhfflqpt183!@localhost:5432/polibat

# JWT Configuration
JWT_SECRET=production-secret-key-CHANGE-THIS-LONG-RANDOM-STRING
JWT_REFRESH_SECRET=production-refresh-secret-CHANGE-THIS-LONG-RANDOM-STRING
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/var/www/polibat/uploads

# Logging
LOG_LEVEL=info

# Redis Configuration
REDIS_URL=redis://:polibat_redis_password@localhost:6379

# Encryption (AES-256)
ENCRYPTION_KEY="CHANGE-THIS-TO-64-CHARACTER-HEX-STRING"
```

**보안 키 생성**:
```bash
# JWT Secret 생성 (64자)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Encryption Key 생성 (64자)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 4.4 의존성 설치

```bash
# Root 디렉토리로 이동
cd /var/www/polibat

# npm 의존성 설치 (Monorepo)
npm install

# API 서버 의존성
cd apps/api
npm install

# Prisma Client 생성
npx prisma generate

# Admin Dashboard 의존성
cd ../admin
npm install
```

**체크리스트**:
- [ ] 프로젝트 디렉토리 생성 완료
- [ ] 코드 클론/업로드 완료
- [ ] .env 파일 설정 완료
- [ ] 의존성 설치 완료
- [ ] Prisma Client 생성 완료

---

## Phase 5: API 서버 배포 (30분)

### 목표
API 서버 빌드, PM2로 프로세스 관리, 자동 재시작 설정

### 작업 항목

#### 5.1 API 서버 빌드

```bash
cd /var/www/polibat/apps/api

# TypeScript 빌드
npm run build

# 빌드 결과 확인
ls -la dist/

# 예상 출력: main.js, core/, features/ 등
```

#### 5.2 PM2로 API 서버 시작

```bash
# PM2 ecosystem 파일 생성
nano ecosystem.config.js
```

**ecosystem.config.js 내용**:
```javascript
module.exports = {
  apps: [
    {
      name: 'polibat-api',
      script: 'dist/core/server.js',
      cwd: '/var/www/polibat/apps/api',
      instances: 2,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      error_file: '/var/log/pm2/polibat-api-error.log',
      out_file: '/var/log/pm2/polibat-api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
```

**PM2로 시작**:
```bash
# PM2 로그 디렉토리 생성
sudo mkdir -p /var/log/pm2
sudo chown -R ubuntu:ubuntu /var/log/pm2

# API 서버 시작
pm2 start ecosystem.config.js

# 상태 확인
pm2 list

# 로그 확인
pm2 logs polibat-api --lines 50
```

#### 5.3 PM2 자동 시작 설정

```bash
# PM2 현재 상태 저장
pm2 save

# 시스템 부팅 시 PM2 자동 시작
pm2 startup

# 출력된 명령어 실행 (sudo로 시작하는 명령어)
# 예: sudo env PATH=$PATH:/home/ubuntu/.nvm/versions/node/v20.19.5/bin ...
```

#### 5.4 API 서버 테스트

```bash
# 헬스체크
curl http://localhost:4000/health

# 예상 출력:
# {
#   "status": "healthy",
#   "timestamp": "2025-10-25T...",
#   "database": "connected",
#   "redis": "connected"
# }
```

**체크리스트**:
- [ ] API 서버 빌드 완료
- [ ] PM2로 시작 완료
- [ ] 자동 재시작 설정 완료
- [ ] 헬스체크 성공
- [ ] 로그 확인 (에러 없음)

---

## Phase 6: Admin Dashboard 배포 (30분)

### 목표
Admin Dashboard 빌드 및 배포 (PM2 또는 정적 파일)

### 옵션 A: PM2로 개발 서버 실행

#### 6.1 PM2 설정 업데이트

```bash
# ecosystem.config.js 수정
nano /var/www/polibat/apps/api/ecosystem.config.js
```

**Admin 앱 추가**:
```javascript
module.exports = {
  apps: [
    // ... API 서버 설정 ...
    {
      name: 'polibat-admin',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/polibat/apps/admin',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/pm2/polibat-admin-error.log',
      out_file: '/var/log/pm2/polibat-admin-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
```

**PM2 재시작**:
```bash
pm2 delete all
pm2 start /var/www/polibat/apps/api/ecosystem.config.js
pm2 save
```

### 옵션 B: 정적 파일로 빌드 (권장)

#### 6.1 프로덕션 빌드

```bash
cd /var/www/polibat/apps/admin

# 프로덕션 빌드
npm run build

# 빌드 결과 확인
ls -la build/

# 예상 출력: index.html, static/, assets/ 등
```

#### 6.2 Nginx로 서빙

```bash
# Nginx HTML 디렉토리로 복사
sudo mkdir -p /var/www/html/admin
sudo cp -r build/* /var/www/html/admin/

# 권한 설정
sudo chown -R www-data:www-data /var/www/html/admin
sudo chmod -R 755 /var/www/html/admin
```

**체크리스트**:
- [ ] Admin Dashboard 빌드 완료
- [ ] PM2 또는 정적 파일 배포 완료
- [ ] 접속 테스트 성공

---

## Phase 7: Nginx 리버스 프록시 설정 (20분)

### 목표
Nginx를 통한 API 서버 및 Admin Dashboard 라우팅

### 작업 항목

#### 7.1 Nginx 설정 파일 생성

```bash
# Nginx 설정 파일 생성
sudo nano /etc/nginx/sites-available/polibat
```

**Nginx 설정 내용**:
```nginx
# Upstream 정의
upstream api_backend {
    server 127.0.0.1:4000;
}

upstream admin_backend {
    server 127.0.0.1:3000;
}

# HTTP → HTTPS 리디렉션
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS 서버
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL 인증서 (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL 설정
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 보안 헤더
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # API 서버 프록시
    location /api {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # 타임아웃 설정
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Admin Dashboard (정적 파일)
    location /admin {
        alias /var/www/html/admin;
        try_files $uri $uri/ /admin/index.html;

        # 캐싱 설정
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Admin Dashboard (PM2 개발 서버)
    # location /admin {
    #     proxy_pass http://admin_backend;
    #     proxy_http_version 1.1;
    #     proxy_set_header Upgrade $http_upgrade;
    #     proxy_set_header Connection 'upgrade';
    #     proxy_set_header Host $host;
    #     proxy_cache_bypass $http_upgrade;
    # }

    # 루트 경로
    location / {
        root /var/www/html;
        index index.html index.htm;
        try_files $uri $uri/ =404;
    }
}
```

#### 7.2 Nginx 설정 활성화

```bash
# 심볼릭 링크 생성
sudo ln -s /etc/nginx/sites-available/polibat /etc/nginx/sites-enabled/

# 기본 설정 비활성화 (선택사항)
sudo rm /etc/nginx/sites-enabled/default

# Nginx 설정 테스트
sudo nginx -t

# 예상 출력: syntax is ok, test is successful

# Nginx 재시작
sudo systemctl reload nginx
```

#### 7.3 방화벽 설정 확인

```bash
# UFW 상태 확인
sudo ufw status

# 필요한 포트 개방
sudo ufw allow 22/tcp     # SSH
sudo ufw allow 80/tcp     # HTTP
sudo ufw allow 443/tcp    # HTTPS
sudo ufw allow 5432/tcp   # PostgreSQL (필요시)

# UFW 활성화
sudo ufw enable
```

**체크리스트**:
- [ ] Nginx 설정 파일 생성 완료
- [ ] 심볼릭 링크 생성 완료
- [ ] Nginx 설정 테스트 성공
- [ ] Nginx 재시작 완료
- [ ] 방화벽 설정 완료

---

## Phase 8: 서비스 검증 (15분)

### 목표
배포된 서비스의 정상 작동 확인

### 작업 항목

#### 8.1 API 서버 검증

```bash
# 헬스체크
curl https://yourdomain.com/api/health

# 또는 IP로 직접 테스트
curl http://43.201.115.132:4000/health

# 예상 출력: {"status":"healthy",...}
```

#### 8.2 Admin Dashboard 검증

```bash
# 브라우저에서 접속
# https://yourdomain.com/admin

# 또는 curl로 HTML 확인
curl -I https://yourdomain.com/admin

# 예상 출력: HTTP/1.1 200 OK
```

#### 8.3 데이터베이스 연결 확인

```bash
# PostgreSQL 연결 테스트
psql -h localhost -U polibat -d polibat -c "SELECT NOW();"

# Prisma Studio 실행 (로컬 포트 포워딩)
ssh -i ./keys/polibat-dev.pem -L 5555:localhost:5555 ubuntu@43.201.115.132
cd /var/www/polibat/apps/api
npx prisma studio
```

#### 8.4 Redis 연결 확인

```bash
# Redis 연결 테스트
redis-cli -a polibat_redis_password PING

# PM2 로그에서 Redis 연결 확인
pm2 logs polibat-api | grep -i redis

# 예상 출력: Redis connected
```

#### 8.5 PM2 프로세스 확인

```bash
# 모든 프로세스 상태
pm2 list

# 예상 출력:
# ┌─────┬──────────────┬─────────┬──────┬─────────┐
# │ id  │ name         │ status  │ cpu  │ memory  │
# ├─────┼──────────────┼─────────┼──────┼─────────┤
# │ 0   │ polibat-api  │ online  │ 5%   │ 150 MB  │
# │ 1   │ polibat-admin│ online  │ 2%   │ 80 MB   │
# └─────┴──────────────┴─────────┴──────┴─────────┘

# 프로세스 모니터링
pm2 monit
```

**체크리스트**:
- [ ] API 헬스체크 성공
- [ ] Admin Dashboard 접속 가능
- [ ] PostgreSQL 연결 확인
- [ ] Redis 연결 확인
- [ ] PM2 프로세스 정상 실행

---

## Phase 9: 모니터링 및 유지보수 설정 (20분)

### 목표
로그 관리, 모니터링, 백업 설정

### 작업 항목

#### 9.1 로그 로테이션 설정

```bash
# PM2 로그 로테이션 모듈 설치
pm2 install pm2-logrotate

# 설정
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss
```

#### 9.2 Nginx 로그 로테이션

```bash
# logrotate 설정 확인
sudo cat /etc/logrotate.d/nginx

# 필요시 수정
sudo nano /etc/logrotate.d/nginx
```

**logrotate 설정**:
```
/var/log/nginx/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 `cat /var/run/nginx.pid`
        fi
    endscript
}
```

#### 9.3 시스템 모니터링

```bash
# htop 설치 (시스템 리소스 모니터)
sudo apt install htop -y

# 실행
htop

# PM2 웹 대시보드 (선택사항)
pm2 web

# 예상 출력: PM2 web interface on http://localhost:9615
```

#### 9.4 데이터베이스 백업 스크립트

```bash
# 백업 스크립트 생성
sudo nano /usr/local/bin/backup-polibat-db.sh
```

**백업 스크립트 내용**:
```bash
#!/bin/bash

# 변수 설정
BACKUP_DIR="/var/backups/polibat"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME="polibat"
DB_USER="polibat"
DB_HOST="localhost"

# 백업 디렉토리 생성
mkdir -p $BACKUP_DIR

# PostgreSQL 백업
PGPASSWORD="Vhfflqpt183!" pg_dump -h $DB_HOST -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/polibat_$TIMESTAMP.sql.gz

# 30일 이상된 백업 삭제
find $BACKUP_DIR -name "polibat_*.sql.gz" -mtime +30 -delete

echo "Backup completed: polibat_$TIMESTAMP.sql.gz"
```

**실행 권한 부여**:
```bash
sudo chmod +x /usr/local/bin/backup-polibat-db.sh
```

**크론잡 등록** (매일 새벽 2시):
```bash
# crontab 편집
crontab -e

# 추가
0 2 * * * /usr/local/bin/backup-polibat-db.sh >> /var/log/polibat-backup.log 2>&1
```

**체크리스트**:
- [ ] PM2 로그 로테이션 설정 완료
- [ ] Nginx 로그 로테이션 확인
- [ ] 모니터링 도구 설치 완료
- [ ] 데이터베이스 백업 스크립트 생성
- [ ] 크론잡 등록 완료

---

## 🔒 보안 체크리스트

### 필수 보안 설정

- [ ] **SSH 키 기반 인증만 허용**
  ```bash
  sudo nano /etc/ssh/sshd_config
  # PasswordAuthentication no
  sudo systemctl restart sshd
  ```

- [ ] **방화벽 활성화 (UFW)**
  ```bash
  sudo ufw enable
  sudo ufw status verbose
  ```

- [ ] **PostgreSQL 외부 접근 제한**
  ```bash
  sudo nano /etc/postgresql/16/main/pg_hba.conf
  # host all all 127.0.0.1/32 md5 (로컬만 허용)
  sudo systemctl restart postgresql
  ```

- [ ] **Redis 비밀번호 설정 확인**
  ```bash
  redis-cli -a polibat_redis_password CONFIG GET requirepass
  # "requirepass" "polibat_redis_password"
  ```

- [ ] **.env 파일 권한 설정**
  ```bash
  chmod 600 /var/www/polibat/apps/api/.env
  ```

- [ ] **Nginx 보안 헤더 적용 확인**
  ```bash
  curl -I https://yourdomain.com | grep -i "x-frame\|x-content\|strict-transport"
  ```

---

## 📊 성능 최적화

### 권장 설정

#### Node.js 메모리 최적화
```javascript
// ecosystem.config.js에 추가
node_args: '--max-old-space-size=512'
```

#### Nginx 캐싱 설정
```nginx
# /etc/nginx/nginx.conf
http {
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=100m inactive=60m;
}
```

#### PostgreSQL 연결 풀 설정
```javascript
// Prisma schema
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  pool_timeout = 20
  connection_limit = 10
}
```

---

## 🚨 트러블슈팅

### 자주 발생하는 문제

#### 1. PM2 프로세스가 자동으로 재시작되지 않음
```bash
# PM2 startup 재설정
pm2 unstartup
pm2 startup
pm2 save
```

#### 2. Nginx 502 Bad Gateway
```bash
# API 서버 상태 확인
pm2 list
pm2 logs polibat-api

# Nginx 에러 로그 확인
sudo tail -f /var/log/nginx/error.log
```

#### 3. PostgreSQL 연결 실패
```bash
# PostgreSQL 상태 확인
sudo systemctl status postgresql

# 연결 테스트
psql -h localhost -U polibat -d polibat -c "SELECT 1;"
```

#### 4. Redis 연결 실패
```bash
# Redis 상태 확인
sudo systemctl status redis-server

# Redis 로그 확인
sudo tail -f /var/log/redis/redis-server.log
```

---

## ✅ 최종 검증 체크리스트

### 인프라

- [ ] EC2 인스턴스 정상 실행
- [ ] PostgreSQL 정상 실행 및 연결 가능
- [ ] Redis 정상 실행 및 연결 가능
- [ ] Nginx 정상 실행
- [ ] SSL 인증서 적용 (HTTPS 접속 가능)

### 애플리케이션

- [ ] API 서버 PM2로 실행 중
- [ ] API 헬스체크 성공 (/api/health)
- [ ] Admin Dashboard 접속 가능 (/admin)
- [ ] 데이터베이스 연결 확인
- [ ] Redis 연결 확인

### 보안

- [ ] SSH 키 기반 인증만 허용
- [ ] 방화벽 활성화 및 필요한 포트만 개방
- [ ] PostgreSQL 로컬만 접근 허용
- [ ] Redis 비밀번호 설정
- [ ] .env 파일 권한 설정 (600)
- [ ] Nginx 보안 헤더 적용

### 모니터링

- [ ] PM2 로그 로테이션 설정
- [ ] Nginx 로그 로테이션 설정
- [ ] 데이터베이스 백업 스크립트 설정
- [ ] 크론잡 등록 (백업)

### 성능

- [ ] PM2 클러스터 모드 (API 서버)
- [ ] Nginx 캐싱 설정
- [ ] Gzip 압축 활성화
- [ ] 정적 파일 캐싱 설정

---

## 📚 참고 자료

### 공식 문서

- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Certbot](https://certbot.eff.org/)
- [Redis Documentation](https://redis.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### 내부 문서

- [INFRASTRUCTURE_SUMMARY.md](./INFRASTRUCTURE_SUMMARY.md) - 인프라 현황
- [TO-BE-ARCHITECTURE.md](./TO-BE-ARCHITECTURE.md) - 목표 아키텍처
- [DEV_ROADMAP.md](./DEV_ROADMAP.md) - 개발 로드맵

---

## 📝 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| 1.0 | 2025-10-25 | Claude Code | 초기 워크플로우 작성 |

---

**작성**: Claude Code (SuperClaude Framework)
**워크플로우 타입**: Systematic Infrastructure Deployment
**예상 완료 시간**: 2-3시간
**난이도**: 중급
