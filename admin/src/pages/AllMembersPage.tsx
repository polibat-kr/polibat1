import React, { useState, useEffect } from 'react';
import { openAdminPage } from '../utils/navigation';
import { User, Search, Filter, Download, RefreshCw, Users, UserCheck, UserX, Clock, Crown } from 'lucide-react';
import MemberDetailPopup from '../components/popups/MemberDetailPopup';

const AllMembersPage = () => {
  // 브라우저 타이틀 설정
  useEffect(() => {
    document.title = '전체회원관리 - POLIBAT admin';
  }, []);

  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [typeFilter, setTypeFilter] = useState('전체');
  const [dateType, setDateType] = useState('가입일시'); // '가입일시' 또는 '최근접속일시'
  const [periodFilter, setPeriodFilter] = useState('전체');
  const [dateStartDate, setDateStartDate] = useState('');
  const [dateEndDate, setDateEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  
  // URL 파라미터 처리
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    const memberId = params.get('memberId');
    
    if (type) {
      // Dashboard에서 넘어온 경우 타입별 필터링
      if (type === '일반회원' || type === '정치인' || type === '보좌진') {
        setTypeFilter(type);
      }
    }
    
    if (memberId) {
      setSearchTerm(memberId);
    }
  }, []);

  // 샘플 회원 데이터
  const sampleMembers = [
    {
      id: 1,
      memberId: 'NM000008',
      nickname: '토끼민주',
      type: '일반회원',
      status: '승인',
      activities: {
        posts: 13,
        comments: 47,
        votes: 3
      },
      reactions: {
        likes: 12,
        dislikes: 10
      },
      reports: {
        given: 0,
        received: 1
      },
      joinDate: '25.05.10. 00:00:00',
      lastLogin: '25.05.30. 00:00:00'
    },
    {
      id: 2,
      memberId: 'PA000008',
      nickname: '김보좌',
      type: '보좌진',
      status: '승인대기',
      activities: {
        posts: 0,
        comments: 0,
        votes: 0
      },
      reactions: {
        likes: 0,
        dislikes: 0
      },
      reports: {
        given: 0,
        received: 0
      },
      joinDate: '25.05.02. 00:00:00',
      lastLogin: '25.05.31. 00:00:00'
    },
    {
      id: 3,
      memberId: 'PM000008',
      nickname: '장대표',
      type: '정치인',
      status: '승인',
      activities: {
        posts: 25,
        comments: 65,
        votes: 6
      },
      reactions: {
        likes: 55,
        dislikes: 1
      },
      reports: {
        given: 0,
        received: 0
      },
      joinDate: '25.04.01. 00:00:00',
      lastLogin: '25.05.30. 00:00:00'
    }
  ];

  const statusOptions = ['전체', '승인대기', '승인', '탈퇴', '정지', '강퇴'];
  const typeOptions = ['전체', '일반회원', '정치인', '보좌진'];
  const dateTypeOptions = ['가입일시', '최근접속일시'];
  const periodOptions = ['전체', '일간', '주간', '월간', '연간', '사용자지정'];

  // 통계 계산
  const totalMembers = sampleMembers.length;
  const normalMembers = sampleMembers.filter(member => member.type === '일반회원').length;
  const politicians = sampleMembers.filter(member => member.type === '정치인').length;
  const assistants = sampleMembers.filter(member => member.type === '보좌진').length;
  const pendingMembers = sampleMembers.filter(member => member.status === '승인대기').length;

  // 카드 클릭 핸들러
  const handleCardClick = (filterType: string, filterValue: string) => {
    // 검색조건 초기화
    setSearchTerm('');
    setPeriodFilter('전체');
    setDateStartDate('');
    setDateEndDate('');
    setCurrentPage(1);
    
    if (filterType === 'status') {
      setStatusFilter(filterValue);
      setTypeFilter('전체');
    } else if (filterType === 'type') {
      setTypeFilter(filterValue);
      setStatusFilter('승인'); // 정치인, 보좌진 클릭 시 승인된 회원만 표시
    } else if (filterType === 'all') {
      setStatusFilter('전체');
      setTypeFilter('전체');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '승인':
        return 'bg-green-100 text-green-800';
      case '승인대기':
        return 'bg-yellow-100 text-yellow-800';
      case '탈퇴':
        return 'bg-gray-100 text-gray-800';
      case '정지':
        return 'bg-orange-100 text-orange-800';
      case '강퇴':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
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

  const handleMemberClick = (member: any) => {
    // 안전한 회원 데이터 구조로 변환
    const memberData = {
      memberId: member.memberId || member.id,
      nickname: member.nickname,
      type: member.type || '일반회원',
      status: member.status || '승인',
      joinDate: member.joinDate || '2025.01.01',
      lastLogin: member.lastLogin || '2025.06.18',
      notificationSettings: {
        polibatNotification: true
      },
      politician: member.politician || {
        politicianName: '정치인명',
        party: '소속정당',
        politicianType: '국회의원',
        officialEmail: 'official@domain.go.kr'
      },
      activities: {
        posts: member.activities?.posts || 0,
        comments: member.activities?.comments || 0,
        votes: member.activities?.votes || 0,
        likesGiven: { 
          posts: member.reactions?.likes || 0, 
          comments: 0 
        },
        dislikesGiven: { 
          posts: member.reactions?.dislikes || 0, 
          comments: 0 
        },
        reportsGiven: { 
          posts: member.reports?.given || 0, 
          comments: 0 
        },
        reported: { 
          posts: member.reports?.received || 0, 
          comments: 0 
        }
      },
      application: {
        politicianName: '정치인명',
        party: '소속정당',
        officialEmail: 'official@domain.go.kr',
        appliedDate: '2025.01.01'
      }
    };
    setSelectedMember(memberData);
  };

  const handleActivityClick = (memberId: string, activityType: string, count: number) => {
    if (count === 0) return;
    console.log(`${activityType} 관리 페이지로 이동 - 회원: ${memberId}`);
    const targetPage = activityType === '게시글 수' ? 'posts' : 
                      activityType === '댓글 수' ? 'comments' : 
                      activityType === '투표참여' ? 'votes-history' : 'votes';
    openAdminPage(`/${targetPage}?memberId=${memberId}`);
  };

  const handleReactionClick = (memberId: string, reactionType: string, count: number) => {
    if (count === 0) return;
    console.log(`${reactionType} 관리 페이지로 이동 - 회원: ${memberId}`);
    openAdminPage(`/likes-history?memberId=${memberId}&type=${reactionType}`);
  };

  const handleReportClick = (memberId: string, reportType: string, count: number) => {
    if (count === 0) return;
    console.log(`${reportType} 관리 페이지로 이동 - 회원: ${memberId}`);
    openAdminPage(`/reports?memberId=${memberId}&type=${reportType}`);
  };

  const filteredMembers = sampleMembers.filter(member => {
    const matchesSearch = member.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.memberId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '전체' || member.status === statusFilter;
    const matchesType = typeFilter === '전체' || member.type === typeFilter;
    
    // 날짜 필터링 (dateType에 따라 가입일시 또는 최근접속일시 중 하나)
    let matchesDateRange = true;
    if (dateStartDate && dateEndDate) {
      try {
        // 선택된 날짜 타입에 따라 해당 날짜 필드 사용
        const targetDate = dateType === '가입일시' ? member.joinDate : member.lastLogin;
        
        // "25.05.10. 00:00:00" 형식을 Date 객체로 변환
        const dateMatch = targetDate.match(/(\d{2})\.(\d{2})\.(\d{2})\. (\d{2}):(\d{2}):(\d{2})/);
        if (dateMatch) {
          const [, year, month, day, hour, minute, second] = dateMatch;
          const memberDate = new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day), 
                                     parseInt(hour), parseInt(minute), parseInt(second));
          
          const filterStartDate = new Date(dateStartDate);
          const filterEndDate = new Date(dateEndDate);
          filterEndDate.setHours(23, 59, 59, 999); // 해당 날짜 끝까지 포함
          
          if (!isNaN(memberDate.getTime()) && !isNaN(filterStartDate.getTime()) && !isNaN(filterEndDate.getTime())) {
            matchesDateRange = memberDate >= filterStartDate && memberDate <= filterEndDate;
          }
        }
      } catch (error) {
        console.error(`${dateType} 변환 오류:`, dateType === '가입일시' ? member.joinDate : member.lastLogin, error);
        matchesDateRange = true; // 오류 시 포함시킴
      }
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    console.log('회원 데이터 내보내기');
    // 실제 구현시 CSV/Excel 다운로드 기능
  };

  const handleRefresh = () => {
    console.log('데이터 새로고침');
    // 실제 구현시 데이터 리로드
  };

  return (
    <div className="p-6">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">전체회원관리</h1>
            <p className="mt-1 text-gray-600">회원 정보를 조회하고 관리할 수 있습니다.</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <div
          onClick={() => handleCardClick('all', '전체')}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50"
        >
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">전체회원</p>
              <p className="text-2xl font-bold text-gray-900">{totalMembers.toLocaleString()}명</p>
            </div>
          </div>
        </div>
        <div
          onClick={() => handleCardClick('type', '일반회원')}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50"
        >
          <div className="flex items-center">
            <User className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">일반회원</p>
              <p className="text-2xl font-bold text-gray-900">{normalMembers.toLocaleString()}명</p>
            </div>
          </div>
        </div>
        <div
          onClick={() => handleCardClick('type', '정치인')}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50"
        >
          <div className="flex items-center">
            <Crown className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">정치인</p>
              <p className="text-2xl font-bold text-gray-900">{politicians.toLocaleString()}명</p>
            </div>
          </div>
        </div>
        <div
          onClick={() => handleCardClick('type', '보좌진')}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50"
        >
          <div className="flex items-center">
            <UserCheck className="w-8 h-8 text-indigo-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">보좌진</p>
              <p className="text-2xl font-bold text-gray-900">{assistants.toLocaleString()}명</p>
            </div>
          </div>
        </div>
        <div
          onClick={() => handleCardClick('status', '승인대기')}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50"
        >
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">승인대기</p>
              <p className="text-2xl font-bold text-gray-900">{pendingMembers.toLocaleString()}명</p>
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="회원 아이디 또는 닉네임으로 검색..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">회원상태</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">회원유형</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {typeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
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
        {(statusFilter !== '전체' || typeFilter !== '전체' || periodFilter !== '전체' || dateStartDate || dateEndDate || searchTerm) && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-blue-700">적용된 필터:</span>
                {statusFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    회원상태: {statusFilter}
                  </span>
                )}
                {typeFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    회원유형: {typeFilter}
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
                  setTypeFilter('전체');
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

      {/* 회원 목록 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              회원 목록 ({filteredMembers.length.toLocaleString()}명)
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">페이지당 표시:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value={10}>10개</option>
                <option value={20}>20개</option>
                <option value={50}>50개</option>
                <option value={100}>100개</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">번호</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">회원 아이디</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">닉네임</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">회원유형</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">회원상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">활동</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">누른 반응</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신고</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가입일시</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">최근접속일시</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedMembers.map((member, index) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleMemberClick(member)}
                      className="text-blue-600 hover:text-blue-800 italic underline font-medium"
                    >
                      {member.memberId}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.nickname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(member.type)}`}>
                      {member.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {member.status === '승인대기' ? (
                      <button
                        onClick={() => handleMemberClick(member)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 ${getStatusColor(member.status)}`}
                      >
                        {member.status}
                      </button>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="space-y-1">
                      <div className="flex space-x-2">
                        <span className="text-gray-600">게시글:</span>
                        <button
                          onClick={() => handleActivityClick(member.memberId, '게시글 수', member.activities.posts)}
                          className={`${member.activities.posts > 0 ? 'text-blue-600 hover:text-blue-800 italic underline' : 'text-gray-500'}`}
                          disabled={member.activities.posts === 0}
                        >
                          {member.activities.posts}
                        </button>
                      </div>
                      <div className="flex space-x-2">
                        <span className="text-gray-600">댓글:</span>
                        <button
                          onClick={() => handleActivityClick(member.memberId, '댓글 수', member.activities.comments)}
                          className={`${member.activities.comments > 0 ? 'text-blue-600 hover:text-blue-800 italic underline' : 'text-gray-500'}`}
                          disabled={member.activities.comments === 0}
                        >
                          {member.activities.comments}
                        </button>
                      </div>
                      <div className="flex space-x-2">
                        <span className="text-gray-600">투표참여:</span>
                        <button
                          onClick={() => handleActivityClick(member.memberId, '투표참여', member.activities.votes)}
                          className={`${member.activities.votes > 0 ? 'text-blue-600 hover:text-blue-800 italic underline' : 'text-gray-500'}`}
                          disabled={member.activities.votes === 0}
                        >
                          {member.activities.votes}
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="space-y-1">
                      <div className="flex space-x-2">
                        <span className="text-gray-600">좋아요:</span>
                        <button
                          onClick={() => handleReactionClick(member.memberId, '좋아요', member.reactions.likes)}
                          className={`${member.reactions.likes > 0 ? 'text-blue-600 hover:text-blue-800 italic underline' : 'text-gray-500'}`}
                          disabled={member.reactions.likes === 0}
                        >
                          {member.reactions.likes}
                        </button>
                      </div>
                      <div className="flex space-x-2">
                        <span className="text-gray-600">싫어요:</span>
                        <button
                          onClick={() => handleReactionClick(member.memberId, '싫어요', member.reactions.dislikes)}
                          className={`${member.reactions.dislikes > 0 ? 'text-blue-600 hover:text-blue-800 italic underline' : 'text-gray-500'}`}
                          disabled={member.reactions.dislikes === 0}
                        >
                          {member.reactions.dislikes}
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="space-y-1">
                      <div className="flex space-x-2">
                        <span className="text-gray-600">신고함:</span>
                        <button
                          onClick={() => handleReportClick(member.memberId, '신고함', member.reports.given)}
                          className={`${member.reports.given > 0 ? 'text-blue-600 hover:text-blue-800 italic underline' : 'text-gray-500'}`}
                          disabled={member.reports.given === 0}
                        >
                          {member.reports.given}
                        </button>
                      </div>
                      <div className="flex space-x-2">
                        <span className="text-gray-600">신고받음:</span>
                        <button
                          onClick={() => handleReportClick(member.memberId, '신고받음', member.reports.received)}
                          className={`${member.reports.received > 0 ? 'text-blue-600 hover:text-blue-800 italic underline' : 'text-gray-500'}`}
                          disabled={member.reports.received === 0}
                        >
                          {member.reports.received}
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.lastLogin}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredMembers.length)} / {filteredMembers.length}개 표시
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  이전
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm border rounded ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  다음
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 회원 상세정보 팝업 */}
      {selectedMember && (
        <MemberDetailPopup
          isVisible={true}
          memberData={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
};

export default AllMembersPage; 