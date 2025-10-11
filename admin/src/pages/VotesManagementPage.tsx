import React, { useState, useEffect } from 'react';
import { openAdminPage } from '../utils/navigation';
import { Vote, Search, Filter, Download, RefreshCw, Plus, Eye, MessageCircle, Users, Calendar } from 'lucide-react';
import VoteDetailPopup from '../components/popups/VoteDetailPopup';

const VotesManagementPage = () => {
  // 브라우저 타이틀 설정
  useEffect(() => {
    document.title = '투표관리 - POLIBAT admin';
  }, []);

  const [selectedVote, setSelectedVote] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [dateType, setDateType] = useState('시작일'); // '시작일' 또는 '종료일'
  const [periodFilter, setPeriodFilter] = useState('전체');
  const [dateStartDate, setDateStartDate] = useState('');
  const [dateEndDate, setDateEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showVoteForm, setShowVoteForm] = useState(false);

  // URL 파라미터 처리
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const voteId = params.get('voteId');
    
    if (voteId) {
      setSearchTerm(voteId);
    }
  }, []);

  // 샘플 투표 데이터
  const sampleVotes = [
    {
      id: 1,
      voteId: 'VP000003',
      title: '무인도에 단둘이 남는다면?',
      status: '진행',
      startDate: '25.06.01',
      endDate: '25.06.10',
      views: 222,
      participants: 124,
      commentsCount: 27,
      createdAt: '25.05.25. 00:00:00',
      description: '아래 정치인 중 함께 무인도에 남고 싶은 사람을 골라주세요.',
      options: [
        { name: '이재명', description: '무인도에서도 내가 넘버원' },
        { name: '한동훈', description: '무인도에서 깐죽거려서 산다' },
        { name: '김문수', description: '나는 고문도 견뎠다' }
      ]
    },
    {
      id: 2,
      voteId: 'VP000002',
      title: '정치자금 실명제 의무화',
      status: '마감',
      startDate: '25.05.20',
      endDate: '25.05.28',
      views: 123,
      participants: 87,
      commentsCount: 8,
      createdAt: '25.05.18. 00:00:00',
      description: '정치자금 실명제 의무화에 대한 찬반 투표입니다.',
      options: [
        { name: '찬성', description: '투명한 정치자금 운용을 위해 필요' },
        { name: '반대', description: '현행 제도로도 충분함' }
      ]
    },
    {
      id: 3,
      voteId: 'VP000001',
      title: '대통령 국정수행 평가',
      status: '마감',
      startDate: '25.05.25',
      endDate: '25.05.31',
      views: 567,
      participants: 289,
      commentsCount: 45,
      createdAt: '25.05.24. 00:00:00',
      description: '현 대통령의 국정수행에 대한 평가를 해주세요.',
      options: [
        { name: '매우 잘함', description: '탁월한 리더십 발휘' },
        { name: '잘함', description: '긍정적인 평가' },
        { name: '보통', description: '평범한 수준' },
        { name: '못함', description: '개선이 필요함' },
        { name: '매우 못함', description: '전면적인 변화 필요' }
      ]
    },
    {
      id: 4,
      voteId: 'VP000004',
      title: '정치개혁 특별법안',
      status: '마감',
      startDate: '25.05.20',
      endDate: '25.05.27',
      views: 456,
      participants: 234,
      commentsCount: 45,
      createdAt: '25.05.28. 00:00:00',
      description: '차기 대선이 언제 치러져야 한다고 생각하십니까?',
      options: [
        { name: '예정대로', description: '2027년 예정대로' },
        { name: '조기 실시', description: '2026년 조기 실시' },
        { name: '연기', description: '2028년으로 연기' }
      ]
    }
  ];

  const statusOptions = ['전체', '진행', '마감', '예정'];
  const dateTypeOptions = ['시작일', '종료일'];
  const periodOptions = ['전체', '일간', '주간', '월간', '연간', '사용자지정'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '진행':
        return 'bg-green-100 text-green-800';
      case '마감':
        return 'bg-gray-100 text-gray-800';
      case '예정':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVoteClick = (vote: any) => {
    // 안전한 투표 데이터 구조로 변환
    const voteData = {
      voteId: vote.voteId || vote.id,
      title: vote.title || '투표 제목 없음',
      description: vote.description || '투표 설명이 없습니다.',
      image: vote.image || '',
      status: vote.status || '진행',
      startDate: vote.startDate || '2025.01.01',
      endDate: vote.endDate || '2025.12.31',
      stats: {
        views: vote.views || 0,
        participants: vote.participants || 0
      },
      options: Array.isArray(vote.options) ? vote.options : []
    };
    setSelectedVote(voteData);
  };

  const handleParticipantsClick = (voteId: string, count: number) => {
    if (count === 0) return;
    console.log(`투표이력 페이지로 이동 - 투표: ${voteId}`);
    openAdminPage(`/vote-history?voteId=${voteId}`);
  };

  const handleCommentsClick = (voteId: string, count: number) => {
    if (count === 0) return;
    console.log(`댓글 관리 페이지로 이동 - 투표: ${voteId}`);
    openAdminPage(`/comments?voteId=${voteId}`);
  };

  const filteredVotes = sampleVotes.filter(vote => {
    const matchesSearch = vote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vote.voteId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '전체' || vote.status === statusFilter;
    
    // 날짜 필터링 (dateType에 따라 시작일 또는 종료일 중 하나)
    let matchesDateRange = true;
    if (dateStartDate && dateEndDate) {
      try {
        // 선택된 날짜 타입에 따라 해당 날짜 필드 사용
        const targetDate = dateType === '시작일' ? `${vote.startDate}. 00:00:00` : `${vote.endDate}. 23:59:59`;
        
        // "25.06.01. 00:00:00" 형식을 Date 객체로 변환
        const dateMatch = targetDate.match(/(\d{2})\.(\d{2})\.(\d{2})\. (\d{2}):(\d{2}):(\d{2})/);
        if (dateMatch) {
          const [, year, month, day, hour, minute, second] = dateMatch;
          const voteDate = new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day), 
                                   parseInt(hour), parseInt(minute), parseInt(second));
          
          const filterStartDate = new Date(dateStartDate);
          const filterEndDate = new Date(dateEndDate);
          filterEndDate.setHours(23, 59, 59, 999); // 해당 날짜 끝까지 포함
          
          if (!isNaN(voteDate.getTime()) && !isNaN(filterStartDate.getTime()) && !isNaN(filterEndDate.getTime())) {
            matchesDateRange = voteDate >= filterStartDate && voteDate <= filterEndDate;
          }
        }
      } catch (error) {
        console.error(`${dateType} 변환 오류:`, vote, error);
        matchesDateRange = true; // 오류 시 포함시킴
      }
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredVotes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVotes = filteredVotes.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    console.log('투표 데이터 내보내기');
  };

  const handleRefresh = () => {
    console.log('데이터 새로고침');
  };

  // 통계 계산
  const totalVotes = sampleVotes.length;
  const activeVotes = sampleVotes.filter(vote => vote.status === '진행').length;
  const endedVotes = sampleVotes.filter(vote => vote.status === '마감').length;
  const scheduledVotes = sampleVotes.filter(vote => vote.status === '예정').length;

  return (
    <div className="p-6">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">투표관리</h1>
            <p className="mt-1 text-gray-600">투표를 조회하고 관리할 수 있습니다.</p>
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
              onClick={() => setShowVoteForm(true)}
              className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              투표 등록
            </button>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Vote className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">전체 투표</p>
              <p className="text-2xl font-bold text-gray-900">{totalVotes}개</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">진행 중</p>
              <p className="text-2xl font-bold text-gray-900">{activeVotes}개</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Filter className="w-8 h-8 text-gray-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">마감</p>
              <p className="text-2xl font-bold text-gray-900">{endedVotes}개</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">예정</p>
              <p className="text-2xl font-bold text-gray-900">{scheduledVotes}개</p>
            </div>
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">검색</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="투표 제목, 투표 ID 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
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
        {(statusFilter !== '전체' || periodFilter !== '전체' || dateStartDate || dateEndDate || searchTerm) && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-blue-700">적용된 필터:</span>
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
              <h3 className="text-lg font-semibold text-gray-900">투표 목록</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                총 {filteredVotes.length}개
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">투표 아이디</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">투표 제목</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">투표 상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">시작일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">마감일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">조회수</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">참여수</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">댓글수</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedVotes.map((vote, index) => (
                <tr key={vote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleVoteClick(vote)}
                      className="text-blue-600 hover:text-blue-800 underline font-medium"
                    >
                      {vote.voteId}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm font-medium text-gray-900 truncate" title={vote.title}>
                        {vote.title}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vote.status)}`}>
                      {vote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vote.startDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vote.endDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 text-gray-400 mr-1" />
                      {vote.views.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleParticipantsClick(vote.voteId, vote.participants)}
                      className={`flex items-center ${vote.participants > 0 ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400'}`}
                      disabled={vote.participants === 0}
                    >
                      <Users className="w-4 h-4 mr-1" />
                      {vote.participants.toLocaleString()}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleCommentsClick(vote.voteId, vote.commentsCount)}
                      className={`flex items-center ${vote.commentsCount > 0 ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400'}`}
                      disabled={vote.commentsCount === 0}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {vote.commentsCount}
                    </button>
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
                <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredVotes.length)}</span>
                의
                <span className="font-medium"> {filteredVotes.length}</span>
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

      {/* 투표 상세정보 팝업 */}
      {selectedVote && (
        <VoteDetailPopup
          isVisible={true}
          onClose={() => setSelectedVote(null)}
          voteData={selectedVote}
        />
      )}

      {/* 투표 등록 폼 (간단한 모달) */}
      {showVoteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">투표 등록</h2>
              <button
                onClick={() => setShowVoteForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">투표 제목</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="투표 제목을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">투표 설명</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="투표에 대한 설명을 입력하세요"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">투표 시작일</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">투표 마감일</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowVoteForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    console.log('투표 등록');
                    setShowVoteForm(false);
                  }}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  등록하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotesManagementPage; 