# @polibat/web

정치방망이 Frontend Website - HTML + JavaScript + Vite

## 기술 스택

- **Base**: HTML5 + CSS3
- **Build Tool**: Vite 5.1
- **JavaScript**: ES6+ Modules (브라우저 호환성 유지)
- **Styling**: Bootstrap 3.x + Custom CSS
- **Icons**: Font Awesome 6.5.0

## 개발 명령어

```bash
# 개발 서버 시작 (Port 8000)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# Lint 실행
npm run lint

# 코드 포맷팅
npm run format
```

## 프로젝트 구조

```
/apps/web
├── /src
│   ├── /pages       # HTML 페이지
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── signup.html
│   │   └── ... (기타 페이지)
│   ├── /scripts     # JavaScript 모듈
│   │   ├── page-manager.js
│   │   ├── login.js
│   │   └── ...
│   ├── /styles      # CSS
│   │   └── custom.css
│   └── /assets      # 이미지, 폰트
├── /public          # 정적 파일
│   └── favicon.ico
├── vite.config.ts
└── package.json
```

## 마이그레이션 전략

### Phase 1: 기존 코드 유지
- jQuery 코드 유지
- 기존 Bootstrap 3 유지
- page-manager.js 유지

### Phase 2: ES6 모듈 전환
- page-manager.js → ES6 모듈 변환
- 새 기능만 ES6 모듈 사용

### Phase 3: 점진적 현대화
- jQuery → Vanilla JS 전환
- 브라우저 호환성 유지

### Phase 4: Vite 번들링
- Vite로 번들링
- 최적화 및 성능 개선

## Legacy 마이그레이션

기존 `/legacy/front` 코드를 점진적으로 마이그레이션합니다:
- 100% 기능 동등성 유지
- 22개 HTML 페이지 전체 이동
- JavaScript 모듈화
- 정적 파일 최적화

## 중요 사항

### ES5 호환성
- 기존 코드는 ES5 문법 유지
- 새 코드만 ES6+ 사용 (트랜스파일링)

### jQuery 의존성
- jQuery는 필요 시 유지
- 점진적으로 Vanilla JS 전환

### 테스트 계정
- 이메일: test@example.com
- 비밀번호: test123

## 참고 문서

- [TO-BE 아키텍처 명세서](../../TO-BE-ARCHITECTURE.md)
- [프로젝트 CLAUDE.md](../../CLAUDE.md)
- [Legacy Frontend CLAUDE.md](../../legacy/front/CLAUDE.md)
