# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 📄 File Synchronization / 파일 동기화

**CRITICAL**: When modifying CLAUDE.md, you MUST also update CLAUDE_KO.md to maintain synchronization between both files. Both files should contain the same information in their respective languages.

**필수**: CLAUDE.md 파일을 수정할 때는 반드시 CLAUDE_KO.md 파일도 함께 수정하여 두 파일 간의 동기화를 유지해야 합니다. 두 파일은 각각의 언어로 동일한 정보를 포함해야 합니다.

## Project Overview
정치방망이 (PoliBAT) - A political community platform facilitating communication between politicians and citizens. The project consists of two separate applications:
- **Admin Dashboard** (/admin) - React TypeScript admin panel for managing platform content
- **Frontend Website** (/front) - Vanilla HTML/JS/CSS public-facing website

## 📚 Essential Project Documentation / 필수 프로젝트 문서

To fully understand the PoliBAT project, thoroughly review the following documents:

### Required Reading / 필수 숙지 문서
1. **정치방망이(POLIBAT) 지침서.md**
   - Project mission, vision, and strategy
   - Branding and character (오구링 mascot)
   - AI feature roadmap and differentiation points
   - Business rules and platform structure

2. **정치방망이(POLIBAT) 개발참고서.md**
   - ID structure definitions (NM, PM, PA, FB, PB, etc.)
   - Status value definitions (member, post, vote, action status)
   - Development requirements (email security, approval process, etc.)
   - Technical specifications and system constraints

3. **정치방망이(POLIBAT) 통합 화면명세서.md**
   - Detailed screen specifications for frontend and backoffice
   - Page-by-page functionality and UI/UX definitions
   - Common components and business rules
   - ⚠️ When specifications are unclear, refer to corresponding screens in **정치방망이(POLIBAT) 화면캡쳐.pdf**
   - The PDF contains actual screen captures with page numbers that match the numbering in the specification document

4. **정치방망이(POLIBAT) 화면캡쳐.pdf**
   - Actual UI/UX screen captures with visual references
   - ⚠️ Read when needed to minimize context usage
   - Use this for visual verification when the markdown specification is insufficient

### Reference Documentation / 참고 문서
- `C:\polibat\admin\CLAUDE.md` - Admin dashboard specific guidelines (React/TypeScript)
- `C:\polibat\front\CLAUDE.md` - Frontend website specific guidelines (HTML/JS/jQuery)

## 🔧 Development Principles / 개발 원칙

### Documentation-Based Development Priority / 문서 기반 개발 우선순위

1. **Source Code First (소스 코드 우선)**
   - Implementation should follow actual source code patterns
   - Documentation serves as reference; actual implemented code is the final standard
   - Always verify implementation in source before following documentation

2. **Documentation Reference (필수 숙지 문서 참조)**
   - Refer to essential documents for business logic, ID schemes, and status values
   - Use screen specifications as UI/UX implementation reference
   - Cross-reference documentation when specifications are unclear

### Minimum Modification Principle / 기존 소스 최소 수정 원칙

**CRITICAL**: Follow the principle of minimum modification to existing source code. Only make necessary changes to achieve the required functionality.

**필수**: 기존 소스 코드에 대해 최소 수정 원칙을 따르세요. 필요한 기능을 달성하기 위한 필수적인 변경만 수행하세요.

