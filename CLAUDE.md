# CLAUDE.md

## 🌐 언어 설정 (Language Preference)

**중요 (IMPORTANT)**: 모든 응답은 **한글로 작성**해주세요. 기술 용어는 영어와 한글을 병기하되, 설명과 대화는 한글을 우선합니다.

**Response Language**: All responses should be in **Korean (한글)**. Technical terms may include English in parentheses, but explanations and conversations must prioritize Korean.

**예시 (Example)**:
- ✅ "인증(Authentication) 시스템을 구현했습니다."
- ✅ "타입스크립트(TypeScript) 컴파일 오류를 수정했습니다."
- ❌ "Implemented authentication system."

---

## 프로젝트 개요 (Project Overview)

- **Monorepo structure** (Turborepo)
- **Apps**: admin, web, api
- **Packages**: types, constants, utils
- **Legacy**: legacy/admin, legacy/front

## Essential Documentation

모든 프로젝트 문서는 `doc/` 폴더 하위에 카테고리별로 구분되어 있습니다:
- `doc/architecture/` - 아키텍처 설계, 기술 스택, 구현 현황
- `doc/roadmap/` - 개발 로드맵 및 Phase별 상세 계획
- `doc/specs/` - 프로젝트 명세, 미션, 개발 참고서
- `doc/guides/` - 개발 환경 설정 가이드
- `doc/dashboards/` - 프로젝트 현황 대시보드 (HTML)

### 프로젝트 기획 및 명세
- `doc/specs/정치방망이(POLIBAT) 지침서.md` - Project mission and vision
- `doc/specs/정치방망이(POLIBAT) 개발참고서.md` - Development guidelines
- `doc/specs/정치방망이(POLIBAT) 통합 화면명세서.md` - UI/UX specifications

### 아키텍처 및 현황
- `doc/architecture/ARCHITECTURE.md` - 아키텍처 설계 및 기술 스택 (모노레포 사용법 포함)
- `doc/architecture/INFRASTRUCTURE.md` - 인프라 환경 현황 (EC2, DB, Redis 등)
- `doc/architecture/IMPLEMENTATION_STATUS.md` - 구현 현황 (화면 + API)

### 로드맵
- `doc/roadmap/DEV_ROADMAP.md` - 마스터 로드맵 (전체 개요, ~5,000토큰)
- `doc/roadmap/DEV_ROADMAP_PHASE1.md` - Phase 1 상세 (Week 1-8)
- `doc/roadmap/DEV_ROADMAP_PHASE2.md` - Phase 2 상세 (Week 9-20)
- `doc/roadmap/DEV_ROADMAP_PHASE3.md` - Phase 3 상세 (Week 21-32)
- `doc/roadmap/DEV_ROADMAP_PHASE4.md` - Phase 4 상세 (Quarter 5+)

### 시각화 대시보드
- `doc/dashboards/project-status.html` - 프로젝트 현황 대시보드 (팀원 공유)
- `doc/dashboards/wbs.html` - WBS 진행률 대시보드

### 문서 사용 가이드

**효율적인 컨텍스트 로딩 전략**:

1. **세션 시작 시**:
   - `doc/roadmap/DEV_ROADMAP.md` (마스터)만 먼저 읽어 전체 흐름 파악 (~5,000토큰)
   - `doc/architecture/IMPLEMENTATION_STATUS.md`로 현재 구현 상태 확인 (~3,000토큰)

2. **특정 Phase 작업 시**:
   - 해당 Phase 문서만 선택적으로 로드 (~8,000토큰)
   - 예: Phase 1 작업 시 → `doc/roadmap/DEV_ROADMAP_PHASE1.md`만 읽기

3. **패턴 참조 시**:
   - `claudedocs/patterns/` 디렉토리의 특정 패턴 문서만 로드

**토큰 절감 효과**:
- 기존: 26,294토큰 (한 번에 로드 불가능)
- 최적화: 최대 10,000토큰 이하 (필요한 문서만 선택적 로드)

## Development Principles

- **Source code first**: Always examine actual code before making changes
- **AI-optimized development**: Clear abstractions, type safety, predictable patterns
- **100% functional equivalence**: Maintain original UI/UX and business logic
- **Feature-based structure**: Organize code by business features, not technical layers

## Development Environment

- **OS**: Windows 10/11
- **Shell**: PowerShell 7 (pwsh.exe)
- **Node.js**: v18+ (LTS recommended)
- **Package Manager**: npm
- **Database**: PostgreSQL 16 (원격 서버: 43.201.115.132)
- **Cache**: Redis 7 (Docker)
- **Configuration**: `C:\Users\[username]\.cursor\settings.json`

## Commands

### Database (원격 PostgreSQL 16)
```powershell
# PostgreSQL 접속 (비밀번호: Vhfflqpt183!)
psql -h 43.201.115.132 -U polibat -d polibat

# 테이블 확인
psql -h 43.201.115.132 -U polibat -d polibat -c "\dt"

# 데이터베이스 목록
psql -h 43.201.115.132 -U polibat -d polibat -c "\l"

# Prisma Studio
cd apps/api
npx prisma studio
```

### Cache (Redis Docker)
```powershell
# Redis 시작
docker compose up -d redis

# Redis 접속
docker exec -it polibat-redis redis-cli -a polibat_redis_password

# Redis 상태 확인
docker exec -it polibat-redis redis-cli -a polibat_redis_password PING
```

### Admin Dashboard
```powershell
cd apps/admin
npm install
npm start          # Development server (http://localhost:3000)
npm run build      # Production build
npm test           # Run tests
```

