# DEV_ROADMAP - Phase 1: Foundation

**기간**: Week 1-8 (1-2개월)
**목표**: Backend 기반 구축 및 Admin API 연동
**작성일**: 2025-10-19
**버전**: 1.0

---

## 📋 Phase 1 개요

### 환경 구성
- **PostgreSQL 18**: Windows 로컬 설치 (`C:\Program Files\PostgreSQL\18`)
- **Redis 7**: Docker 컨테이너로 실행
- **데이터베이스**: `polibat_dev` (사용자: `polibat`)
- **Node.js**: v18+ LTS
- **Package Manager**: npm

### 목표
- Prisma 스키마 완성 및 데이터베이스 마이그레이션
- Express 서버 기본 구조 생성
- JWT 인증 시스템 구현
- 회원 관리 API 구현
- 게시글 관리 API 구현
- Admin Dashboard API 완전 연동

### 산출물
- 15개 Prisma 모델 정의
- 회원 API 8개 엔드포인트
- 게시글 API 8개 엔드포인트
- Admin Dashboard 16개 화면 API 연동

---

## Week 1: Prisma Schema & Database Setup

### Day 1-3: Prisma 스키마 설계 및 검증 (8시간)

#### 목표
✅ **완료**: 15개 Prisma 모델 정의 완료

#### 컨텍스트
- `apps/api/prisma/schema.prisma` 파일 확인
- 모든 비즈니스 엔티티 모델링 완료
- ID 생성 규칙 적용 (NM000001, PM000001 등)

#### 완료된 모델
1. ✅ Member (회원)
2. ✅ MemberStatusHistory (회원 상태 이력)
3. ✅ Post (게시글)
4. ✅ Comment (댓글)
5. ✅ Vote (투표)
6. ✅ VoteOption (투표 옵션)
7. ✅ VoteParticipation (투표 참여)
8. ✅ Reaction (좋아요/싫어요)
9. ✅ Report (신고)
10. ✅ Suggestion (불편/제안)
11. ✅ Notice (공지사항)
12. ✅ Popup (팝업)
13. ✅ Banner (배너)
14. ✅ PolicyTemplate (정책 템플릿)
15. ✅ PolicyContent (정책 콘텐츠)

#### 검증
```bash
cd apps/api
npx prisma validate
npx prisma format
```

### Day 4-5: 데이터베이스 마이그레이션 (6시간)

#### 목표
✅ **완료**: PostgreSQL 18 (Windows 로컬) 데이터베이스 초기 마이그레이션 실행

#### 컨텍스트
- **PostgreSQL 18: Windows 로컬 설치** (Docker 아님)
- Prisma 스키마를 SQL로 생성하여 직접 마이그레이션
- 테스트 데이터 시드 스크립트 작성

#### 작업
```powershell
# PostgreSQL 연결 확인 (Windows 로컬)
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -lqt | Select-String "polibat_dev"

# 마이그레이션 SQL 생성
cd apps/api
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > migration_windows.sql

# PostgreSQL에 마이그레이션 적용 (Windows 로컬)
Get-Content migration_windows.sql | & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U polibat -d polibat_dev

# Prisma Client 생성
npx prisma generate

# 테이블 확인
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U polibat -d polibat_dev -c "\dt"

# (선택) 테스트 데이터 시드
npx prisma db seed
```

#### 산출물
- [x] `migration_windows.sql` - Windows PostgreSQL 마이그레이션 파일
- [ ] `prisma/seed.ts` - 테스트 데이터 시드 스크립트
- [x] `.env` - DATABASE_URL 설정 (Windows 로컬 PostgreSQL)

#### 메모리 저장
```markdown
**Week 1 완료**: Prisma 스키마 완성, 데이터베이스 마이그레이션 성공
- 15개 모델 정의 완료
- PostgreSQL 18 (Windows 로컬) 연결 확인
- 테스트 데이터 시드 완료
```

---

## Week 2: Express Server & JWT Authentication

### Day 1-2: Express 서버 기본 구조 (6시간)

