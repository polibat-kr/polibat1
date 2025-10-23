# 정치방망이(POLIBAT) 인프라 아키텍처 요약서

**작성일**: 2025-01-27  
**대상**: 인프라 담당자  
**목적**: TO-BE 아키텍처 핵심 인프라 요구사항 공유

---

## 📋 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [현재 상황 (AS-IS)](#2-현재-상황-as-is)
3. [목표 아키텍처 (TO-BE)](#3-목표-아키텍처-to-be)
4. [인프라 요구사항](#4-인프라-요구사항)
5. [배포 전략](#5-배포-전략)
6. [비용 예상](#6-비용-예상)
7. [다음 단계](#7-다음-단계)

---

## 1. 프로젝트 개요

### 🎯 프로젝트 목표
- **정치방망이(POLIBAT)**: 정치인과 시민 간 소통 플랫폼
- **AI 에이전트 개발 최적화**: 명확한 아키텍처로 AI 개발 효율성 극대화
- **100% 기능 동등성**: 기존 UI/UX 완벽 재현

### 📊 현재 규모
- **Admin Dashboard**: React 19 + TypeScript, 16개 페이지
- **Frontend Website**: HTML5 + jQuery, 22개 페이지
- **사용자**: 일반회원, 정치인, 보좌관, 관리자

---

## 2. 현재 상황 (AS-IS)

### ❌ 현재 문제점
```
┌─────────────────┐    ┌─────────────────┐
│  Admin Dashboard│    │ Frontend Website│
│  (React SPA)    │    │ (HTML + jQuery) │
│  localhost:3000 │    │ localhost:8000  │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
              ❌ Backend 없음
              ❌ Database 없음
              ❌ localStorage 기반 인증
```

### 🚨 주요 이슈
- **데이터 영속성 없음**: localStorage 기반으로 서버 재시작 시 데이터 손실
- **보안 취약**: 클라이언트 사이드 인증
- **확장성 제한**: 동시 사용자 처리 불가
- **AI 기능 불가**: 백엔드 없이 AI 서비스 연동 불가

---

## 3. 목표 아키텍처 (TO-BE)

### 🏗️ 전체 시스템 구조

#### 운영 환경 (AWS)
```
┌─────────────────────────────────────────────────────────────┐
│                    CloudFront CDN                           │
│                (정적 파일, 이미지 캐싱)                       │
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
    │Postgres │  │  Redis  │  │ Files  │
    │  16     │  │   7.x   │  │        │
    └─────────┘  └────────┘  └─────────┘
```

#### 개발 환경 (원격 DB)
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

---

## 4. 인프라 요구사항

### 🗄️ 데이터베이스

#### PostgreSQL 16
- **용도**: 메인 데이터베이스
- **개발**: 원격 서버 (43.201.115.132:5432, DB: polibat)
- **운영**: AWS RDS Multi-AZ
- **백업**: 일일 자동 백업, 7일 보관
- **스키마**: Prisma ORM으로 관리
- **인증**: 사용자 `polibat`, 비밀번호는 `.env` 파일 참조

#### Redis 7
- **용도**: 세션 관리, API 캐싱, Rate Limiting
- **개발**: Docker 컨테이너
- **운영**: AWS ElastiCache
- **포트**: 6379

### 🚀 애플리케이션 서버

#### Node.js + Express
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js 4.x
- **Language**: TypeScript 5.x
- **ORM**: Prisma 5.x
- **배포**: ECS Fargate (서버리스)

### 🌐 정적 파일 호스팅

#### S3 + CloudFront
- **Admin Dashboard**: S3 정적 호스팅
- **Frontend Website**: S3 정적 호스팅
- **이미지/파일**: S3 + CloudFront CDN
- **도메인**: `www.polibat.com`, `admin.polibat.com`

### 🔐 보안

#### SSL/TLS
- **인증서**: AWS Certificate Manager
- **프로토콜**: HTTPS 강제
- **헤더**: Helmet.js 보안 헤더

#### 인증/인가
- **JWT**: Access Token (15분) + Refresh Token (7일)
- **암호화**: 이메일 AES-256 암호화
- **Rate Limiting**: API 요청 제한

---

## 5. 배포 전략

### 🐳 Docker 구성

#### Backend Dockerfile
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npm run build
RUN npx prisma generate

FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

EXPOSE 4000
CMD ["node", "dist/main.js"]
```

### 🔄 CI/CD 파이프라인

#### GitHub Actions
```yaml
# 주요 워크플로우
1. 테스트 (Lint, TypeScript, Unit Tests)
2. Docker 이미지 빌드 및 ECR 푸시
3. ECS 서비스 업데이트
4. S3 정적 파일 배포
5. CloudFront 캐시 무효화
```

### 📊 모니터링

#### CloudWatch
- **메트릭**: CPU, Memory, Response Time, Error Rate
- **알람**: 임계값 초과 시 SNS 알림
- **로그**: 애플리케이션 로그 중앙 집중

#### 팀즈 웹훅
- **일일 통계**: 신규 회원, 게시글, 댓글 수
- **알림**: 불편/제안 접수, 시스템 오류

---

## 6. 비용 예상

### 💰 월 예상 비용 (AWS)

| 서비스 | 용량 | 월 비용 |
|--------|------|---------|
| **ECS Fargate** | 2 vCPU, 4GB RAM | $100-200 |
| **RDS PostgreSQL** | db.t3.micro | $50-100 |
| **ElastiCache Redis** | cache.t3.micro | $30-50 |
| **S3 + CloudFront** | 10GB 저장, 100GB 전송 | $20-50 |
| **Application Load Balancer** | - | $20-30 |
| **Route 53** | 호스팅 영역 | $1-5 |
| **AI API (OpenAI)** | GPT-4o-mini 사용 | $50-150 |

### 📈 **총 월 비용: $250-550**

### 💡 비용 최적화 전략
- **개발 환경**: 원격 PostgreSQL 16 서버 사용 (공유)
- **AI 비용**: 캐싱 및 배치 처리로 최적화
- **스토리지**: S3 Intelligent Tiering 활용
- **컴퓨팅**: ECS Fargate Spot 인스턴스 고려

---

## 7. 다음 단계

### 🎯 즉시 필요한 작업

#### 1. AWS 계정 설정
- [ ] AWS 계정 생성 및 IAM 사용자 설정
- [ ] 도메인 등록 (`polibat.com`)
- [ ] SSL 인증서 발급 (ACM)

#### 2. 개발 환경 구축
- [x] PostgreSQL 16 원격 서버 구축 (43.201.115.132:5432, DB: polibat)
- [x] Docker Desktop 설치 (Redis용)
- [x] 개발자 PC 환경 설정
- [x] Prisma 마이그레이션 완료 (15개 테이블)
- [x] Redis Docker 컨테이너 실행 중

#### 3. CI/CD 파이프라인
- [ ] GitHub Actions 워크플로우 설정
- [ ] ECR 리포지토리 생성
- [ ] ECS 클러스터 및 서비스 생성

### 📅 타임라인

| 주차 | 작업 내용 | 담당자 |
|------|-----------|--------|
| **Week 1** | AWS 인프라 기본 설정 | 인프라 담당자 |
| **Week 2** | 개발 환경 구축 | 개발팀 + 인프라 |
| **Week 3** | CI/CD 파이프라인 구축 | 인프라 담당자 |
| **Week 4** | 모니터링 및 알림 설정 | 인프라 담당자 |

### 🤝 협업 포인트

#### 인프라 담당자와 개발팀 협업
- **환경 변수 관리**: AWS Secrets Manager 활용
- **데이터베이스 마이그레이션**: Prisma migrate 자동화
- **로깅 표준화**: CloudWatch Logs 형식 통일
- **보안 정책**: 네트워크 보안 그룹, IAM 정책 검토

---

## 📞 문의사항

### 🔗 관련 문서
- **상세 아키텍처**: `TO-BE-ARCHITECTURE.md`
- **개발 로드맵**: `DEV_ROADMAP.md`
- **데이터베이스 스키마**: `prisma/schema.prisma`

### 📧 연락처
- **프로젝트 관리**: [프로젝트 관리자]
- **기술 문의**: [기술 리더]
- **인프라 문의**: [인프라 담당자]

---

**문서 작성**: AI Agent (Claude 3.5 Sonnet)  
**작성일**: 2025-01-27  
**버전**: 1.0
