# @polibat/web - Claude Code 가이드

정치방망이 Frontend Website 개발 가이드

## 📋 개요

이 디렉토리는 정치방망이의 사용자 웹사이트 앱입니다.
HTML5 + JavaScript + Vite 기반으로 구성되어 있습니다.

## 🚀 개발 시작

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build
```

## 📁 디렉토리 구조

- `src/pages/` - HTML 페이지 파일
- `src/scripts/` - JavaScript 모듈
- `src/styles/` - CSS 스타일시트
- `src/assets/` - 이미지, 폰트 등 정적 파일

## 🎯 개발 원칙

### 100% 기능 동등성
- legacy/front의 모든 기능을 동일하게 구현
- 22개 HTML 페이지 전체 마이그레이션
- UI/UX 완전히 동일하게 유지

### 점진적 현대화
1. Phase 1: jQuery 코드 유지
2. Phase 2: 새 기능만 ES6 모듈
3. Phase 3: 점진적 Vanilla JS 전환
4. Phase 4: Vite 번들링 최적화

## 📚 참고 문서

- [Legacy Frontend CLAUDE.md](../../legacy/front/CLAUDE.md)
- [TO-BE Architecture](../../TO-BE-ARCHITECTURE.md)