#### Existing Source Locations / 기존 소스 위치
- Admin Dashboard: `C:\polibat\admin\`
- Frontend Website: `C:\polibat\front\`

#### Guidelines / 지침
- **Preserve existing patterns**: Match current code style and architecture
- **Incremental changes**: Make small, targeted modifications
- **Test thoroughly**: Verify changes don't break existing functionality

## Commands

### Admin Dashboard
```bash
cd admin
npm install              # Install dependencies
npm start               # Start dev server at http://localhost:3000/backoffice
npm run build           # Build for production
npm test                # Run tests
npm test -- [file] --watch  # Run specific test file
```

### Frontend Website
```bash
cd front
python -m http.server 8000    # Start local dev server
# Test login: test@example.com / test123
```

## Project Architecture

### Admin Dashboard (/admin)
**Tech Stack**: React 19, TypeScript, Tailwind CSS v3.4 (DO NOT upgrade to v4), React Router v7

**Key Structure**:
- `src/components/popups/` - Detail popups for all entity types
- `src/pages/` - Page components for each admin route
- `src/types/business.types.ts` - Core business type definitions
- `src/utils/navigation.ts` - Cross-page navigation helpers

**Critical Patterns**:
- Always use optional chaining: `data?.property || defaultValue`
- Array safety: `Array.isArray(items) && items.length > 0`
- Object mapping safety: `mapping[key] || defaultValue`
- Page layout order: Header → Statistics Cards → Filters → Table

### Frontend Website (/front)
**Tech Stack**: HTML5, Bootstrap 3, jQuery, Vanilla JavaScript (ES5 only)

**Key Files**:
- `page-manager.js` - Page state management (must load last)
- `login.js` - Authentication system with test accounts
- `header.html` / `footer.html` - Included via div imports

## Business Logic & ID System

### Entity ID Format / 엔티티 ID 형식

**Note**: This ID structure reflects the actual implementation in source code (`admin/src/types/business.types.ts`).

| Entity | Prefix | Digits | Example | Description |
|--------|--------|--------|---------|-------------|
| Normal Member | NM | 6 | NM000001 | 일반회원 |
| Politician | PM | 6 | PM000001 | 정치인 |
| Assistant | PA | 6 | PA000001 | 보좌관 |
| Free Board Post | FB | 6 | FB000001 | 자유게시판 |
| Polibat Board Post | PB | 6 | PB000001 | 정치인게시판 |
| Comment | CM | 4 | FB000001-CM0001 | 댓글 (post-based) |
| Vote | VP | 6 | VP000001 | 투표 |
| Complaint | RC | 6 | RC000001 | 불편사항 |
| Suggestion | RS | 6 | RS000001 | 제안사항 |
| Report | RP | 4 | FB000001-RP0001 | 신고 (post/comment-based) |
| Notice | NT | 6 | NT000001 | 공지사항 |
| Popup | PU | 6 | PU000001 | 팝업 |
| Banner | BN | 6 | BN000001 | 배너 |
| Template Policy | TP | 4 | TP0001-VN0001 | 정책 템플릿-버전 |

**ID Generation Rules**:
- Fixed-length numbering with leading zeros (e.g., NM000001 ~ NM999999)
- Sub-entity IDs use parent ID + delimiter + sub-prefix (e.g., FB000001-CM0001)
- Template policies include version numbers (TP0001-VN0001)

### Status Values / 상태값

**Note**: Status values are defined in `admin/src/types/business.types.ts`.

#### Member Status (회원 상태)
- `승인` - Approved (일반회원 auto-approved, 정치인/보좌관 admin-approved)
- `승인대기` - Pending approval (정치인/보좌관 only)
- `탈퇴` - Withdrawn (user-initiated)
- `정지` - Suspended (temporary restriction)
- `강퇴` - Banned (permanent restriction)

#### Post/Comment Status (게시글/댓글 상태)
- `게시` - Published (publicly visible)
- `게시(고정)` - Pinned (top-fixed publication)
- `숨김` - Hidden (visible to admin/author only)
- `삭제` - Deleted (soft delete, recoverable)

#### Vote Status (투표 상태)
- `진행` - In Progress (voting active)
- `마감` - Closed (voting ended)
- `예정` - Scheduled (voting not yet started)

#### Action Status (조치 상태)
- `접수대기` - Received (report/suggestion received)
- `검토중` - Under Review (admin reviewing)
- `처리완료` - Completed (action finished)
- `처리불가` - Unable to Process (action impossible)
- `추후검토` - Deferred (scheduled for future review)

### Date Period Standards
- 일간: Today only (startDate = endDate = today)
- 주간: Last 7 days from today
- 월간: Last 1 month from today
- 연간: Last 1 year from today

## Development Guidelines

### Admin Dashboard Rules
1. **Type Safety**: Never use direct property access without optional chaining
2. **Filter Completeness**: When adding filters, implement all three: state, display, reset
3. **Card Click Logic**: Politicians/Assistants set `statusFilter('승인')`
4. **Cross-Page Navigation**: Implement both sending and receiving of URL parameters
5. **UI Consistency**: Statistics cards always above search filters

### Frontend Rules
1. **ES5 Only**: No arrow functions, const/let, or modern syntax
2. **jQuery Check**: Always verify jQuery loaded before use
3. **File Loading**: page-manager.js must load last in body
4. **Login Testing**: Use test@example.com / test123

### Common Development Tasks

**Adding New Admin Page**:
1. Create component in `admin/src/pages/`
2. Add route in `admin/src/App.tsx`
3. Add menu item in `admin/src/components/Layout.tsx`

**Adding New Frontend Page**:
1. Create HTML with header/footer includes
2. Add page mapping in `front/page-manager.js`
3. Test page detection in browser console

**Cross-Page Navigation (Admin)**:
```typescript
// Source page
import { navigateToPage } from '../utils/navigation';
navigateToPage('/members', { type: '정치인', status: '승인' });

// Target page - receives and applies parameters
useEffect(() => {
  const params = new URLSearchParams(location.search);
  if (params.get('type')) setTypeFilter(params.get('type'));
  if (params.get('status')) setStatusFilter(params.get('status'));
}, [location.search]);
```

## Safety Guidelines

### Required Validation Patterns
```typescript
// ✅ Safe patterns - always use these
const value = data?.nested?.property || defaultValue;
const items = Array.isArray(data) ? data : [];
const color = colorMapping[key as keyof typeof colorMapping] || 'default';

