# CLAUDE_KO.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 프로젝트 개요
정치방망이 (Polibat) - 정치인과 시민 간 소통을 위한 정치 커뮤니티 플랫폼. HTML, Bootstrap, jQuery, 바닐라 JavaScript로 구축된 프론트엔드 전용 웹 애플리케이션.

## Bash 명령어
```bash
# 개발
python -m http.server 8000    # 로컬 개발 서버 시작 (Python 3)
python -m SimpleHTTPServer     # 로컬 개발 서버 시작 (Python 2)

# 파일 작업
find . -name "*.html" -type f  # 모든 HTML 파일 찾기
grep -r "function" js/         # JS 파일에서 함수 검색

# 로그인 테스트
# http://localhost:8000/login.html 열기
# 테스트 계정: test@example.com / test123
```

## 코드 스타일 가이드라인

### JavaScript
- **중요**: ES5 문법 사용 (화살표 함수, const/let 사용 금지)
- main.js에서 DOM 조작은 jQuery 사용
- 핵심 기능은 바닐라 JS 사용 (page-manager.js, login.js)
- jQuery 사용 전 항상 가용성 확인
- 디버깅용 console.log에 이모지 사용 (예: '✅', '❌', '🔍')

### HTML
- div includes를 통해 헤더/푸터 포함
- 종속 스크립트보다 jQuery를 먼저 로드
- **반드시** body 끝에 page-manager.js를 마지막으로 로드

### CSS
- 기본 스타일은 Bootstrap 3.x 사용
- 커스텀 스타일은 css/style.css에만 작성
- 일관성을 위해 :root에 CSS 변수 사용

## 워크플로우 지침

### 새 페이지 추가
1. **중요**: 헤더/푸터 includes가 있는 HTML 생성
2. 필요시 page-manager.js에 페이지 매핑 추가
3. 콘솔에서 페이지 감지 테스트
4. 헤더/푸터가 올바르게 로드되는지 확인

### 인증 수정
- **반드시** login.js의 VALID_ACCOUNTS 업데이트
- 여러 계정 유형으로 테스트
- 세션 지속성을 위한 localStorage 확인
- 리다이렉트 로직 작동 확인

### 변경사항 테스트
- **우선적으로** 브라우저 콘솔에서 먼저 테스트
- jQuery 오류 확인
- page-manager.js가 올바르게 로드되는지 확인
- 로그인/로그아웃 상태 모두에서 테스트

## 저장소 구조
```
/
├── CLAUDE.md           # 영어 지침
├── CLAUDE_KO.md        # 한국어 지침 (이 파일, 동기화 유지)
├── *.html              # 페이지 파일들
├── page-manager.js     # 페이지 상태 관리
├── login.js            # 인증 시스템
├── css/
│   ├── bootstrap.css   # Bootstrap 프레임워크
│   └── style.css       # 커스텀 스타일
├── js/
│   ├── main.js         # jQuery 플러그인
│   └── *.min.js        # 벤더 라이브러리
└── sass/               # SCSS 소스 (컴파일되지 않음)
```

## 개발자 환경

### 필수 도구
- DevTools가 있는 최신 브라우저
- HTML/JS/CSS 지원 텍스트 에디터
- 로컬 HTTP 서버 (Python 내장 권장)

### 브라우저 호환성
- Chrome/Edge: 완전 지원
- Firefox: 완전 지원
- Safari: 미디어 쿼리 테스트 필요
- IE11: 제한적 지원 (폴리필 로드됨)

## 저장소 에티켓

### 파일 수정
- **절대 금지** 벤더 파일 수정 (*.min.js, bootstrap.css)
- **항상** 저장 전 로컬에서 변경사항 테스트
- console.log 문은 개발용으로만 유지
- 복잡한 로직은 한국어 주석으로 문서화

### 코드 구성
- 기능당 하나의 함수
- 관련 함수들은 섹션으로 그룹화
- 한국어 맥락에서 설명적인 변수명 사용
- 일관된 들여쓰기 유지 (탭 사용)

## 언어 설정
- **작업 내역 표시**: 모든 작업 내역, 커밋 메시지, 코드 주석은 한국어로
- **사용자 소통**: 한국어로 응답 및 설명
- **문서화**: 한국어 우선, 필요시 영어 병기
- **변수명**: 코드는 영어, 주석은 한국어

## 일반적인 문제 및 해결방법

### 헤더/푸터가 로드되지 않음
```javascript
// 콘솔에서 확인
PageManager.checkInitialization();
// 파일 경로가 올바른지 확인
```

### 로그인이 작동하지 않음
```javascript
// login.js에서 테스트 계정 확인
console.log(VALID_ACCOUNTS);
// localStorage 초기화
localStorage.clear();
```

### 페이지 감지 실패
```javascript
// 현재 페이지 감지 확인
PageDetector.detectCurrentPage();
// 필요시 매핑에 페이지 추가
```

## 파일 동기화 가이드
**매우 중요**: CLAUDE.md와 CLAUDE_KO.md는 항상 동기화되어야 함
- 한 파일을 수정할 때 **반드시** 다른 파일도 업데이트
- CLAUDE.md = 영어 버전
- CLAUDE_KO.md = 한국어 버전
- 구조와 내용은 동일해야 함
- 파일 간 언어만 다름
- 마지막 업데이트: 2025-09-23

## 빠른 참조
- 테스트 사용자: test@example.com / test123
- 테스트 정치인: politician@example.com / pol123
- 세션 저장소: localStorage (userLoggedIn, userType, userEmail, userNickname)
- 페이지 감지: page-manager.js를 통한 자동 감지
- 헤더/푸터: header.html과 footer.html에서 동적 로드