#### 목표
✅ **완료**: Express 서버 기본 구조 생성

#### 컨텍스트
- `apps/api/src/core/` - 서버 핵심 설정
- `apps/api/src/shared/` - 공유 유틸리티 및 미들웨어

#### 완료된 구조
```
apps/api/src/
├── core/
│   ├── app.ts          ✅ Express 앱 설정
│   ├── server.ts       ✅ 서버 시작
│   └── database.ts     ✅ Prisma Client 설정
├── shared/
│   ├── middleware/
│   │   ├── error-handler.ts   ✅ 전역 에러 핸들러
│   │   ├── logger.ts           ✅ 로깅 미들웨어
│   │   ├── authenticate.ts     ✅ JWT 인증 미들웨어
│   │   └── validator.ts        ✅ Zod 검증 미들웨어
│   ├── utils/
│   │   ├── api-response.ts     ✅ 표준 응답 포맷
│   │   ├── error-codes.ts      ✅ 에러 코드 정의
│   │   ├── jwt.ts              ✅ JWT 유틸리티
│   │   └── password.ts         ✅ 비밀번호 유틸리티
│   └── config/
│       └── env.ts              ✅ 환경 변수 설정
└── features/
    └── health/
        ├── health.controller.ts   ✅ 헬스체크 컨트롤러
        ├── health.routes.ts       ✅ 헬스체크 라우트
        └── index.ts               ✅ Feature 진입점
```

#### 검증
```bash
cd apps/api
npm run dev
# http://localhost:4000/api/health 접속 확인
```

### Day 3-5: JWT 인증 시스템 구현 (8시간)

#### 목표
✅ **완료**: JWT 기반 인증 시스템 구현

#### 컨텍스트
- Access Token: 15분 만료
- Refresh Token: 7일 만료
- bcryptjs로 비밀번호 해싱 (10 rounds)

#### 완료된 API
1. ✅ POST `/api/auth/signup` - 회원가입
2. ✅ POST `/api/auth/login` - 로그인
3. ✅ POST `/api/auth/refresh` - 토큰 갱신
4. ✅ GET `/api/auth/me` - 현재 사용자 정보
5. ✅ POST `/api/auth/change-password` - 비밀번호 변경
6. 🔲 POST `/api/auth/logout` - 로그아웃 (Redis 필요)
7. 🔲 POST `/api/auth/forgot-password` - 비밀번호 찾기
8. 🔲 POST `/api/auth/reset-password` - 비밀번호 재설정

#### 구현된 기능
```typescript
// JWT 토큰 생성 및 검증
JwtUtil.generateAccessToken(payload)
JwtUtil.generateRefreshToken(payload)
JwtUtil.verifyAccessToken(token)
JwtUtil.verifyRefreshToken(token)

// 비밀번호 해싱 및 검증
PasswordUtil.hash(password)
PasswordUtil.verify(password, hash)
PasswordUtil.validateStrength(password)

// 인증 미들웨어
authenticateJwt - 필수 JWT 인증
optionalAuthenticateJwt - 선택적 JWT 인증
requireMemberStatus(...statuses) - 회원 상태 검증
requireMemberType(...types) - 회원 유형 검증
requireAdmin - 관리자 권한 검증
```

#### 미완료 작업 (Redis 필요)
- [ ] 로그아웃 시 Refresh Token 삭제
- [ ] Access Token 블랙리스트 (선택사항)
- [ ] 비밀번호 재설정 토큰 관리

#### 메모리 저장
```markdown
**Week 2 완료**: Express 서버 구조 + JWT 인증 70% 완료
- 회원가입, 로그인, 토큰 갱신 완료
- JWT 미들웨어 및 권한 검증 완료
- Redis 연동 작업 남음 (로그아웃, 비밀번호 재설정)
```

---

## Week 3: Member Management API

### Day 1-2: 회원 목록 및 상세 조회 (6시간)

#### 목표
✅ **완료**: 회원 관리 조회 API 구현

