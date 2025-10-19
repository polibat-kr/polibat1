import React, { useState, useEffect } from 'react';
import { openAdminPage } from '../utils/navigation';
import { Vote, Search, Filter, Download, RefreshCw, User, CheckCircle, XCircle, MinusCircle, Circle } from 'lucide-react';
import MemberDetailPopup from '../components/popups/MemberDetailPopup';

const VotesHistoryPage = () => {
  // 브라우저 타이틀 설정
  useEffect(() => {
    document.title = '투표 이력 - POLIBAT admin';
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [memberTypeFilter, setMemberTypeFilter] = useState('전체');
  const [voteStatusFilter, setVoteStatusFilter] = useState('전체');
  const [voteResultFilter, setVoteResultFilter] = useState('전체');
  const [dateType, setDateType] = useState('투표일시'); // '투표일시'만 사용 (하나의 날짜 필드만 있음)
  const [periodFilter, setPeriodFilter] = useState('전체');
  const [dateStartDate, setDateStartDate] = useState('');
  const [dateEndDate, setDateEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  
  // 회원 상세 팝업 상태
  const [selectedMemberData, setSelectedMemberData] = useState<any>(null);
  const [showMemberDetailPopup, setShowMemberDetailPopup] = useState(false);
  
  // URL 파라미터 처리
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const memberId = params.get('memberId');
    const voteId = params.get('voteId');
    
    if (memberId) {
      setSearchTerm(memberId);
    } else if (voteId) {
      setSearchTerm(voteId);
    }
  }, []);

  // 샘플 투표 이력 데이터
  const sampleVotesHistory = [
    {
      id: 1,
      voterId: 'NM000123',
      voterNickname: '시민123',
      voterType: '일반회원',
      voteId: 'VP000001',
      voteTitle: '대통령 국정수행 평가',
      voteStatus: '마감',
      voteResult: '찬성',
      voteDate: '25.05.31. 14:23:15'
    },
    {
      id: 2,
      voterId: 'PM000008',
      voterNickname: '장대표',
      voterType: '정치인',
      voteId: 'VP000001',
      voteTitle: '대통령 국정수행 평가',
      voteStatus: '마감',
      voteResult: '반대',
      voteDate: '25.05.30. 16:45:22'
    },
    {
      id: 3,
      voterId: 'PA000015',
      voterNickname: '박비서',
      voterType: '보좌진',
      voteId: 'VP000002',
      voteTitle: '지방자치단체 예산 증액 여부',
      voteStatus: '진행',
      voteResult: '찬성',
      voteDate: '25.05.29. 10:12:33'
    },
    {
      id: 4,
      voterId: 'NM000456',
      voterNickname: '정의시민',
      voterType: '일반회원',
      voteId: 'VP000003',
      voteTitle: '환경보호법 개정안 찬반',
      voteStatus: '예정',
      voteResult: '미투표',
      voteDate: '25.05.28. 09:30:45'
    },
    {
      id: 5,
      voterId: 'NM000789',
      voterNickname: '관심많은시민',
      voterType: '일반회원',
      voteId: 'VP000002',
      voteTitle: '지방자치단체 예산 증액 여부',
      voteStatus: '진행',
      voteResult: '반대',
      voteDate: '25.05.27. 20:15:12'
    },
    {
      id: 6,
      voterId: 'PM000012',
      voterNickname: '이대표',
      voterType: '정치인',
      voteId: 'VP000004',
      voteTitle: '청년 일자리 정책 개선방안',
      voteStatus: '마감',
      voteResult: '찬성',
      voteDate: '25.05.26. 15:22:18'
    },
    {
      id: 7,
      voterId: 'NM000321',
      voterNickname: '청년의꿈',
      voterType: '일반회원',
      voteId: 'VP000004',
      voteTitle: '청년 일자리 정책 개선방안',
      voteStatus: '마감',
      voteResult: '찬성',
      voteDate: '25.05.25. 11:08:44'
    },
    {
      id: 8,
      voterId: 'NM000654',
      voterNickname: '중도시민',
      voterType: '일반회원',
      voteId: 'VP000005',
      voteTitle: '교육제도 개혁안',
      voteStatus: '진행',
      voteResult: '기권',
      voteDate: '25.05.24. 13:45:30'
    },
    {
      id: 9,
      voterId: 'NM000008',
      voterNickname: '토끼민주',
      voterType: '일반회원',
      voteId: 'VP000001',
      voteTitle: '대통령 국정수행 평가',
      voteStatus: '마감',
      voteResult: '찬성',
      voteDate: '25.05.30. 15:30:00'
    },
    {
      id: 10,
      voterId: 'NM000008',
      voterNickname: '토끼민주',
      voterType: '일반회원',
      voteId: 'VP000004',
      voteTitle: '정치개혁 특별법안',
      voteStatus: '마감',
      voteResult: '찬성',
      voteDate: '25.05.26. 09:15:00'
    }
  ];

  const memberTypeOptions = ['전체', '일반회원', '정치인', '보좌진'];
  const voteStatusOptions = ['전체', '진행', '마감', '예정'];
  const voteResultOptions = ['전체', '찬성', '반대', '미투표'];
  const dateTypeOptions = ['투표일시']; // VotesHistory는 투표일시만 있음
  const periodOptions = ['전체', '일간', '주간', '월간', '연간', '사용자지정'];

  const getMemberTypeColor = (type: string) => {
    switch (type) {
      case '일반회원':
        return 'bg-blue-100 text-blue-800';
      case '정치인':
        return 'bg-purple-100 text-purple-800';
      case '보좌진':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVoteStatusColor = (status: string) => {
    switch (status) {
      case '진행':
        return 'bg-green-100 text-green-800';
      case '마감':
        return 'bg-gray-100 text-gray-800';
      case '예정':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVoteResultColor = (result: string) => {
    switch (result) {
      case '찬성':
        return 'bg-blue-100 text-blue-800';
      case '반대':
        return 'bg-red-100 text-red-800';
      case '기권':
        return 'bg-yellow-100 text-yellow-800';
      case '미투표':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVoterClick = (voterId: string, voterType: string) => {
    console.log(`회원 상세정보 팝업 - 회원ID: ${voterId}, 타입: ${voterType}`);
    // 임시 회원 데이터 생성 (실제로는 API에서 가져와야 함)
    const memberData = {
      memberId: voterId,
      memberType: voterType,
      nickname: '회원' + voterId.slice(-4),
      email: `${voterId}@example.com`,
      joinDate: '24.01.01',
      status: '승인'
    };
    setSelectedMemberData(memberData);
    setShowMemberDetailPopup(true);
  };

  const handleVoteClick = (voteId: string) => {
    console.log(`투표 관리 페이지로 이동 - 투표ID: ${voteId}`);
    openAdminPage(`/votes?voteId=${voteId}`);
  };

  const filteredVotesHistory = sampleVotesHistory.filter(vote => {
    const matchesSearch = vote.voterNickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vote.voterId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vote.voteId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vote.voteTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMemberType = memberTypeFilter === '전체' || vote.voterType === memberTypeFilter;
    const matchesVoteStatus = voteStatusFilter === '전체' || vote.voteStatus === voteStatusFilter;
    const matchesVoteResult = voteResultFilter === '전체' || vote.voteResult === voteResultFilter;
    
    // 날짜 필터링 (투표일시 기준)
    let matchesDateRange = true;
    if (dateStartDate && dateEndDate) {
      try {
        // "25.05.31. 14:23:15" 형식을 Date 객체로 변환
        const dateMatch = vote.voteDate.match(/(\d{2})\.(\d{2})\.(\d{2})\. (\d{2}):(\d{2}):(\d{2})/);
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
        console.error('투표일시 변환 오류:', vote.voteDate, error);
        matchesDateRange = true; // 오류 시 포함시킴
      }
    }
    
    return matchesSearch && matchesMemberType && matchesVoteStatus && matchesVoteResult && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredVotesHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVotesHistory = filteredVotesHistory.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    console.log('투표 이력 데이터 내보내기');
  };

  const handleRefresh = () => {
    console.log('데이터 새로고침');
  };

  // 통계 계산
  const totalVotes = sampleVotesHistory.length;
  const approvalVotes = sampleVotesHistory.filter(v => v.voteResult === '찬성').length;
  const rejectionVotes = sampleVotesHistory.filter(v => v.voteResult === '반대').length;
  const abstentionVotes = sampleVotesHistory.filter(v => v.voteResult === '기권').length;

  return (
    <div className="p-6">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">투표 이력</h1>
            <p className="mt-1 text-gray-600">회원들의 투표 참여 이력을 조회하고 관리할 수 있습니다.</p>
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
            <Vote className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 투표 참여</p>
              <p className="text-2xl font-bold text-gray-900">{totalVotes}건</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Circle className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">찬성 투표</p>
              <p className="text-2xl font-bold text-gray-900">{approvalVotes}건</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">반대 투표</p>
              <p className="text-2xl font-bold text-gray-900">{rejectionVotes}건</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <MinusCircle className="w-8 h-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">기권 투표</p>
              <p className="text-2xl font-bold text-gray-900">{abstentionVotes}건</p>
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
                placeholder="투표자, 투표 제목 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">회원유형</label>
            <select
              value={memberTypeFilter}
              onChange={(e) => setMemberTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {memberTypeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">투표 상태</label>
            <select
              value={voteStatusFilter}
              onChange={(e) => setVoteStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {voteStatusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">투표 결과</label>
            <select
              value={voteResultFilter}
              onChange={(e) => setVoteResultFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {voteResultOptions.map(result => (
                <option key={result} value={result}>{result}</option>
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
        {(memberTypeFilter !== '전체' || voteStatusFilter !== '전체' || voteResultFilter !== '전체' || periodFilter !== '전체' || dateStartDate || dateEndDate || searchTerm) && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-blue-700">적용된 필터:</span>
                {memberTypeFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    회원유형: {memberTypeFilter}
                  </span>
                )}
                {voteStatusFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    투표상태: {voteStatusFilter}
                  </span>
                )}
                {voteResultFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    투표결과: {voteResultFilter}
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
                  setMemberTypeFilter('전체');
                  setVoteStatusFilter('전체');
                  setVoteResultFilter('전체');
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
              <h3 className="text-lg font-semibold text-gray-900">투표 이력 목록</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                총 {filteredVotesHistory.length}건
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">투표한 회원</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">투표 아이디</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">투표 제목</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">투표 상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">투표 결과</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">투표 일시</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedVotesHistory.map((vote, index) => (
                <tr key={vote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-gray-700">
                        {vote.voterNickname}
                      </span>
                      <div className="flex items-center space-x-2 mt-1">
                        <button
                          onClick={() => handleVoterClick(vote.voterId, vote.voterType)}
                          className="text-blue-600 hover:text-blue-800 underline text-xs"
                        >
                          {vote.voterId}
                        </button>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMemberTypeColor(vote.voterType)}`}>
                          {vote.voterType}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleVoteClick(vote.voteId)}
                      className="text-blue-600 hover:text-blue-800 underline font-medium"
                    >
                      {vote.voteId}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                    {vote.voteTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVoteStatusColor(vote.voteStatus)}`}>
                      {vote.voteStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVoteResultColor(vote.voteResult)}`}>
                      {vote.voteResult}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vote.voteDate}
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
                <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredVotesHistory.length)}</span>
                의
                <span className="font-medium"> {filteredVotesHistory.length}</span>
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
      
      {/* 회원 상세 팝업 */}
      <MemberDetailPopup
        isVisible={showMemberDetailPopup}
        onClose={() => {
          setShowMemberDetailPopup(false);
          setSelectedMemberData(null);
        }}
        memberData={selectedMemberData}
      />
    </div>
  );
};

export default VotesHistoryPage; 