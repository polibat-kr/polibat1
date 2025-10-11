;(function () {
	
	// jQuery 존재 여부 확인
	var jQueryAvailable = (typeof $ !== 'undefined' && typeof jQuery !== 'undefined');
	
	if (!jQueryAvailable) {
		console.warn('⚠️ jQuery가 로드되지 않음. jQuery 기반 기능은 비활성화됩니다.');
		console.log('💡 해결방법: <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>를 추가하세요.');
	} else {
		console.log('✅ jQuery 로드 확인됨');
	}
	
	// ==================== 모바일 디바이스 감지 ====================
	
	/**
	 * 모바일 디바이스 감지 객체
	 * 다양한 모바일 플랫폼을 감지하는 유틸리티
	 */
	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	// ==================== 모바일 메뉴 관련 기능 ====================

	/**
	 * 모바일 메뉴 외부 클릭 시 메뉴 닫기
	 */
	var mobileMenuOutsideClick = function() {
		if (!jQueryAvailable) return;
		
		$(document).ready(function() {
			$(document).click(function (e) {
				var container = $("#fh5co-offcanvas, .js-fh5co-nav-toggle");
				if (!container.is(e.target) && container.has(e.target).length === 0) {
					if ( $('body').hasClass('offcanvas') ) {
						$('body').removeClass('offcanvas');
						$('.js-fh5co-nav-toggle').removeClass('active');
					}
				}
			});
		});
	};

	/**
	 * 오프캔버스 메뉴 초기화
	 */
	var offcanvasMenu = function() {
		if (!jQueryAvailable) return;
		
		$(document).ready(function() {
			// 요소가 존재하는지 확인
			if ($('#page').length > 0) {
				$('#page').prepend('<div id="fh5co-offcanvas" />');
				$('#page').prepend('<a href="#" class="js-fh5co-nav-toggle fh5co-nav-toggle fh5co-nav-white"><i></i></a>');
				
				if ($('.menu-1 > ul').length > 0) {
					var clone1 = $('.menu-1 > ul').clone();
					$('#fh5co-offcanvas').append(clone1);
				}
				
				if ($('.menu-2 > ul').length > 0) {
					var clone2 = $('.menu-2 > ul').clone();
					$('#fh5co-offcanvas').append(clone2);
				}

				$('#fh5co-offcanvas .has-dropdown').addClass('offcanvas-has-dropdown');
				$('#fh5co-offcanvas')
					.find('li')
					.removeClass('has-dropdown');

				// 모바일에서 드롭다운 메뉴 hover 효과
				$('.offcanvas-has-dropdown').mouseenter(function(){
					var $this = $(this);
					$this
						.addClass('active')
						.find('ul')
						.slideDown(500, 'easeOutExpo');				
				}).mouseleave(function(){
					var $this = $(this);
					$this
						.removeClass('active')
						.find('ul')
						.slideUp(500, 'easeOutExpo');				
				});

				$(window).resize(function(){
					if ( $('body').hasClass('offcanvas') ) {
						$('body').removeClass('offcanvas');
						$('.js-fh5co-nav-toggle').removeClass('active');
					}
				});
			}
		});
	};

	/**
	 * 버거 메뉴 토글 기능
	 */
	var burgerMenu = function() {
		if (!jQueryAvailable) return;
		
		$(document).ready(function() {
			$('body').on('click', '.js-fh5co-nav-toggle', function(event){
				var $this = $(this);

				if ( $('body').hasClass('overflow offcanvas') ) {
					$('body').removeClass('overflow offcanvas');
				} else {
					$('body').addClass('overflow offcanvas');
				}
				$this.toggleClass('active');
				event.preventDefault();
			});
		});
	};

	// ==================== 애니메이션 및 효과 ====================

	/**
	 * 스크롤 기반 애니메이션 (Waypoint)
	 */
	var contentWayPoint = function() {
		if (!jQueryAvailable) return;
		
		$(document).ready(function() {
			if ($('.animate-box').length > 0) {
				var i = 0;
				$('.animate-box').waypoint( function( direction ) {
					if( direction === 'down' && !$(this.element).hasClass('animated-fast') ) {
						i++;
						$(this.element).addClass('item-animate');
						setTimeout(function(){
							$('body .animate-box.item-animate').each(function(k){
								var el = $(this);
								setTimeout( function () {
									var effect = el.data('animate-effect');
									if ( effect === 'fadeIn') {
										el.addClass('fadeIn animated-fast');
									} else if ( effect === 'fadeInLeft') {
										el.addClass('fadeInLeft animated-fast');
									} else if ( effect === 'fadeInRight') {
										el.addClass('fadeInRight animated-fast');
									} else {
										el.addClass('fadeInUp animated-fast');
									}
									el.removeClass('item-animate');
								},  k * 200, 'easeInOutExpo' );
							});
						}, 100);
					}
				} , { offset: '85%' } );
			}
		});
	};

	/**
	 * 드롭다운 메뉴 효과
	 */
	var dropdown = function() {
		if (!jQueryAvailable) return;
		
		$(document).ready(function() {
			if ($('.has-dropdown').length > 0) {
				$('.has-dropdown').mouseenter(function(){
					var $this = $(this);
					$this
						.find('.dropdown')
						.css('display', 'block')
						.addClass('animated-fast fadeInUpMenu');
				}).mouseleave(function(){
					var $this = $(this);
					$this
						.find('.dropdown')
						.css('display', 'none')
						.removeClass('animated-fast fadeInUpMenu');
				});
			}
		});
	};

	/**
	 * 맨 위로 스크롤 기능
	 */
	var goToTop = function() {
		if (!jQueryAvailable) {
			// jQuery 없이 구현
			document.addEventListener('DOMContentLoaded', function() {
				var goTopBtn = document.querySelector('.js-gotop');
				if (goTopBtn) {
					goTopBtn.addEventListener('click', function(event) {
						event.preventDefault();
						window.scrollTo({
							top: 0,
							behavior: 'smooth'
						});
						return false;
					});
				}

				window.addEventListener('scroll', function() {
					var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
					var topBtn = document.querySelector('.js-top');
					if (topBtn) {
						if (scrollTop > 200) {
							topBtn.classList.add('active');
						} else {
							topBtn.classList.remove('active');
						}
					}
				});
			});
			return;
		}
		
		$(document).ready(function() {
			// .js-gotop 요소가 존재하는지 확인
			if ($('.js-gotop').length > 0) {
				$('.js-gotop').on('click', function(event){
					event.preventDefault();
					$('html, body').animate({
						scrollTop: $('html').offset().top
					}, 500, 'easeInOutExpo');
					return false;
				});
			}

			$(window).scroll(function(){
				var $win = $(window);
				if ($win.scrollTop() > 200) {
					$('.js-top').addClass('active');
				} else {
					$('.js-top').removeClass('active');
				}
			});
		});
	};

	/**
	 * 로딩 페이지 처리
	 */
	var loaderPage = function() {
		if (!jQueryAvailable) {
			// jQuery 없이 구현
			document.addEventListener('DOMContentLoaded', function() {
				var loader = document.querySelector('.fh5co-loader');
				if (loader) {
					setTimeout(function() {
						loader.style.opacity = '0';
						loader.style.transition = 'opacity 0.5s ease';
						setTimeout(function() {
							loader.style.display = 'none';
						}, 500);
					}, 100);
				}
			});
			return;
		}
		
		$(document).ready(function() {
			if ($(".fh5co-loader").length > 0) {
				$(".fh5co-loader").fadeOut("slow");
			}
		});
	};

	// ==================== 카운터 기능 ====================

	/**
	 * 숫자 카운터 애니메이션
	 */
	var counter = function() {
		if (!jQueryAvailable) return;
		
		$(document).ready(function() {
			if ($('.js-counter').length > 0) {
				$('.js-counter').countTo({
					formatter: function (value, options) {
						return value.toFixed(options.decimals);
					},
				});
			}
		});
	};

	/**
	 * 스크롤 기반 카운터 트리거
	 */
	var counterWayPoint = function() {
		if (!jQueryAvailable) return;
		
		$(document).ready(function() {
			if ($('#fh5co-counter').length > 0 ) {
				$('#fh5co-counter').waypoint( function( direction ) {
					if( direction === 'down' && !$(this.element).hasClass('animated') ) {
						setTimeout( counter , 400);					
						$(this.element).addClass('animated');
					}
				} , { offset: '90%' } );
			}
		});
	};

	// ==================== 슬라이더 및 캐러셀 ====================

	/**
	 * 메인 슬라이더 초기화
	 */
	var sliderMain = function() {
		if (!jQueryAvailable) return;
		
		$(document).ready(function() {
			if ($('#fh5co-hero .flexslider').length > 0) {
				$('#fh5co-hero .flexslider').flexslider({
					animation: "slide",
					easing: "swing",
					direction: "vertical",
					slideshowSpeed: 5000,
					directionNav: true,
					start: function(){
						setTimeout(function(){
							$('.slider-text').removeClass('animated fadeInUp');
							$('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
						}, 500);
					},
					before: function(){
						setTimeout(function(){
							$('.slider-text').removeClass('animated fadeInUp');
							$('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
						}, 500);
					}
				});
			}
		});
	};

	/**
	 * Parallax 효과 (데스크톱만)
	 */
	var parallax = function() {
		if (!jQueryAvailable) return;
		
		$(document).ready(function() {
			if (!isMobile.any() && typeof $.fn.stellar === 'function') {
				$(window).stellar({
					horizontalScrolling: false,
					hideDistantElements: false, 
					responsive: true
				});
			}
		});
	};

	/**
	 * 증언/후기 캐러셀
	 */
	var testimonialCarousel = function(){
		if (!jQueryAvailable) return;
		
		$(document).ready(function() {
			if ($('.owl-carousel-fullwidth').length > 0) {
				var owl = $('.owl-carousel-fullwidth');
				owl.owlCarousel({
					items: 1,
					loop: true,
					margin: 0,
					nav: false,
					dots: true,
					smartSpeed: 800,
					autoHeight: true
				});
			}
		});
	};

	// ==================== 메인 초기화 ====================

	/**
	 * 모든 기능 초기화 (오류 방지)
	 */
	if (jQueryAvailable) {
		$(function(){
			try {
				mobileMenuOutsideClick();
				offcanvasMenu();
				burgerMenu();
				contentWayPoint();
				dropdown();
				goToTop();
				loaderPage();
				counterWayPoint();
				counter();
				parallax();
				sliderMain();
				testimonialCarousel();
				console.log('✅ jQuery 기반 기능 초기화 완료');
			} catch (error) {
				console.warn('main.js 초기화 중 일부 오류 발생:', error);
			}
		});
	} else {
		// jQuery 없이 실행 가능한 기능들만 초기화
		document.addEventListener('DOMContentLoaded', function() {
			try {
				goToTop();
				loaderPage();
				console.log('✅ 기본 기능만 초기화 완료 (jQuery 없음)');
			} catch (error) {
				console.warn('main.js 초기화 중 일부 오류 발생:', error);
			}
		});
	}

}());

// ==================== 정치인 카드/투표 시스템 ====================

/**
 * 정치인 카드 정렬 및 필터링 변수
 */
let sortMode = 'votes';
let filterParty = '';
let filterRegion = '';

/**
 * 후보자 데이터
 */
const candidates = [
	{ id: 1, name: '김용민', img: 'https://www.assembly.go.kr/static/portal/img/openassm/new/e8f8918e741b4ae9b72377d8ec299645.png', votes: 3, party: '더불어민주당', region: '경기도 남양주시병' },
	{ id: 2, name: '나경원', img: 'https://www.assembly.go.kr/static/portal/img/openassm/new/563d61a4466c42c8be2c4979c00e5060.png', votes: 8, party: '국민의힘', region: '서울 동작을' },
	{ id: 3, name: '박지원', img: 'https://www.assembly.go.kr/static/portal/img/openassm/new/d56ba73af8fc481bbad0165c9ed6fbe2.png', votes: 12, party: '무소속', region: '전남 목포시' },
	{ id: 4, name: '배현진', img: 'https://www.assembly.go.kr/static/portal/img/openassm/new/fc08975adb724900bfacc85909c69d02.png', votes: 12, party: '국민의힘', region: '서울 송파을' },
	{ id: 5, name: '신장식', img: 'https://www.assembly.go.kr/static/portal/img/openassm/new/dccbeab8212e4f469f0cb90b4430cb97.png', votes: 7, party: '주국혁신당', region: '경기 고양시갑' },
	{ id: 6, name: '이준석', img: 'https://www.assembly.go.kr/static/portal/img/openassm/new/f150e375dc4a4a05b0c99ae1a313b432.jpg', votes: 8, party: '국민의힘', region: '서울 노원병' }
];

/**
 * 정렬 모드 설정
 * @param {string} mode - 정렬 모드 ('default', 'name', 'votes')
 */
function setSort(mode) {
	sortMode = mode;
	if (document.querySelectorAll('.filter-group button').length > 0) {
		document.querySelectorAll('.filter-group button').forEach(btn => btn.classList.remove('active'));
		document.querySelectorAll('.filter-group button').forEach(btn => {
			if (btn.textContent.includes('기본') && mode === 'default') btn.classList.add('active');
			if (btn.textContent.includes('이름') && mode === 'name') btn.classList.add('active');
			if (btn.textContent.includes('득표') && mode === 'votes') btn.classList.add('active');
		});
	}
	renderCandidates();
}

/**
 * 필터 설정
 * @param {string} type - 필터 타입 ('party', 'region')
 * @param {string} value - 필터 값
 */
function setFilter(type, value) {
	if (type === 'party') filterParty = value;
	if (type === 'region') filterRegion = value;
	renderCandidates();
}

/**
 * 후보자 컨테이너 스크롤
 * @param {number} direction - 스크롤 방향 (-1: 왼쪽, 1: 오른쪽)
 */
function scrollContainer(direction) {
	const container = document.getElementById('voteContainer');
	if (container) {
		const scrollAmount = 300;
		container.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
	}
}

/**
 * 후보자 카드 렌더링
 */
function renderCandidates() {
	const container = document.getElementById('cardList');
	if (!container) return;
	
	container.innerHTML = '';
	
	let filtered = [...candidates];

	// 필터 적용
	if (filterParty) filtered = filtered.filter(c => c.party === filterParty);
	if (filterRegion) filtered = filtered.filter(c => c.region.includes(filterRegion));

	// 상위 4명 계산
	const topSorted = [...filtered].sort((a, b) => b.votes - a.votes);
	const topIds = topSorted.slice(0, 4).map(c => c.id);

	// 정렬 적용
	if (sortMode === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
	else if (sortMode === 'votes') filtered.sort((a, b) => b.votes - a.votes);

	// 카드 렌더링
	const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
	filtered.forEach((c, index) => {
		const percent = totalVotes ? ((c.votes / totalVotes) * 100).toFixed(1) : 0;
		const card = document.createElement('div');
		card.className = 'candidate-card';

		// 순위 배지 생성
		let rankIconHtml = '';
		if (index === 0) {
			rankIconHtml = `<img src="images/badge_gold.png" class="top-badge-img" alt="1등">`;
		} else if (index === 1) {
			rankIconHtml = `<img src="images/badge_silver.png" class="top-badge-img" alt="2등">`;
		} else if (index === 2) {
			rankIconHtml = `<img src="images/badge_bronze.png" class="top-badge-img" alt="3등">`;
		} else {
			rankIconHtml = `<div class="rank-text">${index + 1}위</div>`;
		}

		card.innerHTML = `
			<div style="position:relative">
				${rankIconHtml}
				<img src="${c.img}" alt="${c.name}" class="candidate-img">
				<div class="candidate-info">
					<h2>${c.name}</h2>
					<p>${c.party} | ${c.region}</p>
					<p>${c.votes}표 (${percent}%)</p>
					<div class="vote-bar-container">
						<div class="vote-bar" style="width: ${percent}%"></div>
					</div>
				</div>
			</div>
		`;
		container.appendChild(card);
	});
}

// ==================== 자유게시판 시스템 ====================

/**
 * 게시글 샘플 데이터 - 2025년 정치 현안 반영
 */
const sampleTitles = [
	"청년 주택 정책, 정말 실효성 있을까요?", 
	"최저임금 인상 vs 소상공인 부담... 어떻게 생각하세요?", 
	"의대 정원 확대, 의료진 부족 해결책 맞나요?", 
	"탄소중립 정책, 현실적으로 가능한가요?", 
	"지방소멸 대책, 구체적인 방안이 있나요?",
	"디지털 플랫폼 규제, 어디까지가 적정선일까요?",
	"육아휴직 확대, 기업 부담은 어떻게 해결할까요?",
	"국민연금 개혁, 미래세대 부담 줄일 방법은?",
	"전세사기 피해 방지책, 실제로 효과 있을까요?",
	"지역균형발전, 수도권 집중 해소 가능한가요?"
];

const sampleContents = [
	"LH 청년전세임대 확대한다는데, 실제 신청해보니 경쟁률이...", 
	"소상공인 입장도 이해되고 알바생 입장도 이해되고 참 어렵네요.", 
	"의대 정원 늘린다고 의사 부족이 바로 해결될까요? 지방은 여전히...", 
	"2030 탄소중립 목표 달성하려면 우리 생활도 많이 바뀌어야 하는데", 
	"우리 동네도 인구가 계속 줄어들고 있어요. 일자리가 없으니...",
	"빅테크 규제는 필요하지만 혁신을 막으면 안 되는데 균형이 어려워요",
	"육아휴직 늘리는 건 좋은데 중소기업은 인력 부족으로 힘들어해요",
	"지금 20대인데 나중에 연금 받을 수 있을지 걱정돼요",
	"전세보증금 돌려받지 못한 지인들 보니까 정말 심각한 문제같아요",
	"서울 집중화 해소한다고 하지만 여전히 일자리는 수도권에만..."
];

const sampleAuthors = ["민지", "철수", "영희", "지훈", "수빈"];

/**
 * 정치인 목록 (소통 대상) - voice.html과 통일
 */
const selectedPoliticians = [
		"원희룡 국회의원", 
		"이정식 국회의원", 
		"조규홍 국회의원", 
		"안덕근 국회의원",
		"이상민 국회의원",
		"이종호 국회의원",
		"이주호 국회의원",
		"최상목 국회의원",
		"박성재 국회의원",
		"김용현 국회의원",
		"이재명 국회의원",
		"한동훈 국회의원",
		"조국 국회의원",
		"안철수 국회의원",
		"진선미 국회의원",
		"김기현 국회의원",
		"양이원영 국회의원",
		"추경호 국회의원",
		"윤건영 국회의원",
		"주호영 국회의원",
		"김동연 국회의원",
		"오세훈 국회의원",
		"김영록 국회의원",
		"김관영 국회의원",
		"박형준 국회의원",
		"유정복 국회의원"
];

// 기존 selectedPoliticians, mpPhotos 배열 삭제 또는 주석처리
// 정치인 이름-사진 매핑 객체 배열 생성
const politicians = [
  { name: "정청래 국회의원", photo: "https://www.assembly.go.kr/static/portal/img/openassm/new/9f6decd03010411db7bf51e526fbf348.jpg" },
  { name: "박주민 국회의원", photo: "https://www.assembly.go.kr/static/portal/img/openassm/new/4e926bae67ad43a6a87ad68da8d0c0fe.png" },
  { name: "심상정 국회의원", photo: "https://theminjoo.kr/people/connect/people/20/profile.jpg" },
  { name: "이준석 국회의원", photo: "https://www.assembly.go.kr/static/portal/img/openassm/new/f150e375dc4a4a05b0c99ae1a313b432.jpg" },
  { name: "이요나 국회의원", photo: "" }, // 사진 없는 케이스
  // ... 필요시 추가 정치인 ...
];

// ==================== 🆕 직접등록 기능 추가 (voice.html과 통일) ==================== 

/**
 * 정치인 이름 추출 함수 (voice.html과 동일)
 * "홍길동 의원" -> "홍길동"
 * "원희룡 국토교통부 장관" -> "원희룡"
 * "이재명 더불어민주당 대표" -> "이재명"
 * "김철수 시의원" -> "김철수"
 */
function extractPoliticianName(fullName) {
	// 첫 번째 공백 앞의 이름만 추출
	const nameOnly = fullName.split(' ')[0];
	return nameOnly;
}

/**
 * 특별 배지 및 작성자 결정 함수 (voice.html과 동일)
 */
function determinePostDisplayInfo(post) {
	const randomValue = Math.random();
	let specialBadge = '';
	let displayAuthor = post.author; // 기본값: 원래 작성자
	
	if (randomValue > 0.8) {
		// 직접등록: 정치인이 직접 게시글을 작성
		specialBadge = '<span class="mp-direct-badge">✔️직접등록</span>';
		displayAuthor = extractPoliticianName(post.selectedPolitician); // 🆕 정치인 이름으로 변경
	} else if (randomValue > 0.6) {
		// 직접답변: 정치인이 일반 사용자 글에 답변
		specialBadge = '<span class="direct-reply-icon">직접답변</span>';
		displayAuthor = post.author; // 원래 작성자 유지
	}
	// 나머지 60%는 배지 없음, 원래 작성자 유지
	
	return { specialBadge, displayAuthor };
}

/**
 * 게시글 데이터 생성 (voice.html과 통일)
 */
const posts = Array.from({ length: 20 }, (_, i) => {
  const politician = politicians[i % politicians.length];
  // 사진이 없으면 기본 이미지로 대체
  const photo = politician.photo && politician.photo.trim() !== '' ? politician.photo : 'images/Group_10.png';
  return {
    id: i + 1,
    title: sampleTitles[i % sampleTitles.length],
    content: sampleContents[i % sampleContents.length],
    author: sampleAuthors[i % sampleAuthors.length],
    selectedPolitician: politician.name,
    politicianPhoto: photo,
    date: `25.04.${(i % 30 + 1).toString().padStart(2, '0')}.`,
    views: Math.floor(Math.random() * 1000),
    likes: Math.floor(Math.random() * 500),
    comments: Math.floor(Math.random() * 20),
    hasDirectReply: i % 7 === 0,
    isMpPost: i % 10 === 2
  };
});

/**
 * 페이지네이션 설정
 */
const postsPerPage = 10;
let currentPage = 1;
let filteredPosts = [...posts];

/**
 * 정치인 프로필 사진
 */
const mpPhotos = [
	"https://www.assembly.go.kr/static/portal/img/openassm/new/d9301705a1ab42bf8ab78c4bbd24f068.jpg",
	"https://www.assembly.go.kr/static/portal/img/openassm/new/4e926bae67ad43a6a87ad68da8d0c0fe.png",
	"https://www.assembly.go.kr/static/portal/img/openassm/new/f150e375dc4a4a05b0c99ae1a313b432.jpg",
	"https://www.assembly.go.kr/static/portal/img/openassm/new/fc08975adb724900bfacc85909c69d02",
	"https://www.assembly.go.kr/static/portal/img/openassm/new/9f6decd03010411db7bf51e526fbf348.jpg"
];

/**
 * 🆕 인기글 렌더링 함수 (직접등록 닉네임 수정 적용)
 */
function renderPopularPosts() {
	const container = document.querySelector('.popular-posts-wrapper');
	if (!container) return;

	const sorted = [...posts].sort((a, b) => b.views - a.views);
	const top3 = sorted.slice(0, 3);

	container.innerHTML = top3.map(post => {
		// const thumbnail = mpPhotos[post.id % mpPhotos.length]; // ❌ 기존 코드
		// 🆕 특별 배지 및 작성자 결정 (voice.html과 동일한 로직)
		const { specialBadge, displayAuthor } = determinePostDisplayInfo(post);
		const photo = post.politicianPhoto && post.politicianPhoto.trim() !== '' ? post.politicianPhoto : 'images/Group_10.png';

		return `
			<div class="popular-post-card horizontal" onclick="window.location.href='/board_01.html'">
				<div class="popular-thumb-box">
					<img src="${photo}" class="popular-thumbnail" alt="썸네일"
						 onerror="this.onerror=null; this.src='images/Group_10.png';">
				</div>
				<div class="popular-text-box">
					<div class="politician-info-top">
						<div class="politician-badge">${post.selectedPolitician}</div>
						${specialBadge}
					</div>
					<div class="title">
						${post.title}
						${post.comments > 0 ? ` <span class="comment-badge">[${post.comments}]</span>` : ''}
					</div>
					<div class="content">${post.content}</div>
					<div class="meta">
						<div class="meta-left">
							<span>${displayAuthor}</span>
							<span class="meta-separator">·</span>
							<span>${post.date}</span>
							<span class="meta-separator">·</span>
							<span class="likes-info">추천 ${post.likes}</span>
							<span class="meta-separator">·</span>
							<span class="views-info">조회수 ${post.views}</span>
						</div>
					</div>
				</div>
			</div>
		`;
	}).join('');
}

/**
 * 🆕 게시글 테이블 렌더링 (직접등록 닉네임 수정 적용)
 * @param {Array} filteredPosts - 필터링된 게시글 배열
 */
function renderTable(filteredPosts) {
	const boardBody = document.getElementById('boardBody');
	if (!boardBody) return;

	const start = (currentPage - 1) * postsPerPage;
	const end = start + postsPerPage;
	const visiblePosts = filteredPosts.slice(start, end);

	// 정치인 이름 목록 추출
	const politicianNames = politicians.map(p => p.name.split(' ')[0]);

	boardBody.innerHTML = visiblePosts.map(post => {
		// 댓글 배지 HTML 생성
		const commentBadgeHtml = post.comments > 0 ? `<span class="comment-badge">[${post.comments}]</span>` : '';
		// 🆕 특별 배지 및 작성자 결정 (voice.html과 동일한 로직)
		const { specialBadge, displayAuthor } = determinePostDisplayInfo(post);
		const photo = post.politicianPhoto && post.politicianPhoto.trim() !== '' ? post.politicianPhoto : 'images/Group_10.png';

		// 작성자가 정치인인지 확인
		const isPolitician = politicianNames.includes(displayAuthor);
		const authorBadge = isPolitician ? '<span class="author-type-badge politician-role">정치인</span>' : '';

		return `
			<tr onclick="window.location.href='/board_01.html'" style="cursor:pointer;">
				<td colspan="2">
					<div class="thumbnail-row">
						<div class="thumbnail-box" style="position: relative;">
							<img src="${photo}" 
								 alt="썸네일" 
								 class="thumbnail-img"
								 onerror="this.onerror=null; this.src='images/Group_10.png';">
						</div>
						<div class="thumbnail-text">
							<div style="display: flex; align-items: center; gap: 8px;">
							  <div class="politician-badge">${post.selectedPolitician}</div>
							  ${specialBadge}
							</div>
							<div class="post-title">
								${post.title}
								${commentBadgeHtml}
							</div>
							<div class="post-content">${post.content}</div>
						</div>
					</div>
					<div class="post-meta">
						${displayAuthor}${authorBadge} · ${post.date} · 추천 ${post.likes} · 조회 ${post.views}
					</div>
				</td>
				<td class="hide-on-mobile">${displayAuthor}${authorBadge}</td>
				<td class="hide-on-mobile">${post.date}</td>
				<td class="hide-on-mobile">${post.likes}</td>
				<td class="hide-on-mobile">${post.views}</td>
			</tr>
		`;
	}).join('');

	renderPagination(filteredPosts.length);
}

/**
 * 페이지네이션 렌더링
 * @param {number} total - 전체 게시글 수
 */
function renderPagination(total) {
	const pagination = document.getElementById('pagination');
	if (!pagination) return;

	const pageCount = Math.ceil(total / postsPerPage);
	pagination.innerHTML = '';

	for (let i = 1; i <= pageCount; i++) {
		const btn = document.createElement('button');
		btn.innerText = i;
		btn.className = currentPage === i ? 'active' : '';
		btn.addEventListener('click', () => {
			currentPage = i;
			renderTable(filteredPosts);
		});
		pagination.appendChild(btn);
	}
}

// ==================== 초기화 및 검색 기능 ====================

/**
 * 검색 기능 및 초기 렌더링 (jQuery 의존성 제거)
 */
function initializeSearchAndRender() {
	// 검색 기능 초기화
	const searchInput = document.getElementById('searchInput');
	if (searchInput) {
		searchInput.addEventListener('input', (e) => {
			const keyword = e.target.value.toLowerCase();
			filteredPosts = posts.filter(post =>
				post.title.toLowerCase().includes(keyword) ||
				post.content.toLowerCase().includes(keyword)
			);
			currentPage = 1;
			renderTable(filteredPosts);
		});
	}

	// 후보자 카드 초기 렌더링
	if (document.getElementById('cardList')) {
		renderCandidates();
	}

	// 게시판 초기 렌더링
	renderPopularPosts();
	renderTable(filteredPosts);
}

// jQuery 있으면 $(document).ready 사용, 없으면 DOMContentLoaded 사용
if (typeof $ !== 'undefined' && typeof jQuery !== 'undefined') {
	$(document).ready(function() {
		initializeSearchAndRender();
	});
} else {
	document.addEventListener('DOMContentLoaded', function() {
		initializeSearchAndRender();
	});
}

// ==================== 투표 시스템 ====================

/**
 * 투표 마감 시간 설정 (현재 시각 +1시간)
 */
const deadline = new Date();
deadline.setHours(deadline.getHours() + 1);

/**
 * 투표 마감 카운트다운
 */
setInterval(() => {
	const now = new Date();
	const diff = deadline - now;
	const el = document.getElementById('deadline');
	if (el) {
		if (diff <= 0) {
			el.innerText = '⏰ 투표가 마감되었습니다.';
			return;
		}
		const m = Math.floor((diff % 3600000) / 60000);
		const s = Math.floor((diff % 60000) / 1000);
		el.innerText = `투표 마감까지 남은 시간: ${m}분 ${s}초`;
	}
}, 1000);

// ==================== 투표 및 상호작용 기능 ====================

/**
 * 투표 제출 처리 함수
 */
function submitVote() {
	const sel = document.querySelector('input[name="candidate"]:checked');
	const res = document.getElementById('result');
	
	if (!sel) {
		if (res) res.innerText = '후보를 선택해주세요.';
		return;
	}
	
	if (res) res.innerText = `"${sel.value}" 후보에게 투표해주셔서 감사합니다!`;
	
	// 투표 완료 팝업 표시
	const popup = document.getElementById('popup');
	if (popup) {
		popup.style.display = 'block';
		setTimeout(() => {
			popup.style.display = 'none';
		}, 2000);
	}

	// 예시 득표 수로 그래프 업데이트
	updateVoteResults();
}

/**
 * 투표 결과 그래프 업데이트
 */
function updateVoteResults() {
	const lee = 76, han = 48, total = lee + han;
	const lp = Math.round((lee / total) * 100);
	const hp = 100 - lp;
	
	const leeCombinedBar = document.getElementById('leeCombinedBar');
	const hanCombinedBar = document.getElementById('hanCombinedBar');
	const leeCombinedPercent = document.getElementById('leeCombinedPercent');
	const hanCombinedPercent = document.getElementById('hanCombinedPercent');
	
	if (leeCombinedBar) leeCombinedBar.style.width = lp + '%';
	if (hanCombinedBar) hanCombinedBar.style.width = hp + '%';
	if (leeCombinedPercent) leeCombinedPercent.innerText = lp + '%';
	if (hanCombinedPercent) hanCombinedPercent.innerText = hp + '%';
}

/**
 * 댓글 추가 처리 함수
 */
function addComment() {
	const inp = document.getElementById('commentInput');
	if (!inp) return;
	
	const txt = inp.value.trim();
	if (!txt) return;
	
	const commentList = document.getElementById('commentList');
	if (commentList) {
		const li = document.createElement('li');
		li.textContent = '익명: ' + txt;
		commentList.prepend(li);
		inp.value = '';
		
		// 댓글 수 업데이트
		const commentCount = document.getElementById('commentCount');
		if (commentCount) {
			commentCount.innerText = document.querySelectorAll('#commentList li').length;
		}
	}
}

// ==================== 소셜 공유 기능 ====================

/**
 * 카카오톡 공유 (링크 복사로 대체)
 */
function shareKakao() {
	navigator.clipboard.writeText(location.href);
	alert('링크가 복사되었습니다!');
}

/**
 * 페이스북 공유
 */
function shareFacebook() {
	window.open(
		`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}`,
		'_blank'
	);
}

/**
 * 트위터 공유
 */
function shareTwitter() {
	window.open(
		`https://twitter.com/intent/tweet?text=${encodeURIComponent('📊 무인도 투표 결과 공유합니다!')}%20${encodeURIComponent(location.href)}`,
		'_blank'
	);
}

/**
 * 링크 복사
 */
function copyLink() {
	navigator.clipboard.writeText(location.href).then(() => {
		alert('✅ 링크 복사 완료');
	}).catch(err => {
		console.error('링크 복사 실패:', err);
		// 폴백: 수동 복사 안내
		const textArea = document.createElement('textarea');
		textArea.value = location.href;
		document.body.appendChild(textArea);
		textArea.select();
		try {
			document.execCommand('copy');
			alert('✅ 링크 복사 완료');
		} catch (err) {
			alert('❌ 링크 복사에 실패했습니다. 수동으로 복사해주세요.');
		}
		document.body.removeChild(textArea);
	});
}

// ==================== 전역 함수 노출 ====================

/**
 * 전역 스코프에 함수들을 노출하여 HTML에서 호출 가능하도록 함
 */
window.setSort = setSort;
window.setFilter = setFilter;
window.scrollContainer = scrollContainer;
window.renderCandidates = renderCandidates;
window.submitVote = submitVote;
window.addComment = addComment;
window.shareKakao = shareKakao;
window.shareFacebook = shareFacebook;
window.shareTwitter = shareTwitter;
window.copyLink = copyLink;

// ==========================================
// 정치방망이 통합 헤더 관리 시스템 - main.js
// 모든 페이지에서 공통으로 사용
// ==========================================

(function() {
    'use strict';
    
    // 🔒 중복 실행 방지
    if (window.POLIBAT_MAIN_LOADED) {
        console.log('⚠️ main.js가 이미 로드됨, 중복 실행 방지');
        return;
    }
    window.POLIBAT_MAIN_LOADED = true;
    
    console.log('🚀 정치방망이 통합 main.js 로드 시작');
    
    // ==========================================
    // 1. 페이지 자동 감지 시스템
    // ==========================================
    
    function detectCurrentPage() {
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
        console.log('🔍 페이지 자동 감지:', detectedPage);
        return detectedPage;
    }
    
    // 전역 변수 설정
    window.CURRENT_PAGE = detectCurrentPage();
    
    // ==========================================
    // 2. 통합 헤더 관리자 클래스
    // ==========================================
    
    class UnifiedHeaderManager {
        constructor() {
            this.initialized = false;
            this.retryCount = 0;
            this.maxRetries = 20;
            this.currentPage = window.CURRENT_PAGE;
            this.activeDropdown = null;
        }
        
        async init() {
            console.log('🎯 통합 헤더 관리자 초기화 시작');
            
            // 헤더 로드 대기
            await this.waitForHeader();
            
            // 로그인 상태 확인
            this.updateHeaderState();
            
            // 현재 페이지 메뉴 하이라이트
            this.highlightCurrentMenu();
            
            // 이벤트 리스너 설정
            this.setupEventListeners();
            
            // 이전 페이지 추적 (로그인 후 리디렉션용)
            this.setupPageTracking();
            
            this.initialized = true;
            console.log('✅ 통합 헤더 관리자 초기화 완료');
        }
        
        // 헤더 로드 대기
        waitForHeader() {
            return new Promise((resolve, reject) => {
                const checkHeader = () => {
                    const loginMenu = document.getElementById('loginMenu');
                    const loggedInMenu = document.getElementById('loggedInMenu');
                    
                    if (loginMenu && loggedInMenu) {
                        console.log('📍 헤더 요소 발견');
                        resolve();
                    } else if (this.retryCount < this.maxRetries) {
                        this.retryCount++;
                        console.log(`⏳ 헤더 로딩 대기 중... (${this.retryCount}/${this.maxRetries})`);
                        setTimeout(checkHeader, 200);
                    } else {
                        console.error('❌ 헤더 로딩 실패 - 최대 재시도 횟수 초과');
                        reject(new Error('헤더 로딩 실패'));
                    }
                };
                checkHeader();
            });
        }
        
        // 로그인 상태 확인 및 UI 업데이트
        updateHeaderState() {
            const loginMenu = document.getElementById('loginMenu');
            const loggedInMenu = document.getElementById('loggedInMenu');
            
            if (!loginMenu || !loggedInMenu) {
                console.warn('⚠️ 헤더 메뉴 요소를 찾을 수 없음');
                return;
            }
            
            // localStorage와 sessionStorage 모두 확인
            const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true' || 
                              sessionStorage.getItem('userLoggedIn') === 'true';
            
            console.log('🔍 로그인 상태 확인:', isLoggedIn);
            
            if (isLoggedIn) {
                this.showLoggedInState(loginMenu, loggedInMenu);
            } else {
                this.showLoggedOutState(loginMenu, loggedInMenu);
            }
        }
        
        // 로그인 상태 UI 표시
        showLoggedInState(loginMenu, loggedInMenu) {
            console.log('👤 로그인 상태 UI 표시');
            
            loginMenu.style.display = 'none';
            loginMenu.classList.add('hidden');
            loggedInMenu.style.display = 'flex';
            loggedInMenu.classList.remove('hidden');
            
            // 사용자 정보 가져오기
            const userNickname = localStorage.getItem('userNickname') || 
                               sessionStorage.getItem('userNickname') || '사용자';
            const userType = localStorage.getItem('userType') || 
                            sessionStorage.getItem('userType') || 'user';
            
            const userTypeText = userType === 'politician' ? '정치인' : '일반회원';
            this.updateUserInfo(userNickname, userTypeText, userType);
            
            console.log('✅ 로그인 상태 표시 완료:', { userNickname, userType });
        }
        
        // 로그아웃 상태 UI 표시
        showLoggedOutState(loginMenu, loggedInMenu) {
            console.log('🔓 로그아웃 상태 UI 표시');
            
            loginMenu.style.display = 'flex';
            loginMenu.classList.remove('hidden');
            loggedInMenu.style.display = 'none';
            loggedInMenu.classList.add('hidden');
            
            console.log('✅ 로그아웃 상태 표시 완료');
        }
        
        // 사용자 정보 업데이트
        updateUserInfo(nickname, userTypeText, userType) {
            // PC 버전 사용자 정보 업데이트
            const usernameDisplay = document.getElementById('usernameDisplay');
            const userTypeDisplay = document.getElementById('userTypeText');
            const userIndicator = document.getElementById('userIndicator');
            
            if (usernameDisplay) usernameDisplay.textContent = nickname;
            if (userTypeDisplay) userTypeDisplay.textContent = userTypeText;
            
            if (userIndicator) {
                userIndicator.classList.remove('politician', 'user');
                userIndicator.classList.add(userType);
            }
            
            // 모바일 드롭다운 사용자 정보 업데이트
            const dropdownUsername = document.getElementById('dropdownUsername');
            const dropdownUsertype = document.getElementById('dropdownUsertype');
            if (dropdownUsername) dropdownUsername.textContent = nickname;
            if (dropdownUsertype) dropdownUsertype.textContent = userTypeText;
            
            console.log('📝 사용자 정보 업데이트 완료:', { nickname, userTypeText, userType });
        }
        
        // 현재 페이지 메뉴 하이라이트
        highlightCurrentMenu() {
            setTimeout(() => {
                const menuItems = document.querySelectorAll('.menu a');
                const currentPageMap = {
                    'index': ['index.html', '/', ''],
                    'board': ['board.html'],
                    'voice': ['voice.html'],
                    'vote_board': ['vote_board.html'],
                    'member_info': ['member_info.html', 'mypage.html']
                };
                
                console.log(`📋 메뉴 아이템 수: ${menuItems.length}, 현재 페이지: ${this.currentPage}`);
                
                // 모든 메뉴에서 active 클래스 제거
                menuItems.forEach(item => item.classList.remove('active'));
                
                // 현재 페이지와 일치하는 메뉴 찾기
                const pagesToCheck = currentPageMap[this.currentPage] || [];
                menuItems.forEach(item => {
                    const href = item.getAttribute('href');
                    const isActive = pagesToCheck.some(page => 
                        href && (href.includes(page) || href === page)
                    );
                    
                    if (isActive) {
                        item.classList.add('active');
                        console.log('🎯 현재 페이지 메뉴 하이라이트:', href);
                    }
                });
            }, 100);
        }
        
        // 이벤트 리스너 설정
        setupEventListeners() {
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
            
            // 로그인 성공 이벤트 리스너
            window.addEventListener('userLoginSuccess', (e) => {
                console.log('📡 로그인 성공 이벤트 수신:', e.detail);
                this.updateHeaderState();
            });
            
            // 저장소 변경 감지 (다른 탭에서의 로그인/로그아웃)
            window.addEventListener('storage', (e) => {
                if (['userLoggedIn', 'userNickname', 'userType'].includes(e.key)) {
                    console.log('📦 저장소 변경 감지:', e.key);
                    this.updateHeaderState();
                }
            });
            
            console.log('🔧 이벤트 리스너 설정 완료');
        }
        
        // 페이지 추적 설정 (로그인 후 리디렉션용)
        setupPageTracking() {
            if (this.currentPage !== 'login') {
                const currentPage = window.location.href;
                sessionStorage.setItem('previousPage', currentPage);
                console.log('📍 현재 페이지 저장:', currentPage);
                
                // 로그인 링크에 redirect 파라미터 추가
                setTimeout(() => {
                    const loginLinks = document.querySelectorAll('a[href*="login.html"], .login-btn');
                    
                    loginLinks.forEach(link => {
                        link.addEventListener('click', function(e) {
                            const currentUrl = window.location.href;
                            const loginUrl = this.getAttribute('href') || 'login.html';
                            const separator = loginUrl.includes('?') ? '&' : '?';
                            const newUrl = loginUrl + separator + 'redirect=' + encodeURIComponent(currentUrl);
                            
                            console.log('🔗 로그인 링크 클릭, 리디렉션 URL 설정:', newUrl);
                            this.href = newUrl;
                        });
                    });
                }, 1000);
            }
        }
        
        // 로그아웃 처리
        handleLogout() {
            if (confirm('정말 로그아웃하시겠습니까?')) {
                console.log('🚪 로그아웃 처리 시작');
                
                // 모든 저장소에서 로그인 정보 제거
                const keysToRemove = ['userLoggedIn', 'userType', 'userEmail', 'userNickname'];
                keysToRemove.forEach(key => {
                    localStorage.removeItem(key);
                    sessionStorage.removeItem(key);
                });
                
                console.log('🗑️ 로그인 정보 삭제 완료');
                this.updateHeaderState();
                window.dispatchEvent(new CustomEvent('userLogout'));
                
                setTimeout(() => {
                    console.log('🏠 메인 페이지로 리디렉션');
                    window.location.href = 'index.html';
                }, 500);
            }
        }
        
        // 모바일 메뉴 토글
        toggleMobileMenu(type) {
            console.log('📱 모바일 메뉴 토글:', type);
            
            const dropdownId = type === 'login' ? 'loginDropdown' : 'userDropdown';
            const dropdown = document.getElementById(dropdownId);
            
            if (!dropdown) {
                console.error('❌ 드롭다운 요소를 찾을 수 없음:', dropdownId);
                return;
            }
            
            if (this.activeDropdown === dropdown) {
                this.closeAllDropdowns();
                return;
            }
            
            this.closeAllDropdowns();
            dropdown.classList.add('active');
            this.activeDropdown = dropdown;
        }
        
        // 모든 드롭다운 닫기
        closeAllDropdowns() {
            const dropdowns = document.querySelectorAll('.mobile-dropdown');
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
            this.activeDropdown = null;
        }
        
        // 로그인 성공 후 호출될 메서드 (login.html에서 사용)
        onLoginSuccess(userData) {
            console.log('🎯 로그인 성공 처리:', userData);
            
            // 저장소에 사용자 정보 저장
            const storage = userData.rememberMe ? localStorage : sessionStorage;
            storage.setItem('userLoggedIn', 'true');
            storage.setItem('userType', userData.userType);
            storage.setItem('userEmail', userData.email);
            storage.setItem('userNickname', userData.nickname);
            
            // 헤더 상태 업데이트
            this.updateHeaderState();
            
            // 리디렉션 처리
            const urlParams = new URLSearchParams(window.location.search);
            const redirectUrl = urlParams.get('redirect');
            const previousPage = sessionStorage.getItem('previousPage');
            
            let targetUrl;
            if (redirectUrl && this.isValidRedirectUrl(redirectUrl)) {
                targetUrl = decodeURIComponent(redirectUrl);
                console.log('🎯 URL 파라미터로 리디렉션:', targetUrl);
            } else if (previousPage && this.isValidRedirectUrl(previousPage)) {
                targetUrl = previousPage;
                console.log('🎯 이전 페이지로 리디렉션:', targetUrl);
            } else {
                targetUrl = 'index.html';
                console.log('🎯 기본 페이지로 리디렉션:', targetUrl);
            }
            
            sessionStorage.removeItem('previousPage');
            
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 1500);
        }
        
        // 유효한 리디렉션 URL인지 확인
        isValidRedirectUrl(url) {
            if (!url) return false;
            
            const dangerousProtocols = ['javascript:', 'data:', 'vbscript:'];
            const lowerUrl = url.toLowerCase();
            
            return !dangerousProtocols.some(protocol => lowerUrl.startsWith(protocol));
        }
    }
    
    // ==========================================
    // 3. 헤더/푸터 로드 함수
    // ==========================================
    
    window.includeHTML = function(id, file) {
        console.log('📁 파일 포함 시작:', file);
        
        fetch(file)
        .then(response => {
            if (!response.ok) {
                throw new Error(`파일 로딩 실패: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = data;
                
                if (id === 'header-include') {
                    console.log('🔧 헤더 로드 완료, 상태 관리 시스템 초기화');
                    setTimeout(() => {
                        if (window.headerManager) {
                            window.headerManager.init();
                        }
                    }, 100);
                }
                
                console.log('✅', file, '포함 완료');
            } else {
                console.error('❌ 요소를 찾을 수 없음:', id);
            }
        })
        .catch(error => {
            console.error('❌ 파일 로딩 실패:', error);
        });
    };
    
    // ==========================================
    // 4. 로그인 관련 함수들 (전역 노출)
    // ==========================================
    
    // 로그인 성공 시 호출될 전역 함수 (login.html에서 사용)
    window.handleLoginSuccess = function(userData) {
        console.log('🔗 전역 로그인 성공 핸들러 호출:', userData);
        if (window.headerManager) {
            window.headerManager.onLoginSuccess(userData);
        } else {
            console.error('❌ 헤더 관리자가 초기화되지 않음');
        }
    };
    
    // ==========================================
    // 5. 디버깅 함수들
    // ==========================================
    
    window.testLogin = function(userType = 'user', nickname = '테스트사용자') {
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userType', userType);
        localStorage.setItem('userEmail', 'test@example.com');
        localStorage.setItem('userNickname', nickname);
        
        if (window.headerManager && window.headerManager.initialized) {
            window.headerManager.updateHeaderState();
        }
        
        console.log('🧪 테스트 로그인 완료:', { userType, nickname });
    };
    
    window.testLogout = function() {
        ['userLoggedIn', 'userType', 'userEmail', 'userNickname'].forEach(key => {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
        });
        
        if (window.headerManager && window.headerManager.initialized) {
            window.headerManager.updateHeaderState();
        }
        
        console.log('🧪 테스트 로그아웃 완료');
    };
    
    // ==========================================
    // 6. 초기화 실행
    // ==========================================
    
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🎯 DOM 로드 완료, 시스템 초기화 시작');
        
        // 헤더 관리자 인스턴스 생성
        window.headerManager = new UnifiedHeaderManager();
        
        // 헤더/푸터 로드
        if (document.getElementById('header-include')) {
            window.includeHTML('header-include', 'header.html');
        }
        
        if (document.getElementById('footer-include')) {
            window.includeHTML('footer-include', 'footer.html');
        }
        
        console.log('✅ 정치방망이 통합 main.js 초기화 완료');
    });
    
    console.log('🎉 정치방망이 통합 main.js 로드 완료 - 현재 페이지:', window.CURRENT_PAGE);
    console.log('🆕 직접등록 기능이 voice.html과 통일되었습니다');
    
})();

// ==================== 모바일 게시글 줄바꿈 보정 ====================
(function() {
  function applyMobileWordBreakFix() {
    if (window.innerWidth <= 768) {
      const style = document.createElement('style');
      style.id = 'mobile-wordbreak-fix';
      style.innerHTML = `
        #boardBody td,
        #boardBody .post-title,
        #boardBody .post-content,
        #boardBody .thumbnail-text {
          word-break: break-all !important;
          white-space: normal !important;
          overflow: visible !important;
          text-overflow: initial !important;
        }
      `;
      if (!document.getElementById('mobile-wordbreak-fix')) {
        document.head.appendChild(style);
      }
    } else {
      const style = document.getElementById('mobile-wordbreak-fix');
      if (style) style.remove();
    }
  }
  window.addEventListener('resize', applyMobileWordBreakFix);
  window.addEventListener('DOMContentLoaded', applyMobileWordBreakFix);
})();