/**
 * 정치방망이 통합 로그인 시스템
 * @version 2.0.0
 * @description 스마트 리디렉션과 헤더 상태 관리가 포함된 로그인 시스템
 */

(function() {
    'use strict';
    
    // ===== 시스템 설정 =====
    const LOGIN_CONFIG = {
        version: '2.0.0',
        apiBaseUrl: '/api',
        retryAttempts: 3,
        loadingDelay: 800,
        redirectDelay: 1500,
        debounceDelay: 300
    };
    
    // ===== 테스트 계정 데이터 =====
    const VALID_ACCOUNTS = [
        { email: 'test@example.com', nickname: '테스트유저', password: 'test123', type: 'user' },
        { email: 'admin@example.com', nickname: '관리자', password: 'admin123', type: 'user' },
        { email: 'politician@example.com', nickname: '정치인', password: 'pol123', type: 'politician' },
        { email: 'user@example.com', nickname: '일반유저', password: 'user123', type: 'user' },
        { email: 'hong@example.com', nickname: '홍길동', password: 'hong123', type: 'user' },
        { email: 'yona@example.com', nickname: '이요나', password: 'yona123', type: 'politician' }
    ];
    
    // ===== 로그인 매니저 클래스 =====
    class LoginManager {
        constructor() {
            this.currentTab = 'user';
            this.isSubmitting = false;
            this.debugMode = this.isDevelopmentMode();
            
            this.init();
        }
        
        // 초기화
        init() {
            console.log('🔧 로그인 시스템 초기화 시작');
            
            if (!this.checkPageType()) return;
            
            this.cacheElements();
            this.clearExistingSession();
            this.bindEvents();
            this.setupValidation();
            this.updateSignupLink();
            
            console.log('✅ 로그인 시스템 초기화 완료');
        }
        
        // 페이지 타입 확인
        checkPageType() {
            const isLoginPage = window.location.pathname.includes('login.html') || 
                               window.location.pathname.endsWith('login');
            
            if (!isLoginPage) {
                console.log('❌ 로그인 페이지가 아닙니다');
                return false;
            }
            
            return true;
        }
        
        // 개발 모드 확인
        isDevelopmentMode() {
            return window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1';
        }
        
        // DOM 요소 캐싱
        cacheElements() {
            this.elements = {
                userTab: document.getElementById('userTab'),
                politicianTab: document.getElementById('politicianTab'),
                userForm: document.getElementById('userForm'),
                politicianForm: document.getElementById('politicianForm'),
                successMessage: document.getElementById('successMessage'),
                signupLink: document.getElementById('signupLink')
            };
            
            // 필수 요소 확인
            if (!this.elements.userForm || !this.elements.politicianForm) {
                console.error('❌ 필수 폼 요소를 찾을 수 없습니다');
                return false;
            }
            
            return true;
        }
        
        // 기존 세션 정리
        clearExistingSession() {
            console.log('🧹 기존 세션 정리 중...');
            
            const keysToRemove = ['userLoggedIn', 'userType', 'userEmail', 'userNickname'];
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
            });
            
            console.log('✅ 기존 세션 정리 완료');
        }
        
        // 이벤트 바인딩
        bindEvents() {
            // 탭 클릭 이벤트
            if (this.elements.userTab) {
                this.elements.userTab.addEventListener('click', () => this.switchTab('user'));
            }
            if (this.elements.politicianTab) {
                this.elements.politicianTab.addEventListener('click', () => this.switchTab('politician'));
            }
            
            // 폼 제출 이벤트
            if (this.elements.userForm) {
                this.elements.userForm.addEventListener('submit', (e) => this.handleSubmit(e, 'user'));
            }
            if (this.elements.politicianForm) {
                this.elements.politicianForm.addEventListener('submit', (e) => this.handleSubmit(e, 'politician'));
            }
        }
        
        // 실시간 유효성 검사 설정
        setupValidation() {
            const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');
            
            inputs.forEach(input => {
                // 입력 시 에러 제거
                input.addEventListener('input', () => this.clearFieldError(input));
                
                // 엔터키 제출 지원
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        const form = input.closest('form');
                        const submitBtn = form.querySelector('.login-button');
                        if (submitBtn && !this.isSubmitting) {
                            submitBtn.click();
                        }
                    }
                });
            });
        }
        
        // 탭 전환
        switchTab(tabName) {
            if (this.isSubmitting) return;
            
            this.currentTab = tabName;
            this.hideAllErrors();
            this.hideSuccessMessage();
            
            // UI 업데이트
            if (tabName === 'user') {
                this.elements.userTab?.classList.add('active');
                this.elements.politicianTab?.classList.remove('active');
                if (this.elements.userForm) this.elements.userForm.style.display = 'block';
                if (this.elements.politicianForm) this.elements.politicianForm.style.display = 'none';
            } else {
                this.elements.userTab?.classList.remove('active');
                this.elements.politicianTab?.classList.add('active');
                if (this.elements.userForm) this.elements.userForm.style.display = 'none';
                if (this.elements.politicianForm) this.elements.politicianForm.style.display = 'block';
            }
            
            this.updateSignupLink();
            console.log('🔄 탭 전환:', tabName);
        }
        
        // 회원가입 링크 업데이트
        updateSignupLink() {
            if (this.elements.signupLink) {
                if (this.currentTab === 'user') {
                    this.elements.signupLink.textContent = '일반회원 회원가입';
                    this.elements.signupLink.href = 'signup.html';
                } else {
                    this.elements.signupLink.textContent = '정치인 가입신청';
                    this.elements.signupLink.href = 'signup.html?tab=politician';
                }
            }
        }
        
        // 폼 제출 처리
        async handleSubmit(e, userType) {
            e.preventDefault();
            
            if (this.isSubmitting) return;
            
            const form = e.target;
            const submitBtn = form.querySelector('.login-button');
            const formData = this.collectFormData(form, userType);
            
            // 유효성 검사
            if (!this.validateForm(formData, userType)) {
                return;
            }
            
            // 로딩 상태 시작
            this.setLoadingState(true, submitBtn);
            
            try {
                console.log('📝 로그인 시도:', { email: formData.email, userType });
                
                // 인증 처리
                const result = await this.authenticateUser(formData);
                
                if (result.success) {
                    console.log('✅ 로그인 성공');
                    this.handleLoginSuccess(formData, result, form);
                } else {
                    console.log('❌ 로그인 실패:', result.message);
                    this.handleLoginFailure(result.message, form);
                }
                
            } catch (error) {
                console.error('❌ 로그인 처리 중 오류:', error);
                this.handleLoginFailure('로그인 처리 중 오류가 발생했습니다.', form);
            } finally {
                this.setLoadingState(false, submitBtn);
            }
        }
        
        // 폼 데이터 수집
        collectFormData(form, userType) {
            const isUser = userType === 'user';
            const emailField = isUser ? 'userEmail' : 'politicianEmail';
            const passwordField = isUser ? 'password' : 'politicianPassword';
            const rememberField = isUser ? 'rememberMe' : 'rememberPolitician';
            
            return {
                email: form[emailField].value.trim(),
                password: form[passwordField].value,
                userType: userType,
                rememberMe: form[rememberField].checked
            };
        }
        
        // 폼 유효성 검사
        validateForm(formData, userType) {
            let isValid = true;
            this.hideAllErrors();
            
            // 이메일 검증
            if (!formData.email) {
                this.showFieldError(
                    userType === 'user' ? 'userEmail' : 'politicianEmail',
                    userType === 'user' ? 'userEmailError' : 'politicianEmailError'
                );
                isValid = false;
            } else if (!this.isValidEmail(formData.email)) {
                this.showCustomFieldError(
                    userType === 'user' ? 'userEmail' : 'politicianEmail',
                    userType === 'user' ? 'userEmailError' : 'politicianEmailError',
                    '올바른 이메일 형식을 입력해주세요.'
                );
                isValid = false;
            }
            
            // 비밀번호 검증
            if (!formData.password) {
                this.showFieldError(
                    userType === 'user' ? 'password' : 'politicianPassword',
                    userType === 'user' ? 'passwordError' : 'politicianPasswordError'
                );
                isValid = false;
            } else if (formData.password.length < 6) {
                this.showCustomFieldError(
                    userType === 'user' ? 'password' : 'politicianPassword',
                    userType === 'user' ? 'passwordError' : 'politicianPasswordError',
                    '비밀번호는 6자 이상 입력해주세요.'
                );
                isValid = false;
            }
            
            return isValid;
        }
        
        // 이메일 형식 검증
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        // 사용자 인증
        async authenticateUser(formData) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    // 계정 찾기
                    const account = VALID_ACCOUNTS.find(acc => 
                        acc.email === formData.email && acc.password === formData.password
                    );
                    
                    if (account) {
                        // 계정 타입 검증
                        if (formData.userType === 'politician' && account.type !== 'politician') {
                            resolve({
                                success: false,
                                message: '정치인 계정이 아닙니다. 일반회원 탭에서 로그인해주세요.'
                            });
                            return;
                        }
                        
                        if (formData.userType === 'user' && account.type === 'politician') {
                            resolve({
                                success: false,
                                message: '일반회원 계정이 아닙니다. 정치인 탭에서 로그인해주세요.'
                            });
                            return;
                        }
                        
                        resolve({
                            success: true,
                            userType: account.type,
                            nickname: account.nickname
                        });
                    } else {
                        resolve({
                            success: false,
                            message: '이메일 또는 비밀번호가 올바르지 않습니다.'
                        });
                    }
                }, LOGIN_CONFIG.loadingDelay);
            });
        }
        
        // 로그인 성공 처리
        handleLoginSuccess(formData, result, form) {
            this.showSuccessMessage();
            this.disableForm(form);
            this.saveLoginState(formData, result);
            
            // 스마트 리디렉션
            setTimeout(() => {
                const redirectUrl = this.determineRedirectUrl();
                console.log('🚀 로그인 성공 후 리디렉션:', redirectUrl);
                window.location.href = redirectUrl;
            }, LOGIN_CONFIG.redirectDelay);
        }
        
        // 로그인 실패 처리
        handleLoginFailure(message, form) {
            this.showError(message);
            
            // 첫 번째 에러 필드에 포커스
            const firstErrorField = form.querySelector('.error');
            if (firstErrorField) {
                firstErrorField.focus();
            }
        }
        
        // 로그인 상태 저장
        saveLoginState(formData, result) {
            console.log('💾 로그인 상태 저장');
            
            // 저장소 선택
            const storage = formData.rememberMe ? localStorage : sessionStorage;
            
            // 사용자 정보 저장
            storage.setItem('userLoggedIn', 'true');
            storage.setItem('userType', formData.userType);
            storage.setItem('userEmail', formData.email);
            storage.setItem('userNickname', result.nickname);
            
            console.log('📦 스토리지 저장 완료:', {
                userLoggedIn: 'true',
                userType: formData.userType,
                userEmail: formData.email,
                userNickname: result.nickname,
                storage: formData.rememberMe ? 'localStorage' : 'sessionStorage'
            });
            
            // 헤더 업데이트 이벤트 발생
            const loginEvent = new CustomEvent('userLoginSuccess', {
                detail: {
                    userType: formData.userType,
                    userEmail: formData.email,
                    userNickname: result.nickname
                }
            });
            window.dispatchEvent(loginEvent);
            
            console.log('📡 헤더 업데이트 이벤트 발송 완료');
        }
        
        // 리디렉션 URL 결정
        determineRedirectUrl() {
            // 1. URL 파라미터 확인
            const urlParams = new URLSearchParams(window.location.search);
            const redirectParam = urlParams.get('redirect');
            
            if (redirectParam && this.isValidRedirectUrl(redirectParam)) {
                sessionStorage.removeItem('previousPage');
                return decodeURIComponent(redirectParam);
            }
            
            // 2. sessionStorage 확인
            const previousPage = sessionStorage.getItem('previousPage');
            if (previousPage && this.isValidRedirectUrl(previousPage)) {
                sessionStorage.removeItem('previousPage');
                return previousPage;
            }
            
            // 3. document.referrer 확인
            const referrer = document.referrer;
            if (referrer && this.isValidRedirectUrl(referrer) && !referrer.includes('login.html')) {
                return referrer;
            }
            
            // 4. 기본값
            return 'index.html';
        }
        
        // 유효한 리디렉션 URL 확인
        isValidRedirectUrl(url) {
            if (!url) return false;
            
            // 위험한 프로토콜 차단
            const dangerousProtocols = ['javascript:', 'data:', 'vbscript:'];
            const lowerUrl = url.toLowerCase();
            
            for (const protocol of dangerousProtocols) {
                if (lowerUrl.startsWith(protocol)) {
                    return false;
                }
            }
            
            // 외부 도메인 차단
            if (url.startsWith('http://') || url.startsWith('https://')) {
                try {
                    const urlObj = new URL(url);
                    const currentDomain = window.location.hostname;
                    const allowedDomains = [currentDomain, 'www.polibat.com', 'polibat.com'];
                    
                    if (!allowedDomains.includes(urlObj.hostname)) {
                        console.warn('⚠️ 외부 도메인 리디렉션 차단:', url);
                        return false;
                    }
                } catch (e) {
                    return false;
                }
            }
            
            return true;
        }
        
        // 로딩 상태 관리
        setLoadingState(loading, button) {
            this.isSubmitting = loading;
            
            if (!button) return;
            
            const spinner = button.querySelector('.loading-spinner');
            const buttonText = button.querySelector('.button-text');
            
            if (loading) {
                button.disabled = true;
                if (spinner) spinner.style.display = 'inline-block';
                if (buttonText) buttonText.textContent = '로그인 중...';
            } else {
                button.disabled = false;
                if (spinner) spinner.style.display = 'none';
                if (buttonText) {
                    buttonText.textContent = this.currentTab === 'user' ? '일반회원 로그인' : '정치인 로그인';
                }
            }
        }
        
        // 폼 비활성화
        disableForm(form) {
            const elements = form.querySelectorAll('input, button');
            elements.forEach(element => {
                element.disabled = true;
            });
        }
        
        // 필드 에러 표시
        showFieldError(fieldId, errorId) {
            const field = document.getElementById(fieldId);
            const error = document.getElementById(errorId);
            
            if (field) field.classList.add('error');
            if (error) error.style.display = 'block';
        }
        
        // 커스텀 에러 메시지 표시
        showCustomFieldError(fieldId, errorId, message) {
            const field = document.getElementById(fieldId);
            const error = document.getElementById(errorId);
            
            if (field) field.classList.add('error');
            if (error) {
                error.textContent = message;
                error.style.display = 'block';
            }
        }
        
        // 필드 에러 제거
        clearFieldError(field) {
            field.classList.remove('error');
            const form = field.closest('form');
            const errors = form.querySelectorAll('.error-msg');
            
            errors.forEach(error => {
                if (error.previousElementSibling === field) {
                    error.style.display = 'none';
                }
            });
        }
        
        // 모든 에러 숨김
        hideAllErrors() {
            const errorMsgs = document.querySelectorAll('.error-msg');
            errorMsgs.forEach(msg => {
                msg.style.display = 'none';
            });
            
            const inputs = document.querySelectorAll('input');
            inputs.forEach(input => {
                input.classList.remove('error');
            });
            
            // 기존 에러 메시지 제거
            const existingError = document.querySelector('.login-error-message');
            if (existingError) {
                existingError.remove();
            }
        }
        
        // 에러 메시지 표시
        showError(message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'login-error-message';
            errorDiv.textContent = message;
            
            // 기존 에러 제거
            const existingError = document.querySelector('.login-error-message');
            if (existingError) {
                existingError.remove();
            }
            
            // 현재 보이는 폼 뒤에 삽입
            const currentForm = document.querySelector('.login-form:not([style*="display: none"])');
            if (currentForm) {
                currentForm.insertAdjacentElement('afterend', errorDiv);
                
                // 3초 후 자동 제거
                setTimeout(() => {
                    if (errorDiv.parentNode) {
                        errorDiv.remove();
                    }
                }, 3000);
            }
        }
        
        // 성공 메시지 표시/숨김
        showSuccessMessage() {
            if (this.elements.successMessage) {
                this.elements.successMessage.style.display = 'block';
            }
        }
        
        hideSuccessMessage() {
            if (this.elements.successMessage) {
                this.elements.successMessage.style.display = 'none';
            }
        }
    }
    
    // ===== 헤더 상태 관리 시스템 =====
    class HeaderStateManager {
        constructor() {
            this.initialized = false;
            this.retryCount = 0;
            this.maxRetries = 10;
            
            this.init();
        }
        
        init() {
            console.log('🔧 헤더 상태 관리자 초기화');
            this.bindEvents();
            this.updateHeaderState();
            this.initialized = true;
        }
        
        bindEvents() {
            // 로그인 성공 이벤트
            window.addEventListener('userLoginSuccess', (e) => {
                console.log('📡 로그인 성공 이벤트 수신:', e.detail);
                this.updateHeaderState();
            });
            
            // 로그아웃 이벤트
            window.addEventListener('userLogout', () => {
                console.log('📡 로그아웃 이벤트 수신');
                this.updateHeaderState();
            });
            
            // 저장소 변경 감지
            window.addEventListener('storage', (e) => {
                if (['userLoggedIn', 'userNickname', 'userType'].includes(e.key)) {
                    console.log('📦 저장소 변경 감지:', e.key);
                    this.updateHeaderState();
                }
            });
        }
        
        updateHeaderState() {
            // 헤더가 로드될 때까지 대기
            this.waitForHeader(() => {
                const isLoggedIn = this.checkLoginStatus();
                console.log('🔍 로그인 상태 확인:', isLoggedIn);
                
                if (isLoggedIn) {
                    this.showLoggedInState();
                } else {
                    this.showLoggedOutState();
                }
            });
        }
        
        waitForHeader(callback) {
            const loginMenu = document.getElementById('loginMenu');
            const loggedInMenu = document.getElementById('loggedInMenu');
            
            if (loginMenu && loggedInMenu) {
                callback();
            } else if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                setTimeout(() => this.waitForHeader(callback), 200);
            } else {
                console.error('❌ 헤더 로딩 실패');
            }
        }
        
        checkLoginStatus() {
            return localStorage.getItem('userLoggedIn') === 'true' || 
                   sessionStorage.getItem('userLoggedIn') === 'true';
        }
        
        showLoggedInState() {
            const loginMenu = document.getElementById('loginMenu');
            const loggedInMenu = document.getElementById('loggedInMenu');
            
            if (loginMenu) {
                loginMenu.style.display = 'none';
                loginMenu.classList.add('hidden');
            }
            if (loggedInMenu) {
                loggedInMenu.style.display = 'flex';
                loggedInMenu.classList.remove('hidden');
            }
            
            this.updateUserInfo();
            console.log('✅ 로그인 상태 표시 완료');
        }
        
        showLoggedOutState() {
            const loginMenu = document.getElementById('loginMenu');
            const loggedInMenu = document.getElementById('loggedInMenu');
            
            if (loginMenu) {
                loginMenu.style.display = 'flex';
                loginMenu.classList.remove('hidden');
            }
            if (loggedInMenu) {
                loggedInMenu.style.display = 'none';
                loggedInMenu.classList.add('hidden');
            }
            
            console.log('✅ 로그아웃 상태 표시 완료');
        }
        
        updateUserInfo() {
            const userNickname = localStorage.getItem('userNickname') || 
                               sessionStorage.getItem('userNickname') || '사용자';
            const userType = localStorage.getItem('userType') || 
                            sessionStorage.getItem('userType') || 'user';
            
            const userTypeText = userType === 'politician' ? '정치인' : '일반회원';
            
            // PC 버전 업데이트
            const usernameDisplay = document.getElementById('usernameDisplay');
            const userTypeDisplay = document.getElementById('userTypeText');
            const userIndicator = document.getElementById('userIndicator');
            
            if (usernameDisplay) usernameDisplay.textContent = userNickname;
            if (userTypeDisplay) userTypeDisplay.textContent = userTypeText;
            
            if (userIndicator) {
                userIndicator.classList.remove('politician', 'user');
                userIndicator.classList.add(userType);
            }
            
            // 모바일 드롭다운 업데이트
            const dropdownUsername = document.getElementById('dropdownUsername');
            const dropdownUsertype = document.getElementById('dropdownUsertype');
            if (dropdownUsername) dropdownUsername.textContent = userNickname;
            if (dropdownUsertype) dropdownUsertype.textContent = userTypeText;
            
            console.log('📝 사용자 정보 업데이트 완료:', { userNickname, userType });
        }
    }
    
    // ===== 초기화 =====
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🎯 DOM 로드 완료');
        
        // 로그인 페이지인지 확인
        const isLoginPage = window.location.pathname.includes('login.html') || 
                           window.location.pathname.endsWith('login');
        
        if (isLoginPage) {
            // 로그인 페이지: 로그인 매니저 초기화
            window.loginManager = new LoginManager();
            console.log('🔐 로그인 매니저 초기화 완료');
        }
        
        // 모든 페이지: 헤더 상태 관리자 초기화
        window.headerStateManager = new HeaderStateManager();
        console.log('🎯 헤더 상태 관리자 초기화 완료');
    });
    
    // ===== 전역 함수 노출 =====
    window.PolibatLogin = {
        version: LOGIN_CONFIG.version,
        LoginManager,
        HeaderStateManager,
        
        // 디버깅 함수들
        testLogin: function(userType = 'user', nickname = '테스트사용자') {
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('userType', userType);
            localStorage.setItem('userEmail', 'test@example.com');
            localStorage.setItem('userNickname', nickname);
            
            window.dispatchEvent(new CustomEvent('userLoginSuccess', {
                detail: { userType, userNickname: nickname }
            }));
            
            console.log('🧪 테스트 로그인 완료:', { userType, nickname });
        },
        
        testLogout: function() {
            ['userLoggedIn', 'userType', 'userEmail', 'userNickname'].forEach(key => {
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
            });
            
            window.dispatchEvent(new CustomEvent('userLogout'));
            console.log('🧪 테스트 로그아웃 완료');
        },
        
        getLoginStatus: function() {
            return {
                isLoggedIn: localStorage.getItem('userLoggedIn') === 'true' || 
                           sessionStorage.getItem('userLoggedIn') === 'true',
                userType: localStorage.getItem('userType') || sessionStorage.getItem('userType'),
                userNickname: localStorage.getItem('userNickname') || sessionStorage.getItem('userNickname'),
                userEmail: localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail')
            };
        }
    };
    
    console.log(`🎉 정치방망이 로그인 시스템 v${LOGIN_CONFIG.version} 로드 완료`);
    
})();