#### 완료된 API
1. ✅ GET `/api/members` - 회원 목록 조회 (관리자 전용)
   - 필터링: memberType, status
   - 검색: email, nickname
   - 페이지네이션: page, limit
   - 정렬: createdAt DESC

2. ✅ GET `/api/members/:userId` - 회원 상세 조회
   - 본인 또는 관리자만 조회
   - 정치인 정보 포함

#### 구현된 기능
```typescript
// MemberService
async getMembers(filters: MemberFilters, pagination: Pagination)
async getMemberById(userId: string, requesterId: string)
```

### Day 3-4: 회원 정보 수정 및 상태 관리 (6시간)

#### 목표
✅ **완료**: 회원 수정 및 상태 관리 API 구현

#### 완료된 API
3. ✅ PATCH `/api/members/:userId` - 회원 정보 수정
   - 본인: nickname, profileImage, 알림 설정
   - 관리자: status, memberType 등 모든 필드

4. ✅ PATCH `/api/members/:userId/status` - 회원 상태 변경 (관리자 전용)
   - 상태 변경 이력 자동 저장 (MemberStatusHistory)

5. ✅ GET `/api/members/:userId/status-history` - 상태 변경 이력 조회

#### 구현된 기능
```typescript
// MemberService
async updateMember(userId: string, data: UpdateMemberDto)
async updateMemberStatus(userId: string, status: MemberStatus, reason?: string)
async getMemberStatusHistory(userId: string)
```

### Day 5: 회원 탈퇴 및 승인 처리 (4시간)

#### 목표
✅ **완료**: 회원 탈퇴 및 승인 API 구현

#### 완료된 API
6. ✅ DELETE `/api/members/:userId` - 회원 탈퇴
   - Soft Delete (deletedAt 설정)
   - 상태를 WITHDRAWN으로 변경

7. ✅ POST `/api/members/:userId/approve` - 정치인 승인 (관리자 전용)
   - PENDING → APPROVED 상태 변경

8. ✅ POST `/api/members/:userId/reject` - 정치인 거부 (관리자 전용)
   - PENDING → 거부 사유와 함께 상태 변경

#### 구현된 기능
```typescript
// MemberService
async deleteMember(userId: string)
async approvePolitician(userId: string, adminId: string)
async rejectPolitician(userId: string, adminId: string, reason: string)
```

#### 메모리 저장
```markdown
**Week 3 완료**: 회원 관리 API 100% 완료
- 8개 엔드포인트 구현 완료
- CRUD + 상태 관리 + 승인 처리
- Admin Dashboard 회원 관리 화면 API 연동 가능
```

---

## Week 4: Post Management API (Part 1)

### Day 1-2: 게시글 목록 및 상세 조회 (6시간)

#### 목표
게시글 조회 API 구현

#### 작업
1. GET `/api/posts` - 게시글 목록 조회
   - 필터링: boardType, status, authorId
   - 검색: title, content
   - 페이지네이션: page, limit
   - 정렬: createdAt DESC, likeCount DESC

2. GET `/api/posts/:postId` - 게시글 상세 조회
   - 조회수 증가 (viewCount++)
   - 작성자 정보 포함
   - 투표 정보 포함 (boardType이 VOTE인 경우)

#### 컨텍스트
```typescript
// PostService
async getPosts(filters: PostFilters, pagination: Pagination)
async getPostById(postId: string)
async incrementViewCount(postId: string)
```

#### 산출물
- [ ] `features/post/post.service.ts` - 게시글 서비스
- [ ] `features/post/post.repository.ts` - 게시글 레포지토리
- [ ] `features/post/post.controller.ts` - 게시글 컨트롤러
- [ ] `features/post/post.routes.ts` - 게시글 라우트
- [ ] `features/post/post.dto.ts` - 게시글 DTO
- [ ] `features/post/post.validation.ts` - Zod 검증 스키마

### Day 3-4: 게시글 작성 및 수정 (6시간)

#### 목표
게시글 생성 및 수정 API 구현

#### 작업
3. POST `/api/posts` - 게시글 작성
   - 인증 필수 (JWT)
   - 게시판 유형별 검증
   - 자동 postId 생성 (FB000001, PB000001, VP000001)
   - 이미지 업로드 (추후 S3 연동)