### Frontend Website
```powershell
cd apps/web
python -m http.server 8000  # Development server (http://localhost:8000)
```

### API Server
```powershell
cd apps/api
npm install
npm run dev        # Development server (http://localhost:4000)
npm run build      # Production build
```

## Project Architecture

### Admin Dashboard
- **Framework**: React 19.1.0 + TypeScript 4.9.5
- **Router**: React Router v7.7.0
- **Styling**: Tailwind CSS 3.4.x (DO NOT upgrade to v4)
- **Charts**: Chart.js 4.5.0 + react-chartjs-2 5.3.0
- **Icons**: Lucide React 0.525.0
- **Key Structure**: `features/`, `shared/`, `core/`

### Frontend Website
- **Structure**: HTML5, Bootstrap 3, jQuery, Vanilla JS (ES5)
- **Key Files**: `page-manager.js`, `login.js`
- **Authentication**: localStorage/sessionStorage based

### API Server
- **Framework**: Node.js + Express.js + TypeScript
- **Database**: PostgreSQL 16 (원격 서버: 43.201.115.132) + Prisma
- **Cache**: Redis 7 (Docker)
- **Authentication**: JWT + Redis
- **Security**: Helmet, CORS, Rate limiting

## Business Logic

### Entity ID Format
| Entity | Format | Example |
|--------|--------|---------|
| Member | M + 6 digits | M000001 |
| Post | P + 6 digits | P000001 |
| Comment | C + 6 digits | C000001 |
| Vote | V + 6 digits | V000001 |
| Notice | N + 6 digits | N000001 |

### Status Values
- **Member**: active, inactive, suspended, pending
- **Post**: published, hidden, deleted
- **Comment**: active, hidden, deleted
- **Vote**: active, closed, cancelled
- **Report**: pending, resolved, dismissed

## Development Guidelines

### Admin Dashboard Rules
1. **Type Safety**: Use optional chaining (`data?.property || defaultValue`)
2. **Filter Triple**: Implement state + display + reset for all filters
3. **Card Click Logic**: Auto-apply filters when clicking statistics cards
4. **Cross-Page Navigation**: Use URL parameters for filter persistence

### Frontend Rules
1. **ES5 Only**: No modern JavaScript features
2. **jQuery Check**: Verify jQuery is loaded before use
3. **File Loading Order**: CSS → JS → Page-specific JS
4. **Login Testing**: Use test accounts for development

### WBS 현행화 규칙 (Work Breakdown Structure Updates)

**중요**: 개발 작업 완료 후 반드시 `wbs.html`을 업데이트해야 합니다.

#### 업데이트 시점
1. **Phase/Week 작업 완료 시**: 해당 작업 항목 상태 변경
2. **새로운 기능 추가 시**: WBS에 작업 항목 추가
3. **마일스톤 달성 시**: 전체 진행률 업데이트
4. **세션 종료 전**: 당일 작업 내역 반영

#### 업데이트 방법
```bash
# wbs.html 파일을 직접 수정
# - 완료된 작업: 상태를 "완료"로 변경
# - 진행 중인 작업: 상태를 "진행 중"으로 변경
# - 진행률 업데이트: percentage 값 수정
```

#### WBS 구조
- **Phase 1-4**: 주요 개발 단계
- **Week 1-N**: 세부 작업 주차
- **Task**: 개별 작업 항목
- **Status**: 대기/진행 중/완료/보류
- **Progress**: 진행률 (%)

#### 자동화 명령어 (권장)
```bash
# 작업 완료 후 자동으로 WBS 업데이트
/sc:document wbs.html --type update --phase [N] --week [N] --status [완료/진행중/대기]
```

## Safety Patterns

```typescript
// Safe data access
const value = data?.property || defaultValue;
const items = Array.isArray(data) ? data : [];

// Safe array operations
const filteredItems = items?.filter(item => item.status === 'active') || [];

// Safe function calls
const result = callback?.(data);
```

## Testing

### Admin Dashboard
- **Unit Tests**: React Testing Library + Jest
- **Test Files**: `*.test.tsx`, `*.test.ts`
- **Coverage**: Components, utilities, hooks

### Frontend Website
- **Manual Testing**: Browser DevTools
- **Cross-Browser**: Chrome, Firefox, Safari, Edge
- **Mobile**: Responsive design testing

## SuperClaude Commands

- `/sc:help` - Show available commands
- `/sc:implement [feature]` - Implement specific feature
- `/sc:analyze [path]` - Analyze code structure
- `/sc:load` - Load session context (auto-triggered)
- `/sc:save` - Save session context (auto-triggered at 80% token usage)

## Session Management

- **Auto-load**: Context restored on session start
- **Auto-save**: Context saved at 80% token usage or every 30 minutes
- **Token Monitoring**: Required for optimal performance
- **Context Persistence**: Maintains development state across sessions

## Important Warnings

1. **Tailwind CSS v3.4 only** - Do not upgrade to v4
2. **Optional chaining required** - Always use `?.` for data access
3. **ES5 syntax for frontend** - No modern JavaScript features
4. **PowerShell commands only** - Use Windows PowerShell syntax
5. **No API integration** - All data is currently hardcoded samples

## Reference

- **Detailed Implementation**: `doc/roadmap/DEV_ROADMAP.md` (Appendix A: Codebase Implementation Status)
- **Architecture**: `doc/architecture/ARCHITECTURE.md`
- **Project Mission**: `doc/specs/정치방망이(POLIBAT) 지침서.md`