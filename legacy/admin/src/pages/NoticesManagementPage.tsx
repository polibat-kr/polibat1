import React, { useState, useEffect } from 'react';
import { openAdminPage } from '../utils/navigation';
import { Bell, Search, Filter, Download, RefreshCw, Plus, Eye, ThumbsUp, ThumbsDown, MessageCircle, Pin } from 'lucide-react';

const NoticesManagementPage = () => {
  // 브라우저 타이틀 설정
  useEffect(() => {
    document.title = '공지사항 관리 - POLIBAT admin';
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [dateType, setDateType] = useState('작성일'); // '작성일' 또는 '최종수정일'
  const [periodFilter, setPeriodFilter] = useState('전체');
  const [dateStartDate, setDateStartDate] = useState('');
  const [dateEndDate, setDateEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any>(null);

  // 공지사항 등록 폼 상태
  const [noticeForm, setNoticeForm] = useState({
    category: '이용안내',
    title: '',
    status: '게시',
    content: ''
  });

  // 샘플 공지사항 데이터
  const sampleNotices = [
    {
      id: 1,
      noticeId: 'NT000003',
      category: '이용안내',
      title: '오픈 이벤트!',
      status: '게시(고정)',
      views: 123,
      reactions: {
        likes: 19,
        dislikes: 1
      },
      commentsCount: 6,
      author: {
        type: '운영자',
        status: '승인'
      },
      createdAt: '25.06.01. 00:00:00',
      updatedAt: '25.06.01. 00:00:00',
      content: '정치방망이 오픈을 기념하여 다양한 이벤트를 진행합니다!'
    },
    {
      id: 2,
      noticeId: 'NT000002',
      category: '이용안내',
      title: '오픈',
      status: '게시',
      views: 22,
      reactions: {
        likes: 1,
        dislikes: 18
      },
      commentsCount: 3,
      author: {
        type: '운영자',
        status: '승인'
      },
      createdAt: '25.06.01. 00:00:00',
      updatedAt: '25.06.01. 00:00:00',
      content: '정치방망이가 정식 오픈되었습니다.'
    },
    {
      id: 3,
      noticeId: 'NT000001',
      category: '이용안내',
      title: '시스템점검 안내',
      status: '삭제',
      views: 22,
      reactions: {
        likes: 1,
        dislikes: 18
      },
      commentsCount: 3,
      author: {
        type: '운영자',
        status: '승인'
      },
      createdAt: '25.06.01. 00:00:00',
      updatedAt: '25.06.01. 00:00:00',
      content: '시스템 점검으로 인한 서비스 일시 중단 안내입니다.'
    },
    {
      id: 4,
      noticeId: 'NT000004',
      category: '업데이트',
      title: '새로운 기능 업데이트',
      status: '게시',
      views: 89,
      reactions: {
        likes: 25,
        dislikes: 3
      },
      commentsCount: 12,
      author: {
        type: '운영자',
        status: '승인'
      },
      createdAt: '25.05.28. 00:00:00',
      updatedAt: '25.05.28. 00:00:00',
      content: '투표 기능과 댓글 기능이 새롭게 추가되었습니다.'
    },
    {
      id: 5,
      noticeId: 'NT000005',
      category: '소통소식',
      title: '커뮤니티 가이드라인',
      status: '게시',
      views: 156,
      reactions: {
        likes: 45,
        dislikes: 2
      },
      commentsCount: 23,
      author: {
        type: '운영자',
        status: '승인'
      },
      createdAt: '25.05.25. 00:00:00',
      updatedAt: '25.05.25. 00:00:00',
      content: '건전한 커뮤니티 문화를 위한 가이드라인을 안내드립니다.'
    }
  ];

  const categoryOptions = ['전체', '이용안내', '업데이트', '소통소식', '외부활동'];
  const statusOptions = ['전체', '게시', '게시(고정)', '숨김', '삭제'];
  const dateTypeOptions = ['작성일', '최종수정일'];
  const periodOptions = ['전체', '일간', '주간', '월간', '연간', '사용자지정'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '게시':
        return 'bg-green-100 text-green-800';
      case '게시(고정)':
        return 'bg-blue-100 text-blue-800';
      case '숨김':
        return 'bg-yellow-100 text-yellow-800';
      case '삭제':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '이용안내':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case '업데이트':
        return 'bg-green-50 text-green-700 border-green-200';
      case '소통소식':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case '외부활동':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleNoticeClick = (notice: any) => {
    setEditingNotice(notice);
    setNoticeForm({
      category: notice.category,
      title: notice.title,
      status: notice.status,
      content: notice.content
    });
    setShowNoticeForm(true);
  };

  const handleLikesClick = (noticeId: string, reactionType: string, count: number) => {
    if (count === 0) return;
    console.log(`좋아요/싫어요 이력 페이지로 이동 - 공지사항: ${noticeId}, 타입: ${reactionType}`);
    openAdminPage(`/likes-history?noticeId=${noticeId}&type=${reactionType}`);
  };

  const handleCommentsClick = (noticeId: string, count: number) => {
    if (count === 0) return;
    console.log(`댓글 관리 페이지로 이동 - 공지사항: ${noticeId}`);
    openAdminPage(`/comments?noticeId=${noticeId}`);
  };

  const handleFormSubmit = () => {
    if (editingNotice) {
      console.log('공지사항 수정:', editingNotice.noticeId, noticeForm);
    } else {
      console.log('공지사항 등록:', noticeForm);
    }
    setShowNoticeForm(false);
    setEditingNotice(null);
    setNoticeForm({
      category: '이용안내',
      title: '',
      status: '게시',
      content: ''
    });
  };

  const handleFormCancel = () => {
    setShowNoticeForm(false);
    setEditingNotice(null);
    setNoticeForm({
      category: '이용안내',
      title: '',
      status: '게시',
      content: ''
    });
  };

  const filteredNotices = sampleNotices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.noticeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '전체' || notice.category === categoryFilter;
    const matchesStatus = statusFilter === '전체' || notice.status === statusFilter;
    
    // 날짜 필터링 (dateType에 따라 작성일 또는 최종수정일 중 하나만)
    let matchesDateRange = true;
    if (dateStartDate && dateEndDate) {
      try {
        // 선택된 날짜 타입에 따라 해당 날짜 필드 사용
        const targetDate = dateType === '작성일' ? notice.createdAt : notice.updatedAt;
        
        // "25.06.01. 00:00:00" 형식을 Date 객체로 변환
        const dateMatch = targetDate.match(/(\d{2})\.(\d{2})\.(\d{2})\. (\d{2}):(\d{2}):(\d{2})/);
        if (dateMatch) {
          const [, year, month, day, hour, minute, second] = dateMatch;
          const noticeDate = new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day), 
                                     parseInt(hour), parseInt(minute), parseInt(second));
          
          const filterStartDate = new Date(dateStartDate);
          const filterEndDate = new Date(dateEndDate);
          filterEndDate.setHours(23, 59, 59, 999); // 해당 날짜 끝까지 포함
          
          if (!isNaN(noticeDate.getTime()) && !isNaN(filterStartDate.getTime()) && !isNaN(filterEndDate.getTime())) {
            matchesDateRange = noticeDate >= filterStartDate && noticeDate <= filterEndDate;
          }
        }
      } catch (error) {
        console.error(`${dateType} 변환 오류:`, dateType === '작성일' ? notice.createdAt : notice.updatedAt, error);
        matchesDateRange = true; // 오류 시 포함시킴
      }
    }
    
    return matchesSearch && matchesCategory && matchesStatus && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotices = filteredNotices.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    console.log('공지사항 데이터 내보내기');
  };

  const handleRefresh = () => {
    console.log('데이터 새로고침');
  };

  // 통계 계산
  const totalNotices = sampleNotices.length;
  const activeNotices = sampleNotices.filter(n => n.status === '게시' || n.status === '게시(고정)').length;
  const pinnedNotices = sampleNotices.filter(n => n.status === '게시(고정)').length;
  const hiddenNotices = sampleNotices.filter(n => n.status === '숨김').length;

  return (
    <div className="p-6">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">공지사항 관리</h1>
            <p className="mt-1 text-gray-600">공지사항을 조회하고 관리할 수 있습니다.</p>
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
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              내보내기
            </button>
            <button
              onClick={() => setShowNoticeForm(true)}
              className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              공지사항 등록
            </button>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50"
             onClick={() => setStatusFilter('전체')}>
          <div className="flex items-center">
            <Bell className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">전체 공지사항</p>
              <p className="text-2xl font-bold text-gray-900">{totalNotices}개</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50"
             onClick={() => setStatusFilter('게시')}>
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">게시 중</p>
              <p className="text-2xl font-bold text-gray-900">{activeNotices}개</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50"
             onClick={() => setStatusFilter('게시(고정)')}>
          <div className="flex items-center">
            <Pin className="w-8 h-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">고정 공지</p>
              <p className="text-2xl font-bold text-gray-900">{pinnedNotices}개</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50"
             onClick={() => setStatusFilter('숨김')}>
          <div className="flex items-center">
            <Filter className="w-8 h-8 text-gray-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">숨김 처리</p>
              <p className="text-2xl font-bold text-gray-900">{hiddenNotices}개</p>
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
                placeholder="제목, 공지사항 ID 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categoryOptions.map(category => (
                <option key={category} value={category}>{category}</option>
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
        {(categoryFilter !== '전체' || statusFilter !== '전체' || periodFilter !== '전체' || dateStartDate || dateEndDate || searchTerm) && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-blue-700">적용된 필터:</span>
                {categoryFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    카테고리: {categoryFilter}
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
                {searchTerm && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    검색어: {searchTerm}
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setCategoryFilter('전체');
                  setStatusFilter('전체');
                  setPeriodFilter('전체');
                  setDateStartDate('');
                  setDateEndDate('');
                  setSearchTerm('');
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
              <h3 className="text-lg font-semibold text-gray-900">공지사항 목록</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                총 {filteredNotices.length}개
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">공지사항 아이디</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">공지사항 구분</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">공지 상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">조회수</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">받은 반응</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">댓글수</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">최종수정일</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedNotices.map((notice, index) => (
                <tr key={notice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleNoticeClick(notice)}
                      className="text-blue-600 hover:text-blue-800 underline font-medium"
                    >
                      {notice.noticeId}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded border ${getCategoryColor(notice.category)}`}>
                      {notice.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm font-medium text-gray-900 truncate" title={notice.title}>
                        {notice.title}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {notice.status === '게시(고정)' && (
                        <Pin className="w-4 h-4 text-blue-500 mr-1" />
                      )}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(notice.status)}`}>
                        {notice.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 text-gray-400 mr-1" />
                      {notice.views}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleLikesClick(notice.noticeId, '좋아요', notice.reactions.likes)}
                        className={`flex items-center ${notice.reactions.likes > 0 ? 'text-green-600 hover:text-green-800' : 'text-gray-400'}`}
                        disabled={notice.reactions.likes === 0}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {notice.reactions.likes}
                      </button>
                      <button
                        onClick={() => handleLikesClick(notice.noticeId, '싫어요', notice.reactions.dislikes)}
                        className={`flex items-center ${notice.reactions.dislikes > 0 ? 'text-red-600 hover:text-red-800' : 'text-gray-400'}`}
                        disabled={notice.reactions.dislikes === 0}
                      >
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        {notice.reactions.dislikes}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleCommentsClick(notice.noticeId, notice.commentsCount)}
                      className={`flex items-center ${notice.commentsCount > 0 ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400'}`}
                      disabled={notice.commentsCount === 0}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {notice.commentsCount}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {notice.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {notice.updatedAt}
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
                <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredNotices.length)}</span>
                의
                <span className="font-medium"> {filteredNotices.length}</span>
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

      {/* 공지사항 등록/수정 폼 */}
      {showNoticeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editingNotice ? '공지사항 수정' : '공지사항 등록'}
              </h2>
              <button
                onClick={handleFormCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">공지사항 구분 *</label>
                  <select
                    value={noticeForm.category}
                    onChange={(e) => setNoticeForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="이용안내">이용안내</option>
                    <option value="업데이트">업데이트</option>
                    <option value="소통소식">소통소식</option>
                    <option value="외부활동">외부활동</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">공지 상태 *</label>
                  <div className="flex space-x-4 pt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="게시"
                        checked={noticeForm.status === '게시'}
                        onChange={(e) => setNoticeForm(prev => ({ ...prev, status: e.target.value }))}
                        className="mr-2"
                      />
                      게시
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="게시(고정)"
                        checked={noticeForm.status === '게시(고정)'}
                        onChange={(e) => setNoticeForm(prev => ({ ...prev, status: e.target.value }))}
                        className="mr-2"
                      />
                      게시(고정)
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
                <input
                  type="text"
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="공지사항 제목을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">공지 내용 *</label>
                <textarea
                  rows={10}
                  value={noticeForm.content}
                  onChange={(e) => setNoticeForm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="공지사항 내용을 입력하세요"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={handleFormCancel}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  onClick={handleFormSubmit}
                  disabled={!noticeForm.title || !noticeForm.content}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingNotice ? '수정하기' : '등록하기'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticesManagementPage; 