4. PATCH `/api/posts/:postId` - 게시글 수정
   - 본인만 수정 가능
   - 제목, 내용, 이미지 수정 가능

#### 컨텍스트
```typescript
// PostService
async createPost(authorId: string, data: CreatePostDto)
async updatePost(postId: string, authorId: string, data: UpdatePostDto)
```

#### 산출물
- [ ] `features/post/post.service.ts` - 작성/수정 로직
- [ ] `features/post/post.validation.ts` - 작성/수정 검증

### Day 5: 게시글 삭제 및 상태 관리 (4시간)

#### 목표
게시글 삭제 및 상태 관리 API 구현

#### 작업
5. DELETE `/api/posts/:postId` - 게시글 삭제
   - 본인 또는 관리자만 삭제 가능
   - Soft Delete (status: DELETED, deletedAt 설정)

6. PATCH `/api/posts/:postId/status` - 게시글 상태 변경 (관리자 전용)
   - PUBLISHED, PINNED, HIDDEN, DELETED

#### 컨텍스트
```typescript
// PostService
async deletePost(postId: string, userId: string, isAdmin: boolean)
async updatePostStatus(postId: string, status: PostStatus)
```

#### 메모리 저장
```markdown
**Week 4 완료**: 게시글 관리 API 60% 완료
- 게시글 CRUD 6개 엔드포인트 구현
- 좋아요/신고 API 미완료 (Week 5로 이월)
```

---

## Week 5: Post Management API (Part 2)

### Day 1-3: 좋아요/싫어요 시스템 (8시간)

#### 목표
게시글 및 댓글 반응 시스템 구현

#### 작업
1. POST `/api/posts/:postId/react` - 게시글 반응
   - reactionType: LIKE, DISLIKE
   - 중복 반응 방지 (Prisma unique constraint)
   - 이전 반응 취소 후 새 반응 생성
   - likeCount, dislikeCount 자동 업데이트

2. DELETE `/api/posts/:postId/react` - 게시글 반응 취소

3. GET `/api/members/:userId/reactions` - 회원 반응 이력 조회

#### 컨텍스트
```typescript
// ReactionService
async createReaction(userId: string, targetType: ReactionTargetType, targetId: string, reactionType: ReactionType)
async deleteReaction(userId: string, targetType: ReactionTargetType, targetId: string)
async getUserReactions(userId: string, pagination: Pagination)
```

#### 산출물
- [ ] `features/reaction/reaction.service.ts`
- [ ] `features/reaction/reaction.repository.ts`
- [ ] `features/reaction/reaction.controller.ts`
- [ ] `features/reaction/reaction.routes.ts`

### Day 4-5: 신고 시스템 (6시간)

#### 목표
게시글 및 댓글 신고 시스템 구현

#### 작업
1. POST `/api/posts/:postId/report` - 게시글 신고
   - reason: 신고 사유 (필수)
   - 자동 reportId 생성
   - reportCount 증가

2. GET `/api/reports` - 신고 목록 조회 (관리자 전용)
   - 필터링: status, targetType
   - 정렬: createdAt DESC

3. PATCH `/api/reports/:reportId` - 신고 처리 (관리자 전용)
   - status: REVIEWING, RESOLVED, REJECTED, DEFERRED
   - actionType: HIDE, DELETE, RESTORE
   - adminNote: 처리 내용

#### 컨텍스트
```typescript
// ReportService
async createReport(reporterId: string, targetType: ReportTargetType, targetId: string, reason: string)
async getReports(filters: ReportFilters, pagination: Pagination)
async processReport(reportId: string, adminId: string, status: ReportStatus, actionType?: ActionType, adminNote?: string)
```

#### 산출물
- [ ] `features/report/report.service.ts`
- [ ] `features/report/report.repository.ts`
- [ ] `features/report/report.controller.ts`
- [ ] `features/report/report.routes.ts`