// ❌ Never use unsafe patterns
const value = data.nested.property;  // Will crash if undefined
```

### File Operations
- Never use shell regex/sed for bulk modifications
- Use Edit tool for file changes only
- For files >1000 lines, modify in sections
- Always verify changes after modification

## Testing Approach

### Admin Dashboard
- React Testing Library with Jest
- Test files: `*.test.tsx` alongside components
- Run specific: `npm test -- [filename] --watch`

### Frontend
- Manual browser testing with DevTools
- Check console for errors
- Test login flow with test accounts
- Verify page-manager.js initialization

## Language Preferences / 언어 설정

### 🇰🇷 Korean First Policy (한국어 우선 정책)
**IMPORTANT**: Always respond in Korean (한글) when working on this project. All work logs, explanations, progress updates, and interactions should be in Korean unless explicitly requested otherwise.

**중요**: 이 프로젝트에서 작업할 때는 항상 한글로 응답하세요. 모든 작업 로그, 설명, 진행 상황 업데이트, 상호작용은 별도 요청이 없는 한 한글로 작성되어야 합니다.

### Work Progress Display (작업 진행 표시)
- **Tool Usage Logs**: Display in Korean (예: "파일 읽는 중...", "코드 수정 중...")
- **Progress Updates**: Korean descriptions (예: "회원 관리 페이지 구현 완료")
- **Error Messages**: Korean explanations (예: "오류: 파일을 찾을 수 없습니다")
- **Task Descriptions**: Korean task names in TodoWrite tool

### Code and Documentation (코드 및 문서화)
- **UI Text**: All user-facing text in Korean
- **Code Comments**: Korean for business logic explanations
- **Commit Messages**: Korean required (예: "feat: 회원 필터 기능 추가")
- **Variable Names**: English for code, Korean for comments
- **Date Format**: YYYY-MM-DD (Korean standard)
- **Work History**: All work history and logs in Korean

## 🚀 Claude Code Best Practices

### Workflow for Code Tasks
Follow this structured approach for all coding tasks:
1. **Explore**: Read and understand relevant files using Read/Glob/Grep tools
2. **Plan**: Create a detailed implementation plan with TodoWrite tool
3. **Implement**: Write code following project patterns
4. **Verify**: Test implementation and check for edge cases
5. **Commit**: Create meaningful commits with clear messages in Korean

### Effective Tool Usage
- **Search First**: Always search for existing implementations before creating new code
- **Batch Operations**: Call multiple tools in parallel when reading related files
- **Context Management**: Use `/clear` command if context becomes too large
- **Visual Verification**: Request screenshots for UI changes when needed

### Code Generation Guidelines
- **Follow Patterns**: Always match existing code style and patterns
- **Safety First**: Use optional chaining and default values consistently
- **Test Coverage**: Write tests for new functionality
- **Incremental Changes**: Make small, focused changes rather than large rewrites

### Performance Tips
- **Parallel Processing**: Use multiple tool calls in single response for efficiency
- **Focused Context**: Keep only relevant files in context
- **Smart Navigation**: Use Grep/Glob for finding files instead of manual exploration

### Testing Best Practices
- **TDD Approach**: Write tests before implementation when adding new features
- **Run Tests Frequently**: Execute tests after each significant change
- **Visual Testing**: Use screenshots to verify UI components
- **Edge Cases**: Always test boundary conditions and error states

## Important Warnings
1. **Tailwind CSS**: Must use v3.4.x - v4 causes compatibility issues
2. **Optional Chaining**: Required for all object property access
3. **Filter Implementation**: All three aspects (state, display, reset) required
4. **Page Layout Order**: Statistics cards must be above search filters
5. **ES5 Syntax**: Frontend must maintain ES5 compatibility (no modern JS)
6. **jQuery Loading**: Must load before dependent scripts
7. **Cross-Page Navigation**: Both sending and receiving must be implemented

## 🚀 SuperClaude Commands / SuperClaude 커맨드

This project supports SuperClaude framework for enhanced development workflows. When using SuperClaude commands (`/sc`), help text will be displayed in both English and Korean.

이 프로젝트는 향상된 개발 워크플로우를 위해 SuperClaude 프레임워크를 지원합니다. SuperClaude 커맨드(`/sc`)를 사용할 때 도움말 텍스트가 영어와 한글로 표시됩니다.

### Quick Reference / 빠른 참조

**자주 사용하는 커맨드 (Frequently Used Commands):**
- `/sc:help` - 전체 커맨드 목록 표시 (Show all available commands)
- `/sc:implement` - 기능 구현 (Feature implementation)
- `/sc:analyze` - 코드 분석 (Code analysis)
- `/sc:test` - 테스트 실행 (Run tests)
- `/sc:git` - Git 작업 (Git operations)

**세션 관리 (Session Management):**
- `/sc:load` - 프로젝트 컨텍스트 로드 (Load project context)
- `/sc:save` - 세션 저장 (Save session)

For detailed information on all available commands and flags, use `/sc:help`.

사용 가능한 모든 커맨드와 플래그에 대한 자세한 정보는 `/sc:help`를 사용하세요.