import React, { useState, useEffect } from 'react';
import { openAdminPage } from '../utils/navigation';
import { User, Search, Download, RefreshCw, Users, Crown, UserCheck } from 'lucide-react';
import MemberDetailPopup from '../components/popups/MemberDetailPopup';

const PoliticiansPage = () => {
  // 브라우저 타이틀 설정
  useEffect(() => {
    document.title = '정치인관리 - POLIBAT admin';
  }, []);

  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [typeFilter, setTypeFilter] = useState('전체');
  const [partyFilter, setPartyFilter] = useState('전체');
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
      // '정치인' 또는 '보좌진' 필터 설정
      if (type === '정치인' || type === '보좌진') {
        setTypeFilter(type);
      }
    }
    
    if (memberId) {
      setSearchTerm(memberId);
    }
  }, []);

  // 샘플 정치인 데이터
  const samplePoliticians = [
    {
      id: 1,
      memberId: 'PA000008',
      nickname: '김보좌',
      type: '보좌진',
      status: '승인대기',
      politicianType: '국회의원',
      party: '국민의힘',
      assistingPolitician: '장대표',
      polibatAlarm: 'ON',
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
      id: 2,
      memberId: 'PM000008',
      nickname: '장대표',
      type: '정치인',
      status: '승인',
      politicianType: '국회의원',
      party: '국민의힘',
      assistingPolitician: '-',
      polibatAlarm: 'OFF',
      activities: {
        posts: 25,
        comments: 65,
        votes: 6
      },
      reactions: {
        likes: 55,
        dislikes: 0
      },
      reports: {
        given: 0,
        received: 0
      },
      joinDate: '25.04.01. 00:00:00',
      lastLogin: '25.05.30. 00:00:00'
    },
    {
      id: 3,
      memberId: 'PM000012',
      nickname: '이대표',
      type: '정치인',
      status: '승인',
      politicianType: '국회의원',
      party: '더불어민주당',
      assistingPolitician: '-',
      polibatAlarm: 'ON',
      activities: {
        posts: 45,
        comments: 132,
        votes: 12
      },
      reactions: {
        likes: 89,
        dislikes: 3
      },
      reports: {
        given: 1,
        received: 2
      },
      joinDate: '25.03.15. 00:00:00',
      lastLogin: '25.05.31. 00:00:00'
    },
    {
      id: 4,
      memberId: 'PA000015',
      nickname: '박비서',
      type: '보좌진',
      status: '승인',
      politicianType: '국회의원',
      party: '더불어민주당',
      assistingPolitician: '이대표',
      polibatAlarm: 'ON',
      activities: {
        posts: 8,
        comments: 23,
        votes: 4
      },
      reactions: {
        likes: 15,
        dislikes: 1
      },
      reports: {
        given: 0,
        received: 0
      },
      joinDate: '25.04.20. 00:00:00',
      lastLogin: '25.05.30. 00:00:00'
    }
  ];

  // 통계 계산
  const totalPoliticians = samplePoliticians.length;
  const approvedPoliticians = samplePoliticians.filter(p => p.status === '승인').length;
  const pendingPoliticians = samplePoliticians.filter(p => p.status === '승인대기').length;
  const politicianMembers = samplePoliticians.filter(p => p.type === '정치인').length;
  const assistantMembers = samplePoliticians.filter(p => p.type === '보좌진').length;

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
      setPartyFilter('전체');
    } else if (filterType === 'type') {
      setTypeFilter(filterValue);
      setStatusFilter('승인'); // 정치인, 보좌진 클릭 시 승인된 회원만 표시
      setPartyFilter('전체');
    } else if (filterType === 'all') {
      setStatusFilter('전체');
      setTypeFilter('전체');
      setPartyFilter('전체');
    }
  };

  const statusOptions = ['전체', '승인', '승인대기', '탈퇴', '정지', '강퇴'];
  const typeOptions = ['전체', '정치인', '보좌진'];
  const partyOptions = ['전체', '국민의힘', '더불어민주당', '정의당', '기타'];
  const dateTypeOptions = ['가입일시', '최근접속일시'];
  const periodOptions = ['전체', '일간', '주간', '월간', '연간', '사용자지정'];

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
      case '정치인':
        return 'bg-purple-100 text-purple-800';
      case '보좌진':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPartyColor = (party: string) => {
    switch (party) {
      case '국민의힘':
        return 'bg-red-50 text-red-700 border-red-200';
      case '더불어민주당':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case '정의당':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleMemberClick = (member: any) => {
    // 안전한 회원 데이터 구조로 변환
    const memberData = {
      memberId: member.memberId || member.id,
      nickname: member.nickname,
      type: member.type || '정치인',
      status: member.status || '승인',
      joinDate: member.joinDate || '2025.01.01',
      lastLogin: member.lastLogin || '2025.06.18',
      notificationSettings: {
        polibatNotification: member.polibatAlarm === 'ON'
      },
      politician: {
        politicianName: member.assistingPolitician || '정치인명',
        party: member.party || '소속정당',
        politicianType: member.politicianType || '국회의원',
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
        politicianName: member.assistingPolitician || '정치인명',
        party: member.party || '소속정당',
        officialEmail: 'official@domain.go.kr',
        appliedDate: member.joinDate || '2025.01.01'
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

  const filteredPoliticians = samplePoliticians.filter(member => {
    const matchesSearch = member.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.memberId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '전체' || member.status === statusFilter;
    const matchesType = typeFilter === '전체' || member.type === typeFilter;
    const matchesParty = partyFilter === '전체' || member.party === partyFilter;
    
    // 날짜 필터링 (dateType에 따라 가입일시 또는 최근접속일시 중 하나)
    let matchesDateRange = true;
    if (dateStartDate && dateEndDate) {
      try {
        // 선택된 날짜 타입에 따라 해당 날짜 필드 사용
        const targetDate = dateType === '가입일시' ? member.joinDate : member.lastLogin;
        
        // "25.05.02. 00:00:00" 형식을 Date 객체로 변환
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
    
    return matchesSearch && matchesStatus && matchesType && matchesParty && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredPoliticians.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPoliticians = filteredPoliticians.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    console.log('정치인 데이터 내보내기');
  };

  const handleRefresh = () => {
    console.log('데이터 새로고침');
  };

  return (
    <div className="p-6">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">정치인 관리</h1>
            <p className="mt-1 text-gray-600">정치인 및 보좌진 정보를 조회하고 관리할 수 있습니다.</p>
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
             onClick={() => handleCardClick('all', '전체')}>
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">정치인+보좌진</p>
              <p className="text-2xl font-bold text-gray-900">{totalPoliticians}명</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50"
             onClick={() => handleCardClick('type', '정치인')}>
          <div className="flex items-center">
            <Crown className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">정치인</p>
              <p className="text-2xl font-bold text-gray-900">{politicianMembers}명</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50"
             onClick={() => handleCardClick('type', '보좌진')}>
          <div className="flex items-center">
            <UserCheck className="w-8 h-8 text-indigo-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">보좌진</p>
              <p className="text-2xl font-bold text-gray-900">{assistantMembers}명</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50"
             onClick={() => handleCardClick('status', '승인대기')}>
          <div className="flex items-center">
            <User className="w-8 h-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">승인대기</p>
              <p className="text-2xl font-bold text-gray-900">{pendingPoliticians}명</p>
            </div>
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">검색</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="이름, 회원ID 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
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
              {typeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">정당 및 소속</label>
            <select
              value={partyFilter}
              onChange={(e) => setPartyFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {partyOptions.map(party => (
                <option key={party} value={party}>{party}</option>
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
        {(statusFilter !== '전체' || typeFilter !== '전체' || partyFilter !== '전체' || periodFilter !== '전체' || dateStartDate || dateEndDate || searchTerm) && (
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
                {partyFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    정당: {partyFilter}
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
                  setStatusFilter('전체');
                  setTypeFilter('전체');
                  setPartyFilter('전체');
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
              <h3 className="text-lg font-semibold text-gray-900">정치인 목록</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                총 {filteredPoliticians.length}명
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">회원 아이디</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">닉네임</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">회원유형</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">회원상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">정치인유형</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">정당 및 소속</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">보좌하는 정치인</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">정치방망이 알림</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">활동</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">받은 반응</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신고</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가입일시</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">최근접속일시</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedPoliticians.map((member, index) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleMemberClick(member)}
                      className="text-blue-600 hover:text-blue-800 underline font-medium"
                    >
                      {member.memberId}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.nickname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(member.type)}`}>
                      {member.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {member.status === '승인대기' ? (
                      <button
                        onClick={() => handleMemberClick(member)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)} hover:opacity-80 cursor-pointer`}
                      >
                        {member.status}
                      </button>
                    ) : (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.politicianType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded border ${getPartyColor(member.party)}`}>
                      {member.party}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.assistingPolitician}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${member.polibatAlarm === 'ON' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {member.polibatAlarm}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-600">투표참여:</span>
                        <button
                          onClick={() => handleActivityClick(member.memberId, '투표참여', member.activities.votes)}
                          className={`font-medium ${member.activities.votes > 0 ? 'text-blue-600 hover:text-blue-800 underline' : 'text-gray-400'}`}
                          disabled={member.activities.votes === 0}
                        >
                          {member.activities.votes}
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-600">좋아요:</span>
                        <span className="font-medium text-gray-900">{member.reactions.likes}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-600">싫어요:</span>
                        <span className="font-medium text-gray-900">{member.reactions.dislikes}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-600">신고함:</span>
                        <span className="font-medium text-gray-900">{member.reports.given}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-600">신고받음:</span>
                        <span className="font-medium text-gray-900">{member.reports.received}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.lastLogin}
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
                <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredPoliticians.length)}</span>
                의
                <span className="font-medium"> {filteredPoliticians.length}</span>
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

      {/* 회원 상세정보 팝업 */}
      {selectedMember && (
        <MemberDetailPopup
          isVisible={true}
          onClose={() => setSelectedMember(null)}
          memberData={selectedMember}
        />
      )}
    </div>
  );
};

export default PoliticiansPage; 