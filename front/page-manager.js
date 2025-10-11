/**
 * 정치방망이 페이지 통합 관리 시스템
 * @version 2.0.0
 * @description 모든 페이지에서 헤더/푸터 로드 및 상태 관리
 */

(function() {
    'use strict';
    
    // ===== 시스템 설정 =====
    const PAGE_CONFIG = {
        version: '2.0.0',
        retryAttempts: 10,
        retryDelay: 200,
        headerFile: 'header.html',
        footerFile: 'footer.html'
    };
    
    // ===== 페이지 감지 시스템 =====
    class PageDetector {
        static detectCurrentPage() {
            const currentPath = window.location.pathname;
            const currentFile = currentPath.split('/').pop() || 'index.html';
            const pageName = currentFile.replace(/\.html?$/i, '');
            
            const pageMapping = {
                '': 'index',
                'index': 'index',
                'board': 'board',
                'voice': 'voice',
                'vote_board': 'vote_board',
                'member_info': 'member_info',
                'mypage': 'member_info',
                'login': 'login',
                'signup': 'signup'
            };
            
            const detectedPage = pageMapping[pageName] || pageName || 'index';
            
            console.log('🔍 페이지 자동 감지:', {
                currentPath,
                currentFile,
                pageName,
                detectedPage
            });
            
            return detectedPage;
        }
    }
    
    // ===== 헤더/푸터 로더 =====
    class HeaderFooterLoader {
        constructor() {
            this.headerLoaded = false;
            this.footerLoaded = false;
        }
        
        async loadHeaderFooter() {
            console.log('📁 헤더/푸터 로드 시작');
            
            const promises = [];
            
            // 헤더 로드
            if (document.getElementById('header-include')) {
                promises.push(this.loadFile('header-include', PAGE_CONFIG.headerFile));
            }
            
            // 푸터 로드
            if (document.getElementById('footer-include')) {
                promises.push(this.loadFile('footer-include', PAGE_CONFIG.footerFile));
            }
            
            try {
                await Promise.all(promises);
                console.log('✅ 헤더/푸터 로드 완료');
                
                // 헤더 로드 완료 후 초기화
                if (this.headerLoaded) {
                    setTimeout(() => {
                        this.initializeHeader();
                    }, 100);
                }
                
            } catch (error) {
                console.error('❌ 헤더/푸터 로드 실패:', error);
            }
        }
        
        async loadFile(elementId, fileName) {
            try {
                const response = await fetch(fileName);
                if (!response.ok) {
                    throw new Error(`파일 로딩 실패: ${response.status}`);
                }
                
                const content = await response.text();
                const element = document.getElementById(elementId);
                
                if (element) {
                    element.innerHTML = content;
                    
                    if (elementId === 'header-include') {
                        this.headerLoaded = true;
                    } else if (elementId === 'footer-include') {
                        this.footerLoaded = true;
                    }
                    
                    console.log(`✅ ${fileName} 로드 완료`);
                } else {
                    console.error(`❌ 요소를 찾을 수 없음: ${elementId}`);
                }
                
            } catch (error) {
                console.error(`❌ ${fileName} 로드 실패:`, error);
                throw error;
            }
        }
        
        initializeHeader() {
            console.log('🔧 헤더 초기화 시작');
            
            // 헤더 관리자가 있으면 초기화
            if (window.GlobalHeaderManager) {
                window.GlobalHeaderManager.init();
            } else if (window.headerStateManager) {
                window.headerStateManager.updateHeaderState();
            } else {
                // 기본 헤더 초기화
                this.initializeBasicHeader();
            }
        }
        
        initializeBasicHeader() {
            console.log('🔧 기본 헤더 초기화');
            
            // 현재 페이지 메뉴 하이라이트
            this.highlightCurrentMenu();
            
            // 로그인 상태 확인 및 헤더 업데이트
            this.updateHeaderLoginState();
            
            // 기본 이벤트 바인딩
            this.bindBasicEvents();
        }
        
        highlightCurrentMenu() {
            const currentPage = window.CURRENT_PAGE;
            const menuItems = document.querySelectorAll('.menu a');
            
            const pageMenuMap = {
                'index': ['index.html', '/', ''],
                'board': ['board.html'],
                'voice': ['voice.html'],
                'vote_board': ['vote_board.html'],
                'member_info': ['member_info.html', 'mypage.html']
            };
            
            menuItems.forEach(item => {
                const href = item.getAttribute('href');
                const pagesToCheck = pageMenuMap[currentPage] || [];
                
                const isActive = pagesToCheck.some(page => 
                    href && (href.includes(page) || href === page)
                );
                
                if (isActive) {
                    item.classList.add('active');
                    console.log('🎯 현재 페이지 메뉴 하이라이트:', href);
                } else {
                    item.classList.remove('active');
                }
            });
        }
        
        updateHeaderLoginState() {
            const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true' || 
                              sessionStorage.getItem('userLoggedIn') === 'true';
            
            const loginMenu = document.getElementById('loginMenu');
            const loggedInMenu = document.getElementById('loggedInMenu');
            
            if (!loginMenu || !loggedInMenu) {
                console.warn('⚠️ 헤더 메뉴 요소를 찾을 수 없음');
                return;
            }
            
            if (isLoggedIn) {
                loginMenu.style.display = 'none';
                loginMenu.classList.add('hidden');
                loggedInMenu.style.display = 'flex';
                loggedInMenu.classList.remove('hidden');
                
                this.updateUserInfo();
                console.log('✅ 로그인 상태 헤더 표시');
            } else {
                loginMenu.style.display = 'flex';
                loginMenu.classList.remove('hidden');
                loggedInMenu.style.display = 'none';
                loggedInMenu.classList.add('hidden');
                
                console.log('✅ 로그아웃 상태 헤더 표시');
            }
        }
        
        updateUserInfo() {
            const userNickname = localStorage.getItem('userNickname') || 
                               sessionStorage.getItem('userNickname') || '사용자';
            const userType = localStorage.getItem('userType') || 
                            sessionStorage.getItem('userType') || 'user';
            const userTypeText = userType === 'politician' ? '정치인' : '일반회원';
            
            // PC 버전 사용자 정보 업데이트
            const usernameDisplay = document.getElementById('usernameDisplay');
            const userTypeDisplay = document.getElementById('userTypeText');
            const userIndicator = document.getElementById('userIndicator');
            
            if (usernameDisplay) usernameDisplay.textContent = userNickname;
            if (userTypeDisplay) userTypeDisplay.textContent = userTypeText;
            if (userIndicator) {
                userIndicator.classList.remove('politician', 'user');
                userIndicator.classList.add(userType);
            }
            
            // 모바일 드롭다운 사용자 정보 업데이트
            const dropdownUsername = document.getElementById('dropdownUsername');
            const dropdownUsertype = document.getElementById('dropdownUsertype');
            if (dropdownUsername) dropdownUsername.textContent = userNickname;
            if (dropdownUsertype) dropdownUsertype.textContent = userTypeText;
            
            console.log('📝 사용자 정보 업데이트:', { userNickname, userType });
        }
        
        bindBasicEvents() {
            // 로그아웃 버튼 이벤트
            document.addEventListener('click', (e) => {
                if (e.target.matches('.logout-btn, .logout-dropdown-btn')) {
                    e.preventDefault();
                    this.handleLogout();
                }
            });
            
            // 모바일 메뉴 버튼 이벤트
            document.addEventListener('click', (e) => {
                if (e.target.closest('.mobile-menu-button')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const button = e.target.closest('.mobile-menu-button');
                    const menuType = button.getAttribute('data-menu-type');
                    this.toggleMobileMenu(menuType);
                }
            });
            
            // 외부 클릭으로 드롭다운 닫기
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.user-menu')) {
                    this.closeAllDropdowns();
                }
            });
            
            // 저장소 변경 감지 (다른 탭에서의 로그인/로그아웃)
            window.addEventListener('storage', (e) => {
                if (['userLoggedIn', 'userNickname', 'userType'].includes(e.key)) {
                    console.log('📦 저장소 변경 감지:', e.key);
                    this.updateHeaderLoginState();
                }
            });
            
            console.log('🔧 기본 이벤트 바인딩 완료');
        }
        
        handleLogout() {
            console.log('🚪 로그아웃 처리');
            
            const keysToRemove = ['userLoggedIn', 'userType', 'userEmail', 'userNickname'];
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
            });
            
            this.updateHeaderLoginState();
            window.dispatchEvent(new CustomEvent('userLogout'));
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        }
        
        toggleMobileMenu(type) {
            const dropdownId = type === 'login' ? 'loginDropdown' : 'userDropdown';
            const dropdown = document.getElementById(dropdownId);
            
            if (!dropdown) return;
            
            if (this.activeDropdown === dropdown) {
                this.closeAllDropdowns();
                return;
            }
            
            this.closeAllDropdowns();
            dropdown.classList.add('active');
            this.activeDropdown = dropdown;
        }
        
        closeAllDropdowns() {
            const dropdowns = document.querySelectorAll('.mobile-dropdown');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
            this.activeDropdown = null;
        }
    }
    
    // ===== 리디렉션 관리자 =====
    class RedirectionManager {
        static setupLoginRedirection() {
            const currentPage = window.CURRENT_PAGE;
            
            // 로그인 페이지가 아닐 때만 실행
            if (currentPage === 'login') return;
            
            document.addEventListener('DOMContentLoaded', () => {
                // 현재 페이지를 이전 페이지로 저장
                const currentUrl = window.location.href;
                sessionStorage.setItem('previousPage', currentUrl);
                console.log('📍 현재 페이지 저장:', currentUrl);
                
                // 로그인 링크에 redirect 파라미터 추가
                setTimeout(() => {
                    this.addRedirectParamsToLoginLinks();
                }, 1000);
            });
        }
        
        static addRedirectParamsToLoginLinks() {
            const loginLinks = document.querySelectorAll('a[href*="login.html"], .login-btn');
            
            loginLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    const currentUrl = window.location.href;
                    const loginUrl = this.getAttribute('href') || 'login.html';
                    
                    // 이미 redirect 파라미터가 있는지 확인
                    if (loginUrl.includes('redirect=')) return;
                    
                    const separator = loginUrl.includes('?') ? '&' : '?';
                    const newUrl = loginUrl + separator + 'redirect=' + encodeURIComponent(currentUrl);
                    
                    console.log('🔗 로그인 링크 클릭, 리디렉션 URL 설정:', newUrl);
                    this.href = newUrl;
                });
            });
        }
    }
    
    // ===== 메인 페이지 관리자 =====
    class PageManager {
        constructor() {
            this.currentPage = PageDetector.detectCurrentPage();
            this.headerFooterLoader = new HeaderFooterLoader();
            
            this.init();
        }
        
        init() {
            console.log('🚀 페이지 관리자 초기화');
            
            // 전역 변수 설정
            window.CURRENT_PAGE = this.currentPage;
            
            // 헤더/푸터 로드
            this.headerFooterLoader.loadHeaderFooter();
            
            // 리디렉션 관리 설정
            RedirectionManager.setupLoginRedirection();
            
            // 로그인 상태 변경 이벤트 리스너
            this.bindLoginEvents();
            
            console.log('✅ 페이지 관리자 초기화 완료');
        }
        
        bindLoginEvents() {
            // 로그인 성공 이벤트
            window.addEventListener('userLoginSuccess', (e) => {
                console.log('📡 로그인 성공 이벤트 수신:', e.detail);
                setTimeout(() => {
                    this.headerFooterLoader.updateHeaderLoginState();
                }, 100);
            });
            
            // 로그아웃 이벤트
            window.addEventListener('userLogout', () => {
                console.log('📡 로그아웃 이벤트 수신');
                this.headerFooterLoader.updateHeaderLoginState();
            });
        }
    }
    
    // ===== 디버깅 도구 =====
    const DebugTools = {
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
        
        getPageInfo: function() {
            return {
                currentPage: window.CURRENT_PAGE,
                loginStatus: {
                    isLoggedIn: localStorage.getItem('userLoggedIn') === 'true' || 
                               sessionStorage.getItem('userLoggedIn') === 'true',
                    userType: localStorage.getItem('userType') || sessionStorage.getItem('userType'),
                    userNickname: localStorage.getItem('userNickname') || sessionStorage.getItem('userNickname')
                },
                url: window.location.href,
                previousPage: sessionStorage.getItem('previousPage')
            };
        }
    };
    
    // ===== 초기화 =====
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🎯 DOM 로드 완료 - 페이지 관리자 시작');
        
        // 페이지 관리자 초기화
        window.pageManager = new PageManager();
        
        // 디버깅 도구 전역 노출
        window.PolibatPageManager = {
            version: PAGE_CONFIG.version,
            pageManager: window.pageManager,
            debug: DebugTools,
            
            // 유틸리티 함수들
            getCurrentPage: () => window.CURRENT_PAGE,
            isLoggedIn: () => localStorage.getItem('userLoggedIn') === 'true' || 
                             sessionStorage.getItem('userLoggedIn') === 'true',
            forceHeaderUpdate: () => {
                if (window.pageManager && window.pageManager.headerFooterLoader) {
                    window.pageManager.headerFooterLoader.updateHeaderLoginState();
                }
            }
        };
        
        console.log(`🎉 페이지 관리 시스템 v${PAGE_CONFIG.version} 초기화 완료`);
        console.log('현재 페이지:', window.CURRENT_PAGE);
    });
    
})();