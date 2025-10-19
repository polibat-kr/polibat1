# 정치방망이(PoliBAT) 개발 로드맵

**작성일**: 2025-10-19
**버전**: 2.0 (토큰 최적화 버전)
**목적**: 클로드 코드를 활용한 컨텍스트 엔지니어링 관점의 개발 로드맵

---

## 📋 문서 구조

본 문서는 **마스터 로드맵**으로, 전체 개발 계획의 개요를 제공합니다.
상세한 작업 내용은 Phase별 문서를 참조하세요.

### 상세 문서
- **[Phase 1: Foundation](./DEV_ROADMAP_PHASE1.md)** - Backend 기반 구축 (Week 1-8, ~8,000토큰)
- **[Phase 2: Core Features](./DEV_ROADMAP_PHASE2.md)** - 핵심 기능 구현 (Week 9-20, ~6,000토큰)
- **[Phase 3: Enhancement](./DEV_ROADMAP_PHASE3.md)** - 고도화 기능 (Week 21-32, ~4,000토큰)
- **[Phase 4: Scale](./DEV_ROADMAP_PHASE4.md)** - 확장 및 장기 계획 (Quarter 5+, ~3,000토큰)
- **[코드베이스 현황](./CODEBASE_STATUS.md)** - 현재 구현 상태 (~3,000토큰)

---

## 1. 개요

### 1.1 로드맵 목적

본 로드맵은 **클로드 코드(Claude Code)를 활용한 AI 에이전트 개발**을 최적화하기 위해 작성되었습니다.
일반적인 개발 로드맵과 달리, **컨텍스트 효율성**, **AI 이해도**, **세션 지속성**을 핵심으로 합니다.

### 1.2 컨텍스트 엔지니어링이란?

**컨텍스트 엔지니어링**은 AI 에이전트가 프로젝트를 이해하고 개발하는 데 필요한 **컨텍스트(문맥)**를 효율적으로 설계하고 관리하는 방법론입니다.

**핵심 원칙**:
1. **컨텍스트 최소화**: 필요한 정보만 제공하여 토큰 사용량 절감
2. **구조화된 문서**: AI가 빠르게 파악할 수 있는 명확한 구조
3. **세션 지속성**: 작업 진행 상황을 메모리에 저장하여 연속성 보장
4. **패턴 기반 개발**: 일관된 코드 패턴으로 AI 학습 효율 극대화

### 1.3 문서 사용 방법

**세션 시작 시**:
1. 이 마스터 문서를 먼저 읽어 전체 흐름 파악
2. 현재 작업 중인 Phase의 상세 문서만 선택적으로 로드
3. `/sc:load`로 이전 세션 컨텍스트 복원

**작업 중**:
- 30분마다 또는 토큰 80% 도달 시 `/sc:save`로 진행 상황 저장
- 필요 시 코드베이스 현황 문서 참조

---

## 2. 컨텍스트 엔지니어링 핵심 원칙

### 2.1 문서 구조 원칙

#### 계층적 문서 체계

```
/docs (프로젝트 루트 문서)
├── TO-BE-ARCHITECTURE.md     # 전체 아키텍처 개요
├── DEV_ROADMAP.md            # 개발 로드맵 (마스터)
├── DEV_ROADMAP_PHASE*.md     # Phase별 상세 로드맵
├── CODEBASE_STATUS.md        # 현재 구현 상태
├── API-SPEC.md               # API 명세서
└── DATABASE-SCHEMA.md        # 데이터베이스 스키마

/claudedocs (AI 에이전트 전용 문서)
├── /phase{N}                 # Phase별 작업 로그
│   ├── week{N}.md
│   └── checkpoint.md
├── /patterns                 # 코드 패턴 문서
│   ├── controller-pattern.md
│   ├── service-pattern.md
│   └── repository-pattern.md
└── /decisions                # 아키텍처 결정 기록
    ├── ADR-001-database.md
    ├── ADR-002-auth.md
    └── ADR-003-ai-service.md
```

#### 문서 작성 표준

**토큰 최적화 원칙**:
- **마스터 문서**: 500줄 이하 (~5,000토큰)
- **Phase 문서**: 800줄 이하 (~8,000토큰)
- **패턴 문서**: 200줄 이하 (~2,000토큰)
- **명확한 구조**: 헤딩 계층 명확 (최대 3레벨)
- **실행 가능한 예제**: 핵심 코드 블록만 포함

### 2.2 코드 패턴 원칙

#### Feature-Based 구조

```
/features/{feature-name}
├── {feature}.controller.ts   # HTTP 요청 처리
├── {feature}.service.ts      # 비즈니스 로직
├── {feature}.repository.ts   # 데이터 액세스
├── {feature}.routes.ts       # 라우팅 정의
├── {feature}.dto.ts          # Data Transfer Object
├── {feature}.validation.ts   # Zod 검증 스키마
├── {feature}.spec.ts         # 테스트
└── index.ts                  # Public API
```

