import React, { useState, useEffect } from 'react';
import { Flag, Search, Filter, Download, RefreshCw, FileText, MessageCircle, User } from 'lucide-react';
import MemberDetailPopup from '../components/popups/MemberDetailPopup';
import PostDetailPopup from '../components/popups/PostDetailPopup';
import CommentDetailPopup from '../components/popups/CommentDetailPopup';

const ReportsHistoryPage = () => {
  // 브라우저 타이틀 설정
  useEffect(() => {
    document.title = '신고이력 - POLIBAT admin';
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [reportReasonFilter, setReportReasonFilter] = useState('전체');
  const [contentTypeFilter, setContentTypeFilter] = useState('전체');
  const [boardFilter, setBoardFilter] = useState('전체');
  const [dateType, setDateType] = useState('신고일시'); // '신고일시'만 사용 (하나의 날짜 필드만 있음)
  const [periodFilter, setPeriodFilter] = useState('전체');
  const [dateStartDate, setDateStartDate] = useState('');
  const [dateEndDate, setDateEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  
  // 팝업 상태
  const [showMemberDetail, setShowMemberDetail] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showCommentDetail, setShowCommentDetail] = useState(false);
  const [selectedComment, setSelectedComment] = useState<any>(null);
  
  // URL 파라미터 처리 (대시보드에서 전달받은 조건 자동 설정)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('postId');
    const commentId = params.get('commentId');
    const memberId = params.get('memberId');
    const type = params.get('type');
    const reason = params.get('reason');
    const contentType = params.get('contentType');
    const board = params.get('board');
    const period = params.get('period');
    
    if (postId) {
      setSearchTerm(postId);
      setContentTypeFilter('게시글');
    } else if (commentId) {
      setSearchTerm(commentId);
      setContentTypeFilter('댓글');
    } else if (memberId) {
      setSearchTerm(memberId);
    }
    
    if (reason) {
      setReportReasonFilter(reason);
    }
    
    // 대시보드에서 전달받은 콘텐츠 타입 설정
    if (contentType) {
      setContentTypeFilter(contentType);
    }
    
    // 대시보드에서 전달받은 게시판 조건 설정
    if (board) {
      setBoardFilter(board);
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
    
    if (type === '신고함') {
      // 신고한 내역만 보기 - memberId로 신고자 필터
    } else if (type === '신고받음') {
      // 신고받은 내역만 보기 - content author가 memberId인 것
    }
  }, []);

  // 샘플 신고이력 데이터
  const sampleReports = [
    {
      id: 1,
      reporter: {
        memberId: 'NM000123',
        nickname: '일반회원1',
        type: '일반회원',
        status: '승인'
      },
      reportedContent: {
        type: '게시글',
        id: 'PB123456',
        board: '자유게시판',
        title: '이재명 G7 순방요약',
        status: '게시',
        reports: 10
      },
      reason: '홍보성 컨텐츠',
      reportDate: '25.06.18. 06:32:17'
    },
    {
      id: 2,
      reporter: {
        memberId: 'PM000456',
        nickname: '정치인1',
        type: '정치인',
        status: '승인'
      },
      reportedContent: {
        type: '댓글',
        id: 'FB123456-CM0001',
        board: '정치인게시판',
        title: '국격올라가는 소리가 들린다',
        status: '게시',
        reports: 1
      },
      reason: '욕설/비하발언',
      reportDate: '25.06.18. 06:32:57'
    },
    {
      id: 3,
      reporter: {
        memberId: 'NM000789',
        nickname: '신고자A',
        type: '일반회원',
        status: '승인'
      },
      reportedContent: {
        type: '게시글',
        id: 'PB789012',
        board: '정치인게시판',
        title: '정치개혁이 필요하다고 생각합니다',
        status: '숨김',
        reports: 5
      },
      reason: '정치적 편향성',
      reportDate: '25.06.17. 15:20:33'
    },
    {
      id: 4,
      reporter: {
        memberId: 'NM000555',
        nickname: '깨끗한세상',
        type: '일반회원',
        status: '승인'
      },
      reportedContent: {
        type: '댓글',
        id: 'VP000001-CM0005',
        board: '투표',
        title: '부적절한 댓글 내용입니다',
        status: '삭제',
        reports: 8
      },
      reason: '음란/선정성',
      reportDate: '25.06.16. 20:45:18'
    },
    {
      id: 5,
      reporter: {
        memberId: 'PA000111',
        nickname: '정의로운시민',
        type: '보좌진',
        status: '승인'
      },
      reportedContent: {
        type: '게시글',
        id: 'FB555888',
        board: '자유게시판',
        title: '거짓 정보가 포함된 글',
        status: '게시',
        reports: 3
      },
      reason: '허위정보 유포',
      reportDate: '25.06.15. 11:30:25'
    },
    {
      id: 6,
      reporter: {
        memberId: 'NM000011',
        nickname: '일반회원11',
        type: '일반회원',
        status: '승인'
      },
      reportedContent: {
        type: '게시글',
        id: 'PB000002',
        board: '정치인게시판',
        title: '나라 망했음',
        status: '숨김',
        reports: 5
      },
      reason: '허위정보/가짜뉴스',
      reportDate: '25.05.16. 10:30:00'
    },
    {
      id: 7,
      reporter: {
        memberId: 'NM000008',
        nickname: '토끼민주',
        type: '일반회원',
        status: '승인'
      },
      reportedContent: {
        type: '댓글',
        id: 'PB000002-CM0001',
        board: '정치인게시판',
        title: '순대나 먹어',
        status: '숨김',
        reports: 11
      },
      reason: '욕설/비하발언',
      reportDate: '25.05.11. 09:15:00'
    }
  ];

  const reportReasonOptions = [
    '전체', '욕설/비하발언', '음란/선정성', '홍보성 컨텐츠', 
    '정치적 편향성', '허위정보 유포', '스팸/도배', '기타'
  ];
  const contentTypeOptions = ['전체', '게시글', '댓글'];
  const boardOptions = ['전체', '자유게시판', '정치인게시판', '투표'];
  const dateTypeOptions = ['신고일시']; // ReportsHistory는 신고일시만 있음
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

  const getContentStatusColor = (status: string) => {
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

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case '욕설/비하발언':
        return 'bg-red-50 text-red-700 border-red-200';
      case '음란/선정성':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case '홍보성 컨텐츠':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case '정치적 편향성':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case '허위정보 유포':
        return 'bg-red-50 text-red-700 border-red-200';
      case '스팸/도배':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleContentClick = (contentId: string, contentType: string, report: any) => {
    if (contentType === '게시글') {
      const postData = {
        id: contentId,
        board: report.reportedContent.board,
        title: report.reportedContent.title,
        content: '게시글 내용입니다.',
        status: report.reportedContent.status,
        author: {
          memberId: 'AUTHOR001',
          nickname: '게시글작성자',
          type: '일반회원'
        },
        stats: {
          views: 101,
          comments: 6,
          likes: 19,
          dislikes: 1,
          reports: report.reportedContent.reports
        },
        dates: {
          created: '2025.05.30 14:25:30',
          lastModified: '2025.05.30 14:25:30'
        }
      };
      setSelectedPost(postData);
      setShowPostDetail(true);
    } else {
      const commentData = {
        id: contentId,
        content: report.reportedContent.title,
        status: report.reportedContent.status,
        author: {
          memberId: 'AUTHOR001',
          nickname: '댓글작성자',
          type: '일반회원'
        },
        post: {
          id: contentId.split('-')[0],
          board: report.reportedContent.board,
          title: '관련 게시글 제목',
          status: '게시',
          views: 101
        },
        stats: {
          likes: 5,
          dislikes: 12,
          reports: report.reportedContent.reports
        },
        dates: {
          created: '2025.05.30 14:25:30',
          lastModified: '2025.05.30 14:25:30'
        }
      };
      setSelectedComment(commentData);
      setShowCommentDetail(true);
    }
  };

  const handleReportsClick = (contentId: string, contentType: string, reports: number) => {
    if (reports === 0) return;
    console.log(`${contentType} 신고이력 상세보기: ${contentId}`);
  };

  const filteredReports = sampleReports.filter(report => {
    const matchesSearch = report.reporter.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reporter.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reportedContent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reportedContent.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesReason = reportReasonFilter === '전체' || report.reason === reportReasonFilter;
    const matchesContentType = contentTypeFilter === '전체' || report.reportedContent.type === contentTypeFilter;
    const matchesBoard = boardFilter === '전체' || report.reportedContent.board === boardFilter;
    
    // 날짜 필터링 (신고일시 기준)
    let matchesDateRange = true;
    if (dateStartDate && dateEndDate) {
      try {
        // "25.06.18. 06:32:17" 형식을 Date 객체로 변환
        const dateMatch = report.reportDate.match(/(\d{2})\.(\d{2})\.(\d{2})\. (\d{2}):(\d{2}):(\d{2})/);
        if (dateMatch) {
          const [, year, month, day, hour, minute, second] = dateMatch;
          const reportDate = new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day), 
                                     parseInt(hour), parseInt(minute), parseInt(second));
          
          const filterStartDate = new Date(dateStartDate);
          const filterEndDate = new Date(dateEndDate);
          filterEndDate.setHours(23, 59, 59, 999); // 해당 날짜 끝까지 포함
          
          if (!isNaN(reportDate.getTime()) && !isNaN(filterStartDate.getTime()) && !isNaN(filterEndDate.getTime())) {
            matchesDateRange = reportDate >= filterStartDate && reportDate <= filterEndDate;
          }
        }
      } catch (error) {
        console.error('신고일시 변환 오류:', report.reportDate, error);
        matchesDateRange = true; // 오류 시 포함시킴
      }
    }
    
    return matchesSearch && matchesReason && matchesContentType && matchesBoard && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    console.log('신고이력 데이터 내보내기');
  };

  const handleRefresh = () => {
    console.log('데이터 새로고침');
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
        posts: 0,
        comments: 0,
        votes: 0,
        likesGiven: { posts: 0, comments: 0 },
        dislikesGiven: { posts: 0, comments: 0 },
        reportsGiven: { posts: 0, comments: 0 },
        reported: { posts: 0, comments: 0 }
      },
      application: {
        politicianName: '정치인명',
        party: '소속정당',
        officialEmail: 'official@domain.go.kr',
        appliedDate: '2025.01.01'
      }
    };
    setSelectedMember(memberData);
    setShowMemberDetail(true);
  };

  // 통계 계산
  const totalReports = sampleReports.length;
  const postReports = sampleReports.filter(report => report.reportedContent.type === '게시글').length;
  const commentReports = sampleReports.filter(report => report.reportedContent.type === '댓글').length;
  const processingReports = sampleReports.filter(report => report.reportedContent.status === '게시').length;

  return (
    <div className="p-6">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">신고이력</h1>
            <p className="mt-1 text-gray-600">회원들의 신고 이력을 조회하고 관리할 수 있습니다.</p>
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
            <Flag className="w-8 h-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">전체 신고</p>
              <p className="text-2xl font-bold text-gray-900">{totalReports}건</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">게시글 신고</p>
              <p className="text-2xl font-bold text-gray-900">{postReports}건</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <MessageCircle className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">댓글 신고</p>
              <p className="text-2xl font-bold text-gray-900">{commentReports}건</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <User className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">처리 대기</p>
              <p className="text-2xl font-bold text-gray-900">{processingReports}건</p>
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
                placeholder="신고자, 신고 콘텐츠 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">신고사유</label>
            <select
              value={reportReasonFilter}
              onChange={(e) => setReportReasonFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {reportReasonOptions.map(reason => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">콘텐츠 유형</label>
            <select
              value={contentTypeFilter}
              onChange={(e) => setContentTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {contentTypeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
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
        {(reportReasonFilter !== '전체' || contentTypeFilter !== '전체' || boardFilter !== '전체' || periodFilter !== '전체' || dateStartDate || dateEndDate || searchTerm) && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-blue-700">적용된 필터:</span>
                {reportReasonFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    신고사유: {reportReasonFilter}
                  </span>
                )}
                {contentTypeFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    콘텐츠: {contentTypeFilter}
                  </span>
                )}
                {boardFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    게시판: {boardFilter}
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
                  setReportReasonFilter('전체');
                  setContentTypeFilter('전체');
                  setBoardFilter('전체');
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
              <h3 className="text-lg font-semibold text-gray-900">신고이력</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                총 {filteredReports.length}건
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신고한 회원</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신고받은 게시글/댓글</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신고사유</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신고일시</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedReports.map((report, index) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <button
                        onClick={() => handleMemberClick(report.reporter)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 underline cursor-pointer"
                      >
                        {report.reporter.memberId}
                      </button>
                      <div className="text-sm text-gray-600">
                        {report.reporter.nickname}
                      </div>
                      <div className="flex space-x-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMemberTypeColor(report.reporter.type)}`}>
                          {report.reporter.type}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.reporter.status)}`}>
                          {report.reporter.status}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {report.reportedContent.type === '게시글' ? (
                            <FileText className="w-4 h-4 text-blue-500 mr-1" />
                          ) : (
                            <MessageCircle className="w-4 h-4 text-purple-500 mr-1" />
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {report.reportedContent.type}
                          </span>
                        </div>
                        <button
                          onClick={() => handleContentClick(report.reportedContent.id, report.reportedContent.type, report)}
                          className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                        >
                          {report.reportedContent.id}
                        </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded border ${getBoardColor(report.reportedContent.board)}`}>
                          {report.reportedContent.board}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getContentStatusColor(report.reportedContent.status)}`}>
                          {report.reportedContent.status}
                        </span>
                      </div>
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-900 truncate" title={report.reportedContent.title}>
                          {report.reportedContent.title}
                        </p>
                      </div>
                      <button
                        onClick={() => handleReportsClick(report.reportedContent.id, report.reportedContent.type, report.reportedContent.reports)}
                        className="flex items-center text-red-600 hover:text-red-800 text-sm"
                      >
                        <Flag className="w-4 h-4 mr-1" />
                        신고받음: {report.reportedContent.reports}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded border ${getReasonColor(report.reason)}`}>
                      {report.reason}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.reportDate}
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
                <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredReports.length)}</span>
                의
                <span className="font-medium"> {filteredReports.length}</span>
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
        isVisible={showMemberDetail}
        onClose={() => setShowMemberDetail(false)}
        memberData={selectedMember}
      />

      {/* 게시글 상세 팝업 */}
      <PostDetailPopup
        isVisible={showPostDetail}
        onClose={() => setShowPostDetail(false)}
        postData={selectedPost}
      />

      {/* 댓글 상세 팝업 */}
      <CommentDetailPopup
        isVisible={showCommentDetail}
        onClose={() => setShowCommentDetail(false)}
        commentData={selectedComment}
      />
    </div>
  );
};

export default ReportsHistoryPage; 