# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🌐 Language Preference / 언어 설정

**IMPORTANT**: Always respond in Korean (한글) when working on this project. All explanations, commit messages, comments, and user interactions should be in Korean unless explicitly requested otherwise.

**중요**: 이 프로젝트에서 작업할 때는 항상 한글로 응답하세요. 모든 설명, 커밋 메시지, 주석, 사용자 상호작용은 별도 요청이 없는 한 한글로 작성되어야 합니다.

## 📄 File Synchronization / 파일 동기화

**CRITICAL**: When modifying CLAUDE.md, you MUST also update CLAUDE_KO.md to maintain synchronization between both files. Both files should contain the same information in their respective languages.

**필수**: CLAUDE.md 파일을 수정할 때는 반드시 CLAUDE_KO.md 파일도 함께 수정하여 두 파일 간의 동기화를 유지해야 합니다. 두 파일은 각각의 언어로 동일한 정보를 포함해야 합니다.

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

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start
# Opens on http://localhost:3000
# Homepage path: /backoffice

# Build for production
npm run build

# Run tests
npm run test

# Run a specific test file
npm test -- PostsManagementPage.test.tsx --watch
```

## Project Architecture

### Tech Stack
- **React 19** with TypeScript 4.9
- **React Router v7** for routing
- **Tailwind CSS v3.4** (IMPORTANT: Do NOT upgrade to v4)
- **Chart.js** with react-chartjs-2 for analytics
- **Lucide React** for icons

### Directory Structure
- `src/components/` - Reusable components (Layout, popups)
- `src/pages/` - Page components for each route
- `src/types/` - TypeScript type definitions and business types
- `src/utils/` - Utility functions (navigation helpers)

### Key Business Types (src/types/business.types.ts)
The application uses a standardized ID system with fixed 6-digit prefixes:
- Members: NM (Normal), PM (Politician), PA (Assistant)
- Content: FB (Free Board), PB (Politician Board), CM (Comment)
- Admin: VP (Vote), NT (Notice), PU (Popup), BN (Banner)

### Component Patterns

#### Page Layout Structure (Required Order)
All list pages must follow this exact sequence:
1. Page header with title and action buttons
2. Statistics cards (clickable filters)
3. Search and filter controls
4. Data table with results

#### Popup Components
All detail popups follow a consistent pattern:
- Located in `src/components/popups/`
- Accept `onClose` callback and data object as props
- Use modal overlay with centered content
- Include close button (X) in top-right corner

#### Data Safety Patterns
Always use optional chaining and default values:
```typescript
// Required patterns for undefined safety
const value = data?.property || defaultValue;
const items = Array.isArray(data) && data.length > 0 ? data : [];
const color = colorMapping[key as keyof typeof colorMapping] || defaultColor;
```

### Navigation Utilities
Use `src/utils/navigation.ts` for cross-page navigation with parameters:
```typescript
import { navigateToPage } from '../utils/navigation';
navigateToPage('/members', { type: '정치인', status: '승인' });
```

### Critical Development Rules

#### Tailwind CSS Version Lock
- **MUST use v3.4.x** - v4 causes compatibility issues
- If CSS errors occur, verify: `"tailwindcss": "~3.4.0"` in package.json

#### Korean UI/UX Standards
- All UI text in Korean
- Date format: YYYY-MM-DD
- Status values use Korean terms (승인, 대기, 삭제, etc.)

#### Filter Implementation Checklist
When adding filters, always implement three things simultaneously:
1. State variable and setter
2. Display in "Applied Filters" section
3. Include in reset logic

#### Card Click Logic Standards
Statistics cards must apply proper filtering:
- Member type cards: Set `statusFilter('승인')` for politicians/assistants
- Status cards: Reset type filter to '전체'
- Always reset search, date, and pagination

## Common Tasks

### Adding a New Page
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add menu item in `src/components/Layout.tsx` navigation array

### Implementing Cross-Page Navigation
When implementing "click to navigate with filters":
1. Source page: Create handleClick with URL parameters
2. Target page: Add useEffect with URLSearchParams parsing
3. Target page: Apply received parameters to filter states
4. Verify: Complete user flow from click → navigate → filter → results

### Date Period Filters
Standard period definitions (consistent across all pages):
- 일간: Today only (startDate = endDate = today)
- 주간: Last 7 days
- 월간: Last 1 month
- 연간: Last 1 year

## Testing Approach
- Uses React Testing Library with Jest
- Test files alongside components (*.test.tsx)
- Run specific test: `npm test -- [filename] --watch`

## Important Warnings

### File Safety
- NEVER use shell regex/sed for bulk file modifications
- Only use Edit tool for file changes
- For large files (1000+ lines), modify in sections

### Business Logic Consistency
- Always search for existing implementations before creating new logic
- Maintain consistency with established patterns
- Reference existing pages when implementing similar features

### Required Validation
Before marking any task complete, verify:
- All optional chaining is in place
- Korean text throughout
- Filters properly connected to UI
- Cross-page navigation fully functional
- Card layout follows standard order