**AI 최적화 포인트**:
- 파일명 = 역할 명확 매핑
- 한 파일 = 한 책임 (Single Responsibility)
- 모든 Feature가 동일한 구조 (패턴 복제 가능)

#### 명명 규칙 표준

- **클래스**: PascalCase (`MemberService`)
- **함수/변수**: camelCase (`getMemberById`)
- **파일**: kebab-case (`member-service.ts`)
- **상수**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **타입/인터페이스**: PascalCase (`Member`, `IUser`)

### 2.3 세션 지속성 원칙

#### Serena MCP 활용

**작업 시작 시**:
```bash
/sc:load
# Serena MCP가 이전 세션 컨텍스트 로드
```

**작업 중간 (30분마다 또는 토큰 80% 도달 시)**:
```bash
/sc:save
# 현재 작업 상태를 Serena MCP에 저장
```

**저장되는 정보**:
- 현재 작업 진행 상황
- 생성된 파일 목록
- 결정 사항 (아키텍처, 패턴)
- 다음 작업 힌트

---

## 3. Phase 개요

### Phase 1: Foundation (1-2개월, Week 1-8)

**목표**: Backend 기반 구축 및 Admin API 연동

**핵심 작업**:
- Prisma 스키마 완성 및 마이그레이션
- Express 서버 구조 생성 (미들웨어, 에러 처리)
- 공유 패키지 통합 (@polibat/types, constants, utils)
- JWT 인증 시스템 구현
- 이메일 암호화 시스템 (AES-256-GCM)
- 회원 관리 API (CRUD, 상태 관리, 승인)
- 게시글 관리 API (CRUD, 좋아요/신고, AI 요약)

**산출물**:
- 15개 Prisma 모델 정의
- 회원 API 6개 엔드포인트
- 게시글 API 8개 엔드포인트
- Admin Dashboard API 완전 연동

**상세 문서**: [DEV_ROADMAP_PHASE1.md](./DEV_ROADMAP_PHASE1.md)

---

### Phase 2: Core Features (2-3개월, Week 9-20)

**목표**: 핵심 기능 완성 및 Frontend Website API 연동

**핵심 작업**:
- 댓글 시스템 (CRUD, 대댓글, 좋아요/신고)
- 투표 시스템 (생성, 참여, 결과 집계, 중복 방지)
- 불편/제안 접수 시스템 (관리자 답변, 상태 관리)
- 파일 업로드 (S3 연동, 이미지 최적화)
- 이메일 발송 (SES, 템플릿)
- AI MVP 기능 (3줄 요약, 감정 분석 온도계)
- Frontend Website API 연동 (page-manager.js, login.js)

**산출물**:
- 댓글 API 5개 엔드포인트
- 투표 API 6개 엔드포인트
- 파일 업로드 API 3개 엔드포인트
- AI 서비스 2개 기능
- Frontend Website 완전 연동

**상세 문서**: [DEV_ROADMAP_PHASE2.md](./DEV_ROADMAP_PHASE2.md)

---

### Phase 3: Enhancement (2-3개월, Week 21-32)

**목표**: 고도화 기능 및 AI 중기 기능

**핵심 작업**:
- 실시간 알림 (WebSocket, Socket.IO)
- 고급 검색 (Elasticsearch, 전문 검색)
- 데이터 분석 대시보드 (Chart.js 고도화)
- AI 중기 기능 1 (오늘의 정치 AI 브리핑)
- AI 중기 기능 2 (정치인 글 작성 지원)
- 성능 최적화 (쿼리 최적화, Redis 캐싱, CDN)

**산출물**:
- WebSocket 서버 구축
- Elasticsearch 인덱싱
- AI 브리핑 자동화 (크론잡)
- API 응답 시간 50% 개선

**상세 문서**: [DEV_ROADMAP_PHASE3.md](./DEV_ROADMAP_PHASE3.md)

---

### Phase 4: Scale (지속적, Quarter 5+)

**목표**: 확장 및 장기 기능

**핵심 작업**:
- AI 장기 기능 (팩트체크, Vector DB, 연관 정보 추천)
- 다국어 지원 (i18n, 한국어/영어)
- 모바일 앱 (React Native, iOS/Android)

**산출물**:
- Vector DB 연동 (Pinecone/Weaviate)
- 다국어 지원 시스템
- 모바일 앱 출시

**상세 문서**: [DEV_ROADMAP_PHASE4.md](./DEV_ROADMAP_PHASE4.md)

---

## 4. 개발 프로세스

### 4.1 작업 흐름

