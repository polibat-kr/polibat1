import React, { useState, useEffect } from 'react';
import { openAdminPage } from '../utils/navigation';
import { FileText, Search, Filter, Download, RefreshCw, Eye, ThumbsUp, ThumbsDown, MessageCircle, Flag } from 'lucide-react';
import PostDetailPopup from '../components/popups/PostDetailPopup';

const PostsManagementPage = () => {
  // 브라우저 타이틀 설정
  useEffect(() => {
    document.title = '게시글 관리 - POLIBAT admin';
  }, []);

  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [boardFilter, setBoardFilter] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [dateType, setDateType] = useState('작성일'); // '작성일' 또는 '최종수정일'
  const [periodFilter, setPeriodFilter] = useState('전체');
  const [dateStartDate, setDateStartDate] = useState('');
  const [dateEndDate, setDateEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  
  // URL 파라미터 처리 (대시보드에서 전달받은 조건 자동 설정)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('postId');
    const memberId = params.get('memberId');
    const board = params.get('board');
    const period = params.get('period');
    const status = params.get('status');
    
    // 게시글 ID나 회원 ID로 검색
    if (postId) {
      setSearchTerm(postId);
    } else if (memberId) {
      setSearchTerm(memberId);
    }
    
    // 대시보드에서 전달받은 게시판 조건 설정
    if (board) {
      setBoardFilter(board);
    }
    
    // 대시보드에서 전달받은 상태 조건 설정
    if (status) {
      setStatusFilter(status);
    }
    
    // 대시보드에서 전달받은 기간 조건 설정
    if (period) {
      setPeriodFilter(period);
      
      // 기간에 따른 날짜 범위 자동 설정
      const today = new Date();
      let startDate = new Date();
      
      switch (period) {
        case '일간':
          // 일간은 오늘 날짜로 from~to 동일하게 설정
          startDate = new Date(today);
          break;
        case '주간':
          startDate.setDate(today.getDate() - 7);
          break;
        case '월간':
          startDate.setMonth(today.getMonth() - 1);
          break;
        case '연간':
          startDate.setFullYear(today.getFullYear() - 1);
          break;
        default:
          startDate = today; // 기본값
      }
      
      setDateStartDate(startDate.toISOString().split('T')[0]);
      setDateEndDate(today.toISOString().split('T')[0]);
    }
  }, []);

  // 샘플 게시글 데이터
  const samplePosts = [
    {
      id: 1,
      postId: 'FB000001',
      board: '자유게시판',
      title: '어떤 글 입니다',
      status: '게시',
      views: 101,
      reactions: {
        likes: 19,
        dislikes: 1
      },
      commentsCount: 6,
      author: {
        nickname: '일반회원7',
        memberId: 'NM000007'
      },
      createdAt: '25.05.30. 00:00:00',
      updatedAt: '25.05.30. 00:00:00',
      reports: 0
    },
    {
      id: 2,
      postId: 'PB000002',
      board: '정치인게시판',
      title: '나라 망했음',
      status: '숨김',
      views: 22,
      reactions: {
        likes: 1,
        dislikes: 18
      },
      commentsCount: 3,
      author: {
        nickname: '일반회원11',
        memberId: 'NM000011'
      },
      createdAt: '25.05.15. 00:00:00',
      updatedAt: '25.05.20. 00:00:00',
      reports: 5
    },
    {
      id: 3,
      postId: 'PB000001',
      board: '정치인게시판',
      title: '씨팔 이재명',
      status: '삭제',
      views: 201,
      reactions: {
        likes: 1,
        dislikes: 25
      },
      commentsCount: 4,
      author: {
        nickname: '일반회원7',
        memberId: 'NM000007'
      },
      createdAt: '25.05.10. 00:00:00',
      updatedAt: '25.05.10. 00:00:00',
      reports: 15
    },
    {
      id: 4,
      postId: 'FB000003',
      board: '자유게시판',
      title: '정치에 대한 생각',
      status: '게시',
      views: 89,
      reactions: {
        likes: 12,
        dislikes: 2
      },
      commentsCount: 8,
      author: {
        nickname: '정치인1',
        memberId: 'PM000001'
      },
      createdAt: '25.05.28. 00:00:00',
      updatedAt: '25.05.28. 00:00:00',
      reports: 0
    },
    {
      id: 5,
      postId: 'VP000001',
      board: '투표',
      title: '다음 대선 후보 선호도 조사',
      status: '게시',
      views: 456,
      reactions: {
        likes: 35,
        dislikes: 8
      },
      commentsCount: 22,
      author: {
        nickname: '관리자',
        memberId: 'AD000001'
      },
      createdAt: '25.05.25. 00:00:00',
      updatedAt: '25.05.25. 00:00:00',
      reports: 1
    },
    {
      id: 6,
      postId: 'FB000004',
      board: '자유게시판',  
      title: '토끼민주 의견 - 정치 개혁 필요성',
      status: '게시',
      views: 67,
      reactions: {
        likes: 8,
        dislikes: 3
      },
      commentsCount: 5,
      author: {
        nickname: '토끼민주',
        memberId: 'NM000008'
      },
      createdAt: '25.05.29. 00:00:00',
      updatedAt: '25.05.29. 00:00:00',
      reports: 0
    },
    {
      id: 7,
      postId: 'PB000003',
      board: '정치인게시판',
      title: '장대표님께 질문드립니다',
      status: '게시',
      views: 125,
      reactions: {
        likes: 15,
        dislikes: 2
      },
      commentsCount: 9,
      author: {
        nickname: '토끼민주',
        memberId: 'NM000008'
      },
      createdAt: '25.05.27. 00:00:00',
      updatedAt: '25.05.27. 00:00:00',
      reports: 0
    },
    {
      id: 8,
      postId: 'PB000004',
      board: '정치인게시판',
      title: '장대표 답변 - 정치 개혁에 대하여',
      status: '게시',
      views: 234,
      reactions: {
        likes: 45,
        dislikes: 1
      },
      commentsCount: 15,
      author: {
        nickname: '장대표',
        memberId: 'PM000008'
      },
      createdAt: '25.05.28. 00:00:00',
      updatedAt: '25.05.28. 00:00:00',
      reports: 0
    }
  ];

  const boardOptions = ['전체', '자유게시판', '정치인게시판', '투표'];
  const statusOptions = ['전체', '게시', '숨김', '삭제'];
  const periodOptions = ['전체', '일간', '주간', '월간', '연간', '사용자지정'];
  const dateTypeOptions = ['작성일', '최종수정일'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '게시':
        return 'bg-green-100 text-green-800';
      case '숨김':
        return 'bg-yellow-100 text-yellow-800';
      case '삭제':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBoardColor = (board: string) => {
    switch (board) {
      case '자유게시판':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case '정치인게시판':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case '투표':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handlePostClick = (post: any) => {
    // 안전한 게시글 데이터 구조로 변환
    const postData = {
      postId: post.postId || post.id,
      board: post.board || '자유게시판',
      title: post.title || '제목 없음',
      content: post.content || '내용이 없습니다.',
      status: post.status || '게시',
      author: {
        memberId: post.author?.memberId || 'UNKNOWN',
        nickname: post.author?.nickname || '알 수 없음',
        type: post.author?.type || '일반회원',
        status: post.author?.status || '승인'
      },
      stats: {
        views: post.views || 0,
        comments: post.commentsCount || 0,
        likes: post.reactions?.likes || 0,
        dislikes: post.reactions?.dislikes || 0,
        reports: post.reports || 0
      },
      dates: {
        created: post.createdAt || '2025.01.01 00:00:00',
        lastModified: post.updatedAt || '2025.01.01 00:00:00'
      }
    };
    setSelectedPost(postData);
  };

  const handleLikesClick = (postId: string, reactionType: string, count: number) => {
    if (count === 0) return;
    console.log(`좋아요/싫어요 이력 페이지로 이동 - 게시글: ${postId}, 타입: ${reactionType}`);
    openAdminPage(`/likes-history?postId=${postId}&type=${reactionType}`);
  };

  const handleCommentsClick = (postId: string, count: number) => {
    if (count === 0) return;
    console.log(`댓글 관리 페이지로 이동 - 게시글: ${postId}`);
    openAdminPage(`/comments?postId=${postId}`);
  };

  const handleReportsClick = (postId: string, count: number) => {
    if (count === 0) return;
    console.log(`신고이력 페이지로 이동 - 게시글: ${postId}`);
    openAdminPage(`/reports?postId=${postId}`);
  };

  const filteredPosts = samplePosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.postId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.nickname.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBoard = boardFilter === '전체' || post.board === boardFilter;
    const matchesStatus = statusFilter === '전체' || post.status === statusFilter;
    
    // 날짜 필터링 (dateType에 따라 작성일 또는 최종수정일 중 하나만)
    let matchesDateRange = true;
    if (dateStartDate && dateEndDate) {
      try {
        // 선택된 날짜 타입에 따라 해당 날짜 필드 사용
        const targetDate = dateType === '작성일' ? post.createdAt : post.updatedAt;
        
        // "25.05.30. 00:00:00" 형식을 Date 객체로 변환
        const dateMatch = targetDate.match(/(\d{2})\.(\d{2})\.(\d{2})\. (\d{2}):(\d{2}):(\d{2})/);
        if (dateMatch) {
          const [, year, month, day, hour, minute, second] = dateMatch;
          const postDate = new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day), 
                                   parseInt(hour), parseInt(minute), parseInt(second));
          
          const filterStartDate = new Date(dateStartDate);
          const filterEndDate = new Date(dateEndDate);
          filterEndDate.setHours(23, 59, 59, 999); // 해당 날짜 끝까지 포함
          
          if (!isNaN(postDate.getTime()) && !isNaN(filterStartDate.getTime()) && !isNaN(filterEndDate.getTime())) {
            matchesDateRange = postDate >= filterStartDate && postDate <= filterEndDate;
          }
        }
      } catch (error) {
        console.error(`${dateType} 변환 오류:`, dateType === '작성일' ? post.createdAt : post.updatedAt, error);
        matchesDateRange = true; // 오류 시 포함시킴
      }
    }
    
    return matchesSearch && matchesBoard && matchesStatus && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    console.log('게시글 데이터 내보내기');
  };

  const handleRefresh = () => {
    console.log('데이터 새로고침');
  };

  // 통계 계산
  const totalPosts = samplePosts.length;
  const activePosts = samplePosts.filter(post => post.status === '게시').length;
  const hiddenPosts = samplePosts.filter(post => post.status === '숨김').length;
  const deletedPosts = samplePosts.filter(post => post.status === '삭제').length;

  return (
    <div className="p-6">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">게시글 관리</h1>
            <p className="mt-1 text-gray-600">게시글을 조회하고 관리할 수 있습니다.</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleRefresh}
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              새로고침
            </button>
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              내보내기
            </button>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">전체</p>
              <p className="text-2xl font-bold text-gray-900">{totalPosts}개</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">게시</p>
              <p className="text-2xl font-bold text-gray-900">{activePosts}개</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Filter className="w-8 h-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">숨김</p>
              <p className="text-2xl font-bold text-gray-900">{hiddenPosts}개</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Flag className="w-8 h-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">삭제</p>
              <p className="text-2xl font-bold text-gray-900">{deletedPosts}개</p>
            </div>
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">검색</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="제목, 게시글 ID, 작성자 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">게시판</label>
            <select
              value={boardFilter}
              onChange={(e) => setBoardFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {boardOptions.map(board => (
                <option key={board} value={board}>{board}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">검색기간</label>
            <select
              value={periodFilter}
              onChange={(e) => {
                setPeriodFilter(e.target.value);
                if (e.target.value !== '전체') {
                  // 기간 선택 시 자동으로 날짜 설정
                  const today = new Date();
                  const endDateStr = today.toISOString().split('T')[0];
                  let startDateStr = '';
                  
                  switch (e.target.value) {
                    case '일간':
                      startDateStr = endDateStr;
                      break;
                    case '주간':
                      const weekAgo = new Date(today);
                      weekAgo.setDate(today.getDate() - 7);
                      startDateStr = weekAgo.toISOString().split('T')[0];
                      break;
                    case '월간':
                      const monthAgo = new Date(today);
                      monthAgo.setMonth(today.getMonth() - 1);
                      startDateStr = monthAgo.toISOString().split('T')[0];
                      break;
                    case '연간':
                      const yearAgo = new Date(today);
                      yearAgo.setFullYear(today.getFullYear() - 1);
                      startDateStr = yearAgo.toISOString().split('T')[0];
                      break;
                  }
                  
                  if (startDateStr) {
                    setDateStartDate(startDateStr);
                    setDateEndDate(endDateStr);
                  }
                } else {
                  setDateStartDate('');
                  setDateEndDate('');
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {periodOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">검색일 기준</label>
            <select
              value={dateType}
              onChange={(e) => setDateType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {dateTypeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{dateType} (시작)</label>
            <input
              type="date"
              value={dateStartDate}
              onChange={(e) => {
                setDateStartDate(e.target.value);
                if (e.target.value) {
                  setPeriodFilter('사용자지정');
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{dateType} (종료)</label>
            <input
              type="date"
              value={dateEndDate}
              onChange={(e) => {
                setDateEndDate(e.target.value);
                if (e.target.value) {
                  setPeriodFilter('사용자지정');
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div></div> {/* 빈 공간 */}
        </div>
        
        {/* 필터 상태 표시 */}
        {(boardFilter !== '전체' || statusFilter !== '전체' || periodFilter !== '전체' || dateStartDate || dateEndDate) && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-blue-700">적용된 필터:</span>
                {boardFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    게시판: {boardFilter}
                  </span>
                )}
                {statusFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    상태: {statusFilter}
                  </span>
                )}
                {periodFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    기간: {periodFilter}
                  </span>
                )}
                {(dateStartDate || dateEndDate) && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {dateType}: {dateStartDate} ~ {dateEndDate}
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setBoardFilter('전체');
                  setStatusFilter('전체');
                  setPeriodFilter('전체');
                  setDateStartDate('');
                  setDateEndDate('');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                필터 초기화
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-gray-900">게시글 목록</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                총 {filteredPosts.length}개
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">페이지당 표시:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value={10}>10개</option>
                  <option value={20}>20개</option>
                  <option value={50}>50개</option>
                  <option value={100}>100개</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">번호</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">게시글 아이디</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">게시판</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">게시글 제목</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">게시글 상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">조회수</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">받은 반응</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">댓글수</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신고 받음</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일시</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">최종수정일시</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedPosts.map((post, index) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handlePostClick(post)}
                      className="text-blue-600 hover:text-blue-800 underline font-medium"
                    >
                      {post.postId}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded border ${getBoardColor(post.board)}`}>
                      {post.board}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm font-medium text-gray-900 truncate" title={post.title}>
                        {post.title}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 text-gray-400 mr-1" />
                      {post.views.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleLikesClick(post.postId, '좋아요', post.reactions.likes)}
                        className={`flex items-center ${post.reactions.likes > 0 ? 'text-green-600 hover:text-green-800' : 'text-gray-400'}`}
                        disabled={post.reactions.likes === 0}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {post.reactions.likes}
                      </button>
                      <button
                        onClick={() => handleLikesClick(post.postId, '싫어요', post.reactions.dislikes)}
                        className={`flex items-center ${post.reactions.dislikes > 0 ? 'text-red-600 hover:text-red-800' : 'text-gray-400'}`}
                        disabled={post.reactions.dislikes === 0}
                      >
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        {post.reactions.dislikes}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleCommentsClick(post.postId, post.commentsCount)}
                      className={`flex items-center ${post.commentsCount > 0 ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400'}`}
                      disabled={post.commentsCount === 0}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {post.commentsCount}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleReportsClick(post.postId, post.reports)}
                      className={`flex items-center ${post.reports > 0 ? 'text-red-600 hover:text-red-800' : 'text-gray-400'}`}
                      disabled={post.reports === 0}
                    >
                      <Flag className="w-4 h-4 mr-1" />
                      {post.reports}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {post.author.nickname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {post.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {post.updatedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="text-sm text-gray-700">
                <span className="font-medium">{startIndex + 1}</span>
                -
                <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredPosts.length)}</span>
                의
                <span className="font-medium"> {filteredPosts.length}</span>
                개 결과
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                이전
              </button>
              
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === page
                        ? 'text-blue-600 bg-blue-50 border border-blue-300'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 게시글 상세정보 팝업 */}
      {selectedPost && (
        <PostDetailPopup
          isVisible={true}
          onClose={() => setSelectedPost(null)}
          postData={selectedPost}
        />
      )}
    </div>
  );
};

export default PostsManagementPage; 