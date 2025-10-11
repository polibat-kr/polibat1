# 정치방망이 관리자 페이지

## 🚀 빠른 시작

### 환경 요구사항
- Node.js 18.19.0 (권장)
- npm 또는 yarn

### 설치 및 실행

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)로 접속

## 🛠 기술 스택

- **React 19** + **TypeScript**
- **React Router** (라우팅)
- **Tailwind CSS v3** (스타일링)
- **Lucide React** (아이콘)

## ⚠️ 중요 참고사항

### Tailwind CSS 버전
- **반드시 v3.4.x 사용** (v4는 아직 안정적이지 않음)
- `package.json`에서 `"tailwindcss": "~3.4.0"`로 고정됨

### 환경 설정
- Node.js 버전: `.nvmrc` 파일 참조
- PostCSS 설정: `postcss.config.js` 수정 금지

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── Layout.tsx           # 메인 레이아웃
│   └── popups/             # 팝업 컴포넌트들
├── pages/                  # 페이지 컴포넌트들
├── types/                  # TypeScript 타입 정의
└── utils/                  # 유틸리티 함수들
```

## 🎯 구현된 기능

### ✅ 완료
- 대시보드 (회원/게시글/방문자 현황)
- 전체회원관리
- 팝업 컴포넌트들 (회원/게시글/댓글/투표/불편제안 상세정보)

### 🚧 진행중
- 나머지 관리 페이지들

## 🔧 문제 해결

### Tailwind CSS 오류 발생시
```bash
# v4가 설치된 경우 제거 후 v3 재설치
npm uninstall tailwindcss
npm install tailwindcss@~3.4.0
```

### 개발 서버 실행 오류시
```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install
npm start
```

## 📝 개발 가이드

### 새 페이지 추가
1. `src/pages/` 에 컴포넌트 생성
2. `src/App.tsx` 에 라우트 추가
3. `src/components/Layout.tsx` 에 메뉴 추가

### 팝업 사용법
```tsx
import MemberDetailPopup from '../components/popups/MemberDetailPopup';

// 사용 예시
<MemberDetailPopup 
  member={selectedMember} 
  onClose={() => setSelectedMember(null)} 
/>
```