```
1. 세션 시작
   └─> /sc:load (이전 컨텍스트 복원)

2. 작업 계획
   └─> DEV_ROADMAP_PHASE{N}.md 읽기
   └─> TodoWrite로 작업 목록 생성

3. 개발 실행
   └─> 코드 작성
   └─> 테스트 실행
   └─> 검증 완료

4. 중간 저장 (30분마다 또는 토큰 80%)
   └─> /sc:save (진행 상황 저장)

5. 마일스톤 완료
   └─> 체크포인트 문서 작성
   └─> 다음 Week/Phase 이동
```

### 4.2 품질 보증 체크리스트

#### 코드 품질
- [ ] TypeScript 타입 안정성 (타입 추론 100%)
- [ ] 에러 처리 (try-catch, 전역 에러 핸들러)
- [ ] 테스트 커버리지 80% 이상

#### 보안
- [ ] 인증/인가 검증 (JWT, RBAC)
- [ ] 데이터 보호 (이메일 암호화, 비밀번호 해싱)

#### 성능
- [ ] API 응답 시간 < 200ms
- [ ] 데이터베이스 쿼리 최적화 (인덱스, N+1 방지)

#### 문서화
- [ ] 코드 주석 (복잡한 로직에만)
- [ ] 세션 문서 (claudedocs/)
- [ ] API 명세 업데이트

---

## 5. 컨텍스트 관리 전략

### 5.1 세션 관리 프로토콜

#### 세션 시작 (매 세션 필수)

```bash
/sc:load
```

**로드되는 정보**:
- 이전 세션 진행 상황
- 완료된 작업 목록
- 현재 작업 컨텍스트
- 다음 작업 힌트

#### 작업 중간 저장 (30분마다 또는 토큰 80% 도달 시)

```bash
/sc:save
```

**저장되는 정보**:
- 현재 작업 상태
- 생성된 파일 목록
- 결정 사항
- 에러 및 해결 방법
- 다음 작업 힌트

#### 체크포인트 생성 (주요 마일스톤 완료 시)

```markdown
# 세션 체크포인트

## Phase 1 Week 3 완료

### 완료된 작업
- [x] JWT 인증 서비스
- [x] 인증 미들웨어
- [x] 이메일 암호화

### 주요 결정
- JWT 만료: Access 15분, Refresh 7일
- Redis에 Refresh Token 저장

### 다음 작업
- 회원 관리 API 구현
```

### 5.2 문서 로딩 전략

**효율적인 컨텍스트 로딩**:

1. **세션 시작 시**: DEV_ROADMAP.md (마스터)만 로드 (~5,000토큰)
2. **특정 Phase 작업 시**: 해당 Phase 문서만 로드 (~8,000토큰)
3. **구현 검증 시**: CODEBASE_STATUS.md만 로드 (~3,000토큰)
4. **패턴 참조 시**: 해당 패턴 문서만 로드 (~2,000토큰)

**총 토큰 사용량**: 최대 10,000토큰 이하 (Claude Code 제한의 40%)

---

## 6. 예상 일정 및 리소스

### 6.1 개발 기간

| Phase | 기간 | 주요 마일스톤 |
|-------|------|---------------|
| Phase 1 | 1-2개월 | Backend 기반 구축, Admin API 연동 |
| Phase 2 | 2-3개월 | 핵심 기능 완성, Frontend API 연동 |
| Phase 3 | 2-3개월 | 고도화 기능, AI 중기 기능 |
| Phase 4 | 지속적 | 확장 및 장기 기능 |

**총 개발 기간**: 약 6-8개월 (MVP 완성 기준)

### 6.2 팀 구성 (권장)

- **Backend 개발자**: 1명
- **Frontend 개발자**: 1명 (Admin + Website 담당)
- **DevOps/인프라**: 0.5명 (초기 설정 후 유지보수)
- **AI 엔지니어**: 0.5명 (Phase 2 이후 투입)

### 6.3 예상 비용

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

---

## 7. 참고 자료

### 7.1 프로젝트 문서
- [TO-BE-ARCHITECTURE.md](./TO-BE-ARCHITECTURE.md) - 전체 아키텍처 명세
- [MONOREPO_GUIDE.md](./MONOREPO_GUIDE.md) - Turborepo 사용 가이드
- [CLAUDE.md](./CLAUDE.md) - 프로젝트 개발 지침

### 7.2 외부 참고 자료
- **Claude Code 공식 문서**: https://docs.claude.com/claude-code
- **Prisma 문서**: https://www.prisma.io/docs
- **Turborepo 문서**: https://turbo.build/repo
- **React Query 문서**: https://tanstack.com/query

### 7.3 연락처
**프로젝트 관리**: [프로젝트 관리자]
**기술 문의**: [기술 리더]
**문서 수정**: [GitHub Repository]

---

**작성**: Claude Code (SuperClaude Framework)
**버전**: 2.0 (토큰 최적화)
**작성일**: 2025-10-19
**변경 이력**:
- v1.0 (2025-10-18): 초기 버전 (26,294토큰)
- v2.0 (2025-10-19): 문서 분할 구조로 최적화 (~5,000토큰)