#### 메모리 저장
```markdown
**Week 5 완료**: 게시글 관리 API 100% 완료
- 좋아요/싫어요 시스템 완료
- 신고 시스템 완료
- Admin Dashboard 게시글 관리 화면 API 연동 가능
```

---

## Week 6: Email Encryption & Redis Integration

### Day 1-2: 이메일 암호화 시스템 (6시간)

#### 목표
AES-256-GCM 이메일 암호화 구현

#### 작업
1. `EncryptionUtil` 구현
   - AES-256-GCM 암호화/복호화
   - IV (Initialization Vector) 자동 생성
   - Auth Tag 검증

2. Member 모델 이메일 암호화 적용
   - 회원가입 시 이메일 암호화
   - 로그인 시 이메일 검색 (암호화된 값으로)

#### 컨텍스트
```typescript
// EncryptionUtil
class EncryptionUtil {
  static encrypt(text: string): string
  static decrypt(encrypted: string): string
}

// MemberRepository
async findByEmail(email: string) {
  const encryptedEmail = EncryptionUtil.encrypt(email);
  return prisma.member.findUnique({ where: { email: encryptedEmail } });
}
```

#### 산출물
- [ ] `shared/utils/encryption.ts` - 암호화 유틸리티
- [ ] `.env.example` - ENCRYPTION_KEY 추가

### Day 3-5: Redis 연동 및 로그아웃 구현 (8시간)

#### 목표
Redis 기반 토큰 관리 및 로그아웃 구현

#### 작업
1. Redis Client 설정
   - ioredis 라이브러리 사용
   - 연결 관리 및 에러 처리
   - **Redis는 Docker로 실행** (PostgreSQL과 다름)

2. Refresh Token 저장
   - 로그인 시 Redis에 저장
   - Key: `refresh:{userId}`
   - Value: refreshToken
   - TTL: 7일

3. 로그아웃 구현
   - Redis에서 Refresh Token 삭제
   - Access Token 블랙리스트 추가 (선택)

4. 토큰 갱신 검증 강화
   - Redis에서 Refresh Token 조회 및 검증

#### 환경 설정
```powershell
# Redis 시작 (Docker)
docker compose up -d redis

# Redis 연결 테스트
docker exec -it polibat-redis redis-cli -a polibat_redis_password PING
# 예상 출력: PONG

# Redis 상태 확인
docker compose ps
```

#### 컨텍스트
```typescript
// Redis Client (이미 구현됨)
// apps/api/src/core/redis.ts
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

// AuthService
async login(email: string, password: string) {
  // ... JWT 생성
  await redis.setex(`refresh:${userId}`, 604800, refreshToken); // 7일
}

async logout(userId: string, accessToken: string) {
  await redis.del(`refresh:${userId}`);
  // 선택: Access Token 블랙리스트
  const ttl = JwtUtil.getTokenExpiration(accessToken);
  await redis.setex(`blacklist:${accessToken}`, ttl, '1');
}
```

#### 산출물
- [x] `core/redis.ts` - Redis Client 설정 (이미 존재)
- [ ] `features/auth/auth.service.ts` - 로그아웃 구현
- [x] `docker-compose.yml` - Redis 설정 완료 (PostgreSQL 주석 처리)

#### 메모리 저장
```markdown
**Week 6 완료**: 보안 기능 강화
- 이메일 암호화 (AES-256-GCM) 완료
- Redis 연동 및 로그아웃 완료
- JWT 인증 시스템 100% 완료
```

---

## Week 7: Comment & Vote API

### Day 1-3: 댓글 시스템 (8시간)

#### 목표
댓글 CRUD 및 반응 시스템 구현

#### 작업
1. POST `/api/posts/:postId/comments` - 댓글 작성
   - 인증 필수
   - 자동 commentId 생성 (FB000001-CM0001)
   - 게시글 commentCount 증가

2. GET `/api/posts/:postId/comments` - 댓글 목록 조회
   - 페이지네이션
   - 작성자 정보 포함

3. PATCH `/api/comments/:commentId` - 댓글 수정
   - 본인만 수정 가능

