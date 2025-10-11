import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';
import MemberDetailPopup from '../components/popups/MemberDetailPopup';

const MemberStatusHistoryPage = () => {
  // 브라우저 타이틀 설정
  useEffect(() => {
    document.title = '회원상태 변경이력 - POLIBAT admin';
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [beforeStatusFilter, setBeforeStatusFilter] = useState('전체');
  const [afterStatusFilter, setAfterStatusFilter] = useState('전체');
  const [memberTypeFilter, setMemberTypeFilter] = useState('전체');
  const [processorFilter, setProcessorFilter] = useState('전체');
  const [periodFilter, setPeriodFilter] = useState('전체');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isAdminPopupOpen, setIsAdminPopupOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  
  // URL 파라미터 처리
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const memberId = params.get('memberId');
    const memberType = params.get('memberType');
    const processor = params.get('processor');
    const period = params.get('period');
    const changeDate = params.get('changeDate');
    const afterStatus = params.get('afterStatus');
    const beforeStatus = params.get('beforeStatus');
    
    if (memberId) {
      setSearchTerm(memberId);
    }
    
    if (memberType && memberType !== '전체') {
      setMemberTypeFilter(memberType);
    }
    
    if (processor && processor !== '전체') {
      setProcessorFilter(processor);
    }
    
    if (afterStatus && afterStatus !== '전체') {
      setAfterStatusFilter(afterStatus);
    }
    
    if (beforeStatus && beforeStatus !== '전체') {
      setBeforeStatusFilter(beforeStatus);
    }
    
    if (period && period !== '전체') {
      setPeriodFilter(period);
      
      // 기간에 따른 날짜 필터 자동 설정
      const today = new Date();
      const endDateStr = today.toISOString().split('T')[0];
      let startDateStr = '';
      
      switch (period) {
        case '일간':
          startDateStr = endDateStr; // 오늘만
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
        setStartDate(startDateStr);
        setEndDate(endDateStr);
      }
    }
    
    if (changeDate) {
      // 특정 날짜가 지정된 경우 (예: 오늘)
      setStartDate(changeDate);
      setEndDate(changeDate);
      setPeriodFilter('일간');
    }
  }, []);

  // 샘플 회원상태 변동이력 데이터
  const sampleStatusHistory = [
    // 오늘 데이터 (일간 테스트용)
    {
      id: 1,
      memberId: 'NM000001',
      nickname: '오늘가입자',
      memberType: '일반회원',
      changeDate: (() => {
        const today = new Date();
        const year = today.getFullYear().toString().slice(-2);
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const hour = String(today.getHours()).padStart(2, '0');
        const minute = String(today.getMinutes()).padStart(2, '0');
        const second = String(today.getSeconds()).padStart(2, '0');
        return `${year}.${month}.${day}. ${hour}:${minute}:${second}`;
      })(),
      beforeStatus: null,
      afterStatus: '승인',
      changeReason: '일반회원 신규가입',
      processor: null,
      processorId: null,
      processorNickname: null,
      notes: ''
    },
    // 어제 데이터 (일간 테스트용)
    {
      id: 2,
      memberId: 'NM000002',
      nickname: '어제가입자',
      memberType: '일반회원',
      changeDate: (() => {
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const year = yesterday.getFullYear().toString().slice(-2);
        const month = String(yesterday.getMonth() + 1).padStart(2, '0');
        const day = String(yesterday.getDate()).padStart(2, '0');
        const hour = String(yesterday.getHours()).padStart(2, '0');
        const minute = String(yesterday.getMinutes()).padStart(2, '0');
        const second = String(yesterday.getSeconds()).padStart(2, '0');
        return `${year}.${month}.${day}. ${hour}:${minute}:${second}`;
      })(),
      beforeStatus: null,
      afterStatus: '승인',
      changeReason: '일반회원 신규가입',
      processor: null,
      processorId: null,
      processorNickname: null,
      notes: ''
    },
    // 정치인 신규가입 데이터 (추가)
    {
      id: 21,
      memberId: 'PM000025',
      nickname: '신규정치인',
      memberType: '정치인',
      changeDate: (() => {
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
        const year = twoDaysAgo.getFullYear().toString().slice(-2);
        const month = String(twoDaysAgo.getMonth() + 1).padStart(2, '0');
        const day = String(twoDaysAgo.getDate()).padStart(2, '0');
        const hour = String(twoDaysAgo.getHours()).padStart(2, '0');
        const minute = String(twoDaysAgo.getMinutes()).padStart(2, '0');
        const second = String(twoDaysAgo.getSeconds()).padStart(2, '0');
        return `${year}.${month}.${day}. ${hour}:${minute}:${second}`;
      })(),
      beforeStatus: null,
      afterStatus: '승인대기',
      changeReason: '정치인, 보좌진 회원 신규가입',
      processor: null,
      processorId: null,
      processorNickname: null,
      notes: '신분증 및 공문 검토 필요'
    },
    // 보좌진 신규가입 데이터 (추가)
    {
      id: 22,
      memberId: 'PA000027',
      nickname: '신규보좌진',
      memberType: '보좌진',
      changeDate: (() => {
        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
        const year = threeDaysAgo.getFullYear().toString().slice(-2);
        const month = String(threeDaysAgo.getMonth() + 1).padStart(2, '0');
        const day = String(threeDaysAgo.getDate()).padStart(2, '0');
        const hour = String(threeDaysAgo.getHours()).padStart(2, '0');
        const minute = String(threeDaysAgo.getMinutes()).padStart(2, '0');
        const second = String(threeDaysAgo.getSeconds()).padStart(2, '0');
        return `${year}.${month}.${day}. ${hour}:${minute}:${second}`;
      })(),
      beforeStatus: null,
      afterStatus: '승인대기',
      changeReason: '정치인, 보좌진 회원 신규가입',
      processor: null,
      processorId: null,
      processorNickname: null,
      notes: '소속 정치인 확인 필요'
    },
    // 일주일 전 데이터 (주간 테스트용)
    {
      id: 3,
      memberId: 'PM000003',
      nickname: '주간정치인',
      memberType: '정치인',
      changeDate: (() => {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const year = weekAgo.getFullYear().toString().slice(-2);
        const month = String(weekAgo.getMonth() + 1).padStart(2, '0');
        const day = String(weekAgo.getDate()).padStart(2, '0');
        const hour = String(weekAgo.getHours()).padStart(2, '0');
        const minute = String(weekAgo.getMinutes()).padStart(2, '0');
        const second = String(weekAgo.getSeconds()).padStart(2, '0');
        return `${year}.${month}.${day}. ${hour}:${minute}:${second}`;
      })(),
      beforeStatus: '승인대기',
      afterStatus: '승인',
      changeReason: '신분 확인 완료 후 승인',
      processor: '관리자',
      processorId: 'ADMIN001',
      processorNickname: '관리자1',
      notes: '신분증 및 공문 확인 완료'
    },
    // 한 달 전 데이터 (월간 테스트용)
    {
      id: 4,
      memberId: 'PA000004',
      nickname: '월간보좌진',
      memberType: '보좌진',
      changeDate: (() => {
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const year = monthAgo.getFullYear().toString().slice(-2);
        const month = String(monthAgo.getMonth() + 1).padStart(2, '0');
        const day = String(monthAgo.getDate()).padStart(2, '0');
        const hour = String(monthAgo.getHours()).padStart(2, '0');
        const minute = String(monthAgo.getMinutes()).padStart(2, '0');
        const second = String(monthAgo.getSeconds()).padStart(2, '0');
        return `${year}.${month}.${day}. ${hour}:${minute}:${second}`;
      })(),
      beforeStatus: '승인',
      afterStatus: '승인대기',
      changeReason: '소속 정치인 변경으로 인한 재검토',
      processor: '관리자',
      processorId: 'ADMIN001',
      processorNickname: '관리자1',
      notes: '소속 정치인: 김의원 → 장대표'
    },
    // 1년 전 데이터 (연간 테스트용)
    {
      id: 5,
      memberId: 'NM000005',
      nickname: '연간회원',
      memberType: '일반회원',
      changeDate: (() => {
        const yearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        const year = yearAgo.getFullYear().toString().slice(-2);
        const month = String(yearAgo.getMonth() + 1).padStart(2, '0');
        const day = String(yearAgo.getDate()).padStart(2, '0');
        const hour = String(yearAgo.getHours()).padStart(2, '0');
        const minute = String(yearAgo.getMinutes()).padStart(2, '0');
        const second = String(yearAgo.getSeconds()).padStart(2, '0');
        return `${year}.${month}.${day}. ${hour}:${minute}:${second}`;
      })(),
      beforeStatus: '승인',
      afterStatus: '정지',
      changeReason: '반복적인 욕설 및 비방으로 인한 정지',
      processor: '관리자',
      processorId: 'ADMIN002',
      processorNickname: '관리자2',
      notes: '정지기간: 7일'
    },
    // 기존 데이터들 (추가로 유지)
    {
      id: 6,
      memberId: 'NM000008',
      nickname: '토끼민주',
      memberType: '일반회원',
      changeDate: '25.05.30. 14:30:25',
      beforeStatus: null,
      afterStatus: '승인',
      changeReason: '일반회원 신규가입',
      processor: null,
      processorId: null,
      processorNickname: null,
      notes: ''
    },
    {
      id: 7,
      memberId: 'NM000012',
      nickname: '새로운회원',
      memberType: '일반회원',
      changeDate: '25.06.01. 10:15:33',
      beforeStatus: null,
      afterStatus: '승인',
      changeReason: '일반회원 신규가입',
      processor: null,
      processorId: null,
      processorNickname: null,
      notes: ''
    },
    {
      id: 8,
      memberId: 'PA000008',
      nickname: '김보좌',
      memberType: '보좌진',
      changeDate: '25.05.28. 09:15:42',
      beforeStatus: '승인',
      afterStatus: '승인대기',
      changeReason: '소속 정치인 변경으로 인한 재검토',
      processor: '관리자',
      processorId: 'ADMIN001',
      processorNickname: '관리자1',
      notes: '소속 정치인: 김의원 → 장대표'
    }
  ];

  const statusOptions = ['전체', '신규가입', '승인대기', '승인', '탈퇴', '정지', '강퇴'];
  const beforeStatusOptions = ['전체', '신규가입', '승인대기', '승인', '탈퇴', '정지', '강퇴']; // 변경 전에는 모든 상태 가능
  const afterStatusOptions = ['전체', '승인대기', '승인', '탈퇴', '정지', '강퇴']; // 변경 후에는 신규가입 제외
  const memberTypeOptions = ['전체', '일반회원', '정치인', '보좌진'];
  const processorOptions = ['전체', '-', '관리자1', '관리자2'];
  const periodOptions = ['전체', '일간', '주간', '월간', '연간', '사용자지정'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '신규가입':
        return 'bg-blue-100 text-blue-800';
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

  const handleMemberClick = (memberId: string) => {
    console.log(`회원 상세보기: ${memberId}`);
    setSelectedMemberId(memberId);
    setIsPopupOpen(true);
  };

  const handleAdminClick = (adminId: string) => {
    console.log(`관리자 상세보기: ${adminId}`);
    setSelectedAdminId(adminId);
    setIsAdminPopupOpen(true);
  };

  const filteredHistory = sampleStatusHistory.filter(item => {
    const matchesSearch = item.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.memberId.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 변경 전 상태 필터링 (null인 경우 '신규가입'으로 처리)
    const beforeStatus = item.beforeStatus || '신규가입';
    const matchesBeforeStatus = beforeStatusFilter === '전체' || beforeStatus === beforeStatusFilter;
    
    // 변경 후 상태 필터링
    const matchesAfterStatus = afterStatusFilter === '전체' || item.afterStatus === afterStatusFilter;
    
    const matchesMemberType = memberTypeFilter === '전체' || item.memberType === memberTypeFilter;
    
    // 처리자 필터링 (null인 경우 '-'로 처리)
    const processor = item.processorNickname || '-';
    const matchesProcessor = processorFilter === '전체' || processor === processorFilter;
    
    // 날짜 필터링
    let matchesDateRange = true;
    if (startDate && endDate) {
      // 변경일시를 Date 객체로 변환하여 비교
      try {
        // "25.05.30. 14:30:25" 형식을 Date 객체로 변환
        const dateMatch = item.changeDate.match(/(\d{2})\.(\d{2})\.(\d{2})\. (\d{2}):(\d{2}):(\d{2})/);
        if (dateMatch) {
          const [, year, month, day, hour, minute, second] = dateMatch;
          const itemDate = new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day), 
                                   parseInt(hour), parseInt(minute), parseInt(second));
          
          const filterStartDate = new Date(startDate);
          const filterEndDate = new Date(endDate);
          filterEndDate.setHours(23, 59, 59, 999); // 해당 날짜 끝까지 포함
          
          // 유효한 날짜인지 확인
          if (!isNaN(itemDate.getTime()) && !isNaN(filterStartDate.getTime()) && !isNaN(filterEndDate.getTime())) {
            matchesDateRange = itemDate >= filterStartDate && itemDate <= filterEndDate;
          }
        }
      } catch (error) {
        console.error('날짜 변환 오류:', item.changeDate, error);
        matchesDateRange = true; // 오류 시 포함시킴
      }
    }
    
    return matchesSearch && matchesBeforeStatus && matchesAfterStatus && matchesMemberType && matchesProcessor && matchesDateRange;
  }).sort((a, b) => {
    // 회원상태 변경일시 기준으로 최신순 정렬 (내림차순)
    try {
      const getDateFromString = (dateStr: string) => {
        const dateMatch = dateStr.match(/(\d{2})\.(\d{2})\.(\d{2})\. (\d{2}):(\d{2}):(\d{2})/);
        if (dateMatch) {
          const [, year, month, day, hour, minute, second] = dateMatch;
          return new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day), 
                         parseInt(hour), parseInt(minute), parseInt(second));
        }
        return new Date(0); // 파싱 실패 시 기본값
      };
      
      const dateA = getDateFromString(a.changeDate);
      const dateB = getDateFromString(b.changeDate);
      
      return dateB.getTime() - dateA.getTime(); // 최신순 정렬 (내림차순)
    } catch (error) {
      console.error('정렬 중 날짜 변환 오류:', error);
      return 0;
    }
  });

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    console.log('회원상태 변동이력 내보내기');
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
            <h1 className="text-2xl font-bold text-gray-900">회원상태 변경이력</h1>
            <p className="mt-1 text-gray-600">회원의 상태 변경 이력을 조회하고 관리할 수 있습니다.</p>
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

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">회원유형</label>
            <select
              value={memberTypeFilter}
              onChange={(e) => setMemberTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {memberTypeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">처리자</label>
            <select
              value={processorFilter}
              onChange={(e) => setProcessorFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {processorOptions.map(option => (
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
                    setStartDate(startDateStr);
                    setEndDate(endDateStr);
                  }
                } else {
                  setStartDate('');
                  setEndDate('');
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
            <label className="block text-sm font-medium text-gray-700 mb-2">변경 전 회원상태</label>
            <select
              value={beforeStatusFilter}
              onChange={(e) => setBeforeStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {beforeStatusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">변경 후 회원상태</label>
            <select
              value={afterStatusFilter}
              onChange={(e) => setAfterStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {afterStatusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">회원상태 변경일 (시작)</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (e.target.value) {
                  setPeriodFilter('사용자지정');
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">회원상태 변경일 (종료)</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                if (e.target.value) {
                  setPeriodFilter('사용자지정');
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        {/* 필터 상태 표시 */}
        {(memberTypeFilter !== '전체' || processorFilter !== '전체' || periodFilter !== '전체' || beforeStatusFilter !== '전체' || afterStatusFilter !== '전체' || startDate || endDate) && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-blue-700">적용된 필터:</span>
                {memberTypeFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    회원유형: {memberTypeFilter}
                  </span>
                )}
                {processorFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    처리자: {processorFilter}
                  </span>
                )}
                {beforeStatusFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    변경 전: {beforeStatusFilter}
                  </span>
                )}
                {afterStatusFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    변경 후: {afterStatusFilter}
                  </span>
                )}
                {periodFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    기간: {periodFilter}
                  </span>
                )}
                {(startDate || endDate) && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    날짜: {startDate} ~ {endDate}
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setMemberTypeFilter('전체');
                  setProcessorFilter('전체');
                  setBeforeStatusFilter('전체');
                  setAfterStatusFilter('전체');
                  setPeriodFilter('전체');
                  setStartDate('');
                  setEndDate('');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                필터 초기화
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 이력 목록 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              회원상태 변경이력 ({filteredHistory.length.toLocaleString()}건)
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">회원상태 변경일시</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">회원정보</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">회원상태 (변경 전)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">회원상태 (변경 후)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">회원상태 변경사유</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">처리자</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">비고</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedHistory.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.changeDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="space-y-1">
                      <div>
                        <button
                          onClick={() => handleMemberClick(item.memberId)}
                          className="text-blue-600 hover:text-blue-800 italic underline font-medium"
                        >
                          {item.memberId}
                        </button>
                      </div>
                      <div className="text-gray-900">{item.nickname}</div>
                      <div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getMemberTypeColor(item.memberType)}`}>
                          {item.memberType}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.beforeStatus || '신규가입')}`}>
                      {item.beforeStatus || '신규가입'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.afterStatus)}`}>
                      {item.afterStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="truncate" title={item.changeReason}>
                      {item.changeReason}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="space-y-1">
                      {item.processor ? (
                        <>
                          <div className="text-gray-900">{item.processorNickname || item.processor}</div>
                          <div className="text-gray-500 text-xs">
                            {item.processorId && item.processorId !== 'SYSTEM' ? (
                              <button
                                onClick={() => handleAdminClick(item.processorId)}
                                className="text-blue-600 hover:text-blue-800 italic underline font-medium"
                              >
                                {item.processorId}
                              </button>
                            ) : (
                              <span>{item.processorId}</span>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-500">-</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                    <div className="truncate" title={item.notes}>
                      {item.notes || '-'}
                    </div>
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
                {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredHistory.length)} / {filteredHistory.length}개 표시
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

      {/* 회원 상세 팝업 */}
      {isPopupOpen && selectedMemberId && (
        <MemberDetailPopup
          isVisible={isPopupOpen}
          onClose={() => {
            setIsPopupOpen(false);
            setSelectedMemberId(null);
          }}
          memberData={{
            id: selectedMemberId,
            nickname: sampleStatusHistory.find(item => item.memberId === selectedMemberId)?.nickname || '회원',
            type: sampleStatusHistory.find(item => item.memberId === selectedMemberId)?.memberType || '일반회원',
            status: '승인',
            email: `${selectedMemberId.toLowerCase()}@example.com`,
            joinDate: '24.05.01. 09:30:15',
            lastLogin: '25.01.27. 14:25:30',
            // 더미 데이터로 기본값 설정
            activities: {
              posts: 5,
              comments: 12,
              likes: 8,
              votes: 3
            }
          }}
        />
      )}

      {/* 관리자 상세 팝업 */}
      {isAdminPopupOpen && selectedAdminId && (
        <MemberDetailPopup
          isVisible={isAdminPopupOpen}
          onClose={() => {
            setIsAdminPopupOpen(false);
            setSelectedAdminId(null);
          }}
          memberData={{
            id: selectedAdminId,
            nickname: selectedAdminId === 'ADMIN001' ? '관리자1' : selectedAdminId === 'ADMIN002' ? '관리자2' : '관리자',
            type: '운영자',
            status: '승인',
            email: `${selectedAdminId.toLowerCase()}@polibat.com`,
            joinDate: '24.01.01. 09:00:00',
            lastLogin: '25.01.27. 18:30:00',
            // 관리자 활동 데이터
            activities: {
              posts: 0,
              comments: 0,
              likes: 0,
              votes: 0
            }
          }}
        />
      )}
    </div>
  );
};

export default MemberStatusHistoryPage; 