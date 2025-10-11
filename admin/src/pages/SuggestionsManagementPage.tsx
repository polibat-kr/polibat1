import React, { useState, useEffect } from 'react';
import { openAdminPage } from '../utils/navigation';
import { AlertTriangle, Search, Filter, Download, RefreshCw, Eye, ThumbsUp, ThumbsDown, MessageCircle, Lightbulb } from 'lucide-react';
import SuggestionDetailPopup from '../components/popups/SuggestionDetailPopup';

const SuggestionsManagementPage = () => {
  // 브라우저 타이틀 설정
  useEffect(() => {
    document.title = '불편/제안 접수 관리 - POLIBAT admin';
  }, []);

  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [actionStatusFilter, setActionStatusFilter] = useState('전체');
  const [dateType, setDateType] = useState('작성일'); // '작성일' 또는 '최종수정일'
  const [periodFilter, setPeriodFilter] = useState('전체');
  const [dateStartDate, setDateStartDate] = useState('');
  const [dateEndDate, setDateEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // 샘플 불편/제안 데이터
  const sampleSuggestions = [
    {
      id: 1,
      suggestionId: 'RS000001',
      type: '기능제안',
      title: '화면 확대 축소 가능하게 해줘',
      status: '게시',
      views: 101,
      reactions: {
        likes: 19,
        dislikes: 1
      },
      commentsCount: 6,
      author: {
        nickname: '일반회원1',
        memberId: 'NM000001',
        type: '일반회원',
        status: '승인'
      },
      createdAt: '25.06.02. 00:00:00',
      updatedAt: '25.06.02. 00:00:00',
      actionStatus: '접수대기',
      actionDetails: ''
    },
    {
      id: 2,
      suggestionId: 'RC000001',
      type: '불편사항',
      title: '모바일에서 버튼 안눌려',
      status: '게시',
      views: 22,
      reactions: {
        likes: 1,
        dislikes: 18
      },
      commentsCount: 3,
      author: {
        nickname: '정치인1',
        memberId: 'PM000001',
        type: '정치인',
        status: '승인'
      },
      createdAt: '25.05.21. 00:00:00',
      updatedAt: '25.05.21. 00:00:00',
      actionStatus: '검토중',
      actionDetails: '모바일 환경에서의 UI 개선 작업을 진행하고 있습니다.'
    },
    {
      id: 3,
      suggestionId: 'RS000002',
      type: '기능제안',
      title: '투표 결과를 그래프로 보여주세요',
      status: '게시',
      views: 67,
      reactions: {
        likes: 25,
        dislikes: 2
      },
      commentsCount: 12,
      author: {
        nickname: '데이터분석가',
        memberId: 'NM000055',
        type: '일반회원',
        status: '승인'
      },
      createdAt: '25.05.18. 00:00:00',
      updatedAt: '25.05.18. 00:00:00',
      actionStatus: '처리완료',
      actionDetails: '투표 결과 페이지에 차트 기능을 추가했습니다.'
    },
    {
      id: 4,
      suggestionId: 'RC000002',
      type: '불편사항',
      title: '로그인이 자주 풀려요',
      status: '게시',
      views: 89,
      reactions: {
        likes: 45,
        dislikes: 3
      },
      commentsCount: 23,
      author: {
        nickname: '자주오는회원',
        memberId: 'NM000077',
        type: '일반회원',
        status: '승인'
      },
      createdAt: '25.05.10. 00:00:00',
      updatedAt: '25.05.10. 00:00:00',
      actionStatus: '처리불가',
      actionDetails: '보안상 이유로 현재 로그인 유지 시간을 변경할 수 없습니다.'
    },
    {
      id: 5,
      suggestionId: 'RS000003',
      type: '기능제안',
      title: '다크모드 지원 부탁드립니다',
      status: '숨김',
      views: 156,
      reactions: {
        likes: 78,
        dislikes: 5
      },
      commentsCount: 34,
      author: {
        nickname: '밤올빼미',
        memberId: 'NM000099',
        type: '일반회원',
        status: '승인'
      },
      createdAt: '25.04.25. 00:00:00',
      updatedAt: '25.04.25. 00:00:00',
      actionStatus: '추후검토',
      actionDetails: '다음 메이저 업데이트 시 검토 예정입니다.'
    }
  ];

  const typeOptions = ['전체', '기능제안', '불편사항'];
  const statusOptions = ['전체', '게시', '숨김', '삭제'];
  const actionStatusOptions = ['전체', '접수대기', '검토중', '처리완료', '처리불가', '추후검토'];
  const dateTypeOptions = ['작성일', '최종수정일'];
  const periodOptions = ['전체', '일간', '주간', '월간', '연간', '사용자지정'];

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case '기능제안':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case '불편사항':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getActionStatusColor = (status: string) => {
    switch (status) {
      case '접수대기':
        return 'bg-gray-100 text-gray-800';
      case '검토중':
        return 'bg-blue-100 text-blue-800';
      case '처리완료':
        return 'bg-green-100 text-green-800';
      case '처리불가':
        return 'bg-red-100 text-red-800';
      case '추후검토':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    // 안전한 불편/제안 데이터 구조로 변환
    const suggestionData = {
      suggestionId: suggestion.suggestionId || suggestion.id,
      type: suggestion.type || '기능제안',
      title: suggestion.title || '제목 없음',
      content: suggestion.content || '내용이 없습니다.',
      status: suggestion.status || '게시',
      processingStatus: suggestion.actionStatus || '접수대기',
      processingDetails: suggestion.actionDetails || '',
      author: {
        memberId: suggestion.author?.memberId || 'UNKNOWN',
        nickname: suggestion.author?.nickname || '알 수 없음',
        type: suggestion.author?.type || '일반회원'
      },
      stats: {
        views: suggestion.views || 0,
        comments: suggestion.commentsCount || 0,
        likes: suggestion.reactions?.likes || 0,
        dislikes: suggestion.reactions?.dislikes || 0,
        reports: suggestion.reports || 0
      },
      dates: {
        created: suggestion.createdAt || '2025.01.01 00:00:00',
        lastModified: suggestion.updatedAt || '2025.01.01 00:00:00'
      }
    };
    setSelectedSuggestion(suggestionData);
  };

  const handleLikesClick = (suggestionId: string, reactionType: string, count: number) => {
    if (count === 0) return;
    console.log(`좋아요/싫어요 이력 페이지로 이동 - 불편/제안: ${suggestionId}, 타입: ${reactionType}`);
    openAdminPage(`/likes-history?suggestionId=${suggestionId}&type=${reactionType}`);
  };

  const handleCommentsClick = (suggestionId: string, count: number) => {
    if (count === 0) return;
    console.log(`댓글 관리 페이지로 이동 - 불편/제안: ${suggestionId}`);
    openAdminPage(`/comments?suggestionId=${suggestionId}`);
  };

  const filteredSuggestions = sampleSuggestions.filter(suggestion => {
    const matchesSearch = suggestion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         suggestion.suggestionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         suggestion.author.nickname.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === '전체' || suggestion.type === typeFilter;
    const matchesStatus = statusFilter === '전체' || suggestion.status === statusFilter;
    const matchesActionStatus = actionStatusFilter === '전체' || suggestion.actionStatus === actionStatusFilter;
    
    // 날짜 필터링 (dateType에 따라 작성일 또는 최종수정일 중 하나만)
    let matchesDateRange = true;
    if (dateStartDate && dateEndDate) {
      try {
        // 선택된 날짜 타입에 따라 해당 날짜 필드 사용
        const targetDate = dateType === '작성일' ? suggestion.createdAt : suggestion.updatedAt;
        
        // "25.05.30. 00:00:00" 형식을 Date 객체로 변환
        const dateMatch = targetDate.match(/(\d{2})\.(\d{2})\.(\d{2})\. (\d{2}):(\d{2}):(\d{2})/);
        if (dateMatch) {
          const [, year, month, day, hour, minute, second] = dateMatch;
          const suggestionDate = new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day), 
                                         parseInt(hour), parseInt(minute), parseInt(second));
          
          const filterStartDate = new Date(dateStartDate);
          const filterEndDate = new Date(dateEndDate);
          filterEndDate.setHours(23, 59, 59, 999); // 해당 날짜 끝까지 포함
          
          if (!isNaN(suggestionDate.getTime()) && !isNaN(filterStartDate.getTime()) && !isNaN(filterEndDate.getTime())) {
            matchesDateRange = suggestionDate >= filterStartDate && suggestionDate <= filterEndDate;
          }
        }
      } catch (error) {
        console.error(`${dateType} 변환 오류:`, dateType === '작성일' ? suggestion.createdAt : suggestion.updatedAt, error);
        matchesDateRange = true; // 오류 시 포함시킴
      }
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesActionStatus && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredSuggestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSuggestions = filteredSuggestions.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    console.log('불편/제안 데이터 내보내기');
  };

  const handleRefresh = () => {
    console.log('데이터 새로고침');
  };

  // 통계 계산
  const totalSuggestions = sampleSuggestions.length;
  const featureSuggestions = sampleSuggestions.filter(s => s.type === '기능제안').length;
  const complaints = sampleSuggestions.filter(s => s.type === '불편사항').length;
  const pendingSuggestions = sampleSuggestions.filter(s => s.actionStatus === '접수대기').length;

  return (
    <div className="p-6">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">불편/제안 접수 관리</h1>
            <p className="mt-1 text-gray-600">사용자들의 불편사항과 제안을 조회하고 관리할 수 있습니다.</p>
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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50"
             onClick={() => setTypeFilter('전체')}>
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">전체 불편/제안</p>
              <p className="text-2xl font-bold text-gray-900">{totalSuggestions}개</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50"
             onClick={() => setTypeFilter('기능제안')}>
          <div className="flex items-center">
            <Lightbulb className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">기능제안</p>
              <p className="text-2xl font-bold text-gray-900">{featureSuggestions}개</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50"
             onClick={() => setTypeFilter('불편사항')}>
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">불편사항</p>
              <p className="text-2xl font-bold text-gray-900">{complaints}개</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50"
             onClick={() => setActionStatusFilter('접수대기')}>
          <div className="flex items-center">
            <Filter className="w-8 h-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">접수대기</p>
              <p className="text-2xl font-bold text-gray-900">{pendingSuggestions}개</p>
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
                placeholder="제목, 불편/제안 ID, 작성자 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">유형</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {typeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">조치상태</label>
            <select
              value={actionStatusFilter}
              onChange={(e) => setActionStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {actionStatusOptions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        </div>
        
        {/* 필터 상태 표시 */}
        {(typeFilter !== '전체' || statusFilter !== '전체' || actionStatusFilter !== '전체' || periodFilter !== '전체' || dateStartDate || dateEndDate || searchTerm) && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-blue-700">적용된 필터:</span>
                {typeFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    유형: {typeFilter}
                  </span>
                )}
                {statusFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    상태: {statusFilter}
                  </span>
                )}
                {actionStatusFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    조치상태: {actionStatusFilter}
                  </span>
                )}
                {periodFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
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
                  setTypeFilter('전체');
                  setStatusFilter('전체');
                  setActionStatusFilter('전체');
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
              <h3 className="text-lg font-semibold text-gray-900">불편/제안 목록</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                총 {filteredSuggestions.length}건
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">불편/제안 아이디</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">불편/제안 구분</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">불편/제안 상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">조치여부</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">조회수</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">받은 반응</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">댓글수</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등록일시</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedSuggestions.map((suggestion, index) => (
                <tr key={suggestion.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-blue-600 hover:text-blue-800 underline font-medium"
                    >
                      {suggestion.suggestionId}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded border ${getTypeColor(suggestion.type)}`}>
                      {suggestion.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm font-medium text-gray-900 truncate" title={suggestion.title}>
                        {suggestion.title}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(suggestion.status)}`}>
                      {suggestion.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionStatusColor(suggestion.actionStatus)}`}>
                      {suggestion.actionStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 text-gray-400 mr-1" />
                      {suggestion.views}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleLikesClick(suggestion.suggestionId, '좋아요', suggestion.reactions.likes)}
                        className={`flex items-center ${suggestion.reactions.likes > 0 ? 'text-green-600 hover:text-green-800' : 'text-gray-400'}`}
                        disabled={suggestion.reactions.likes === 0}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {suggestion.reactions.likes}
                      </button>
                      <button
                        onClick={() => handleLikesClick(suggestion.suggestionId, '싫어요', suggestion.reactions.dislikes)}
                        className={`flex items-center ${suggestion.reactions.dislikes > 0 ? 'text-red-600 hover:text-red-800' : 'text-gray-400'}`}
                        disabled={suggestion.reactions.dislikes === 0}
                      >
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        {suggestion.reactions.dislikes}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleCommentsClick(suggestion.suggestionId, suggestion.commentsCount)}
                      className={`flex items-center ${suggestion.commentsCount > 0 ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400'}`}
                      disabled={suggestion.commentsCount === 0}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {suggestion.commentsCount}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        {suggestion.author.nickname}
                      </div>
                      <div className="text-xs text-gray-500">
                        {suggestion.author.type}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {suggestion.createdAt}
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
                <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredSuggestions.length)}</span>
                의
                <span className="font-medium"> {filteredSuggestions.length}</span>
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

      {/* 불편/제안 상세정보 팝업 */}
      {selectedSuggestion && (
        <SuggestionDetailPopup
          isVisible={true}
          onClose={() => setSelectedSuggestion(null)}
          suggestionData={selectedSuggestion}
        />
      )}
    </div>
  );
};

export default SuggestionsManagementPage; 