4. DELETE `/api/comments/:commentId` - 댓글 삭제
   - 본인 또는 관리자만 삭제
   - Soft Delete

5. POST `/api/comments/:commentId/react` - 댓글 반응
   - 좋아요/싫어요

#### 컨텍스트
```typescript
// CommentService
async createComment(postId: string, authorId: string, content: string)
async getComments(postId: string, pagination: Pagination)
async updateComment(commentId: string, authorId: string, content: string)
async deleteComment(commentId: string, userId: string, isAdmin: boolean)
```

#### 산출물
- [ ] `features/comment/comment.service.ts`
- [ ] `features/comment/comment.repository.ts`
- [ ] `features/comment/comment.controller.ts`
- [ ] `features/comment/comment.routes.ts`

### Day 4-5: 투표 시스템 (6시간)

#### 목표
투표 생성 및 참여 API 구현

#### 작업
1. POST `/api/votes` - 투표 생성 (관리자 전용)
   - 게시글과 1:1 연결
   - 투표 옵션 배열 생성
   - startDate, endDate 설정

2. GET `/api/votes/:voteId` - 투표 상세 조회
   - 투표 옵션 및 현재 결과 포함

3. POST `/api/votes/:voteId/cast` - 투표 참여
   - 인증 필수
   - 중복 투표 방지 (Prisma unique constraint)
   - voteCount, totalVoters 자동 업데이트

4. GET `/api/votes/:voteId/results` - 투표 결과 조회
   - 옵션별 득표수 및 비율

#### 컨텍스트
```typescript
// VoteService
async createVote(postId: string, options: VoteOptionDto[], settings: VoteSettings)
async getVote(voteId: string)
async castVote(voteId: string, voterId: string, optionId: string)
async getVoteResults(voteId: string)
```

#### 산출물
- [ ] `features/vote/vote.service.ts`
- [ ] `features/vote/vote.repository.ts`
- [ ] `features/vote/vote.controller.ts`
- [ ] `features/vote/vote.routes.ts`

#### 메모리 저장
```markdown
**Week 7 완료**: 댓글 및 투표 시스템
- 댓글 CRUD 5개 엔드포인트 완료
- 투표 생성 및 참여 4개 엔드포인트 완료
- Admin Dashboard 댓글/투표 관리 화면 API 연동 가능
```

---

## Week 8: Suggestion, Notice, & Admin Features

### Day 1-2: 불편/제안 접수 시스템 (6시간)

#### 목표
불편사항 및 제안사항 접수 API 구현

#### 작업
1. POST `/api/suggestions` - 접수 작성
   - suggestionType: FEATURE, COMPLAINT, VOTE_PROPOSAL
   - 자동 suggestionId 생성 (RC000001, RS000001)

2. GET `/api/suggestions` - 접수 목록 조회
   - 본인 또는 관리자만 조회
   - 필터링: suggestionType, status

3. GET `/api/suggestions/:suggestionId` - 접수 상세 조회

4. PATCH `/api/suggestions/:suggestionId/reply` - 답변 작성 (관리자 전용)
   - adminReply, adminId 저장
   - status: RESOLVED

#### 컨텍스트
```typescript
// SuggestionService
async createSuggestion(userId: string, data: CreateSuggestionDto)
async getSuggestions(userId: string, isAdmin: boolean, filters: SuggestionFilters)
async getSuggestionById(suggestionId: string)
async replyToSuggestion(suggestionId: string, adminId: string, reply: string)
```

#### 산출물
- [ ] `features/suggestion/suggestion.service.ts`
- [ ] `features/suggestion/suggestion.repository.ts`
- [ ] `features/suggestion/suggestion.controller.ts`
- [ ] `features/suggestion/suggestion.routes.ts`

### Day 3-4: 공지사항 및 정책 관리 (6시간)

#### 목표
공지사항 및 서비스 정책 API 구현

#### 작업
**공지사항**:
1. POST `/api/notices` - 공지사항 작성 (관리자 전용)
2. GET `/api/notices` - 공지사항 목록 조회
3. GET `/api/notices/:noticeId` - 공지사항 상세 조회

**정책 관리**:
4. POST `/api/policies/templates` - 정책 템플릿 생성 (관리자)
5. GET `/api/policies/templates` - 정책 템플릿 목록
6. POST `/api/policies/contents` - 정책 콘텐츠 생성 (관리자)
7. GET `/api/policies/contents` - 정책 콘텐츠 조회 (대상별)

#### 산출물
- [ ] `features/notice/` - 공지사항 Feature
- [ ] `features/policy/` - 정책 관리 Feature

### Day 5: 팝업 및 배너 관리 (4시간)

#### 목표
팝업 및 배너 관리 API 구현

#### 작업
**팝업**:
1. POST `/api/popups` - 팝업 생성 (관리자)
2. GET `/api/popups` - 활성 팝업 조회
3. PATCH `/api/popups/:popupId` - 팝업 수정

**배너**:
4. POST `/api/banners` - 배너 생성 (관리자)
5. GET `/api/banners` - 활성 배너 조회
6. PATCH `/api/banners/:bannerId` - 배너 수정

#### 산출물
- [ ] `features/popup/` - 팝업 Feature
- [ ] `features/banner/` - 배너 Feature

#### 메모리 저장
```markdown
**Week 8 완료**: Phase 1 완료! 🎉
- 불편/제안 접수 시스템 완료
- 공지사항 및 정책 관리 완료
- 팝업 및 배너 관리 완료
- Admin Dashboard 16개 화면 API 연동 완료
```

---

## Phase 1 체크리스트

### 데이터베이스
- [x] Prisma 스키마 15개 모델 정의
- [x] PostgreSQL 18 마이그레이션 (Windows 로컬)
- [ ] 테스트 데이터 시드 스크립트

### 인프라
- [x] Express 서버 기본 구조
- [x] 전역 에러 핸들러
- [x] 로깅 미들웨어
- [x] Redis 연동 (Docker)
- [x] Docker Compose 설정 (Redis만 사용)

### 인증 & 보안
- [x] JWT 인증 시스템 (70%)
- [x] 비밀번호 해싱 (bcryptjs)
- [ ] 이메일 암호화 (AES-256-GCM)
- [ ] 로그아웃 기능 (Redis)
- [ ] 비밀번호 재설정

### 회원 관리 API
- [x] 회원 목록 조회 (8개 엔드포인트)
- [x] 회원 상세 조회
- [x] 회원 정보 수정
- [x] 회원 상태 관리
- [x] 회원 탈퇴
- [x] 정치인 승인/거부

### 게시글 관리 API
- [ ] 게시글 CRUD (6개 엔드포인트)
- [ ] 좋아요/싫어요 시스템
- [ ] 신고 시스템
- [ ] 게시글 상태 관리

### 댓글 & 투표
- [ ] 댓글 CRUD (5개 엔드포인트)
- [ ] 투표 생성 및 참여 (4개 엔드포인트)

### 기타 기능
- [ ] 불편/제안 접수 (4개 엔드포인트)
- [ ] 공지사항 관리 (3개 엔드포인트)
- [ ] 정책 관리 (4개 엔드포인트)
- [ ] 팝업 관리 (3개 엔드포인트)
- [ ] 배너 관리 (3개 엔드포인트)

### 테스트 & 문서화
- [ ] Unit Tests (Jest)
- [ ] Integration Tests
- [ ] API 명세서 (Swagger/OpenAPI)
- [ ] Postman Collection

---

## 다음 단계: Phase 2

Phase 1 완료 후 Phase 2로 진행:
- 파일 업로드 (S3)
- 이메일 발송 (SES)
- AI MVP 기능 (3줄 요약, 감정 분석)
- Frontend Website API 연동

**상세 내용**: [DEV_ROADMAP_PHASE2.md](./DEV_ROADMAP_PHASE2.md)

---

**작성**: Claude Code (SuperClaude Framework)
**버전**: 1.0
**작성일**: 2025-10-19
**최종 수정**: 2025-10-19
