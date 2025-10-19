import React, { useState, useEffect } from 'react';
import { openAdminPage } from '../utils/navigation';
import { MessageCircle, Search, Filter, Download, RefreshCw, Eye, Flag, FileText, ThumbsUp, ThumbsDown } from 'lucide-react';
import CommentDetailPopup from '../components/popups/CommentDetailPopup';
import PostDetailPopup from '../components/popups/PostDetailPopup';
import MemberDetailPopup from '../components/popups/MemberDetailPopup';

const CommentsManagementPage = () => {
  // 브라우저 타이틀 설정
  useEffect(() => {
    document.title = '댓글 관리 - POLIBAT admin';
  }, []);

  const [selectedComment, setSelectedComment] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);
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
    const commentId = params.get('commentId');
    const postId = params.get('postId');
    const memberId = params.get('memberId');
    const board = params.get('board');
    const period = params.get('period');
    const status = params.get('status');
    const suggestionId = params.get('suggestionId');
    const voteId = params.get('voteId');
    const noticeId = params.get('noticeId');
    
    // 댓글 ID, 게시글 ID, 회원 ID 등으로 검색
    if (commentId) {
      setSearchTerm(commentId);
    } else if (postId) {
      setSearchTerm(postId);
    } else if (memberId) {
      setSearchTerm(memberId);
    } else if (suggestionId) {
      setSearchTerm(suggestionId);
      setBoardFilter('불편/제안 접수');
    } else if (voteId) {
      setSearchTerm(voteId);
      setBoardFilter('투표');
    } else if (noticeId) {
      setSearchTerm(noticeId);
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

  // 샘플 댓글 데이터
  const sampleComments = [
    {
      id: 1,
      post: {
        postId: 'FB000001',
        board: '자유게시판',
        title: '어떤 글 입니다',
        status: '게시',
        views: 101
      },
      comment: {
        commentId: 'FB000001-CM0003',
        content: '이게 말이냐',
        status: '게시',
        reports: 0,
        likes: 3,
        dislikes: 1,
        author: {
          memberId: 'NM000091',
          nickname: '레드썬'
        },
        createdAt: '25.05.31. 00:00:00',
        updatedAt: '25.05.31. 00:00:00'
      }
    },
    {
      id: 2,
      post: {
        postId: 'FB000001',
        board: '자유게시판',
        title: '어떤 글 입니다',
        status: '게시',
        views: 101
      },
      comment: {
        commentId: 'FB000001-CM0002',
        content: '좋은글이네요',
        status: '게시',
        reports: 0,
        likes: 8,
        dislikes: 0,
        author: {
          memberId: 'PM000191',
          nickname: '철이'
        },
        createdAt: '25.05.30. 00:00:00',
        updatedAt: '25.05.30. 00:00:00'
      }
    },
    {
      id: 3,
      post: {
        postId: 'FB000001',
        board: '자유게시판',
        title: '어떤 글 입니다',
        status: '게시',
        views: 101
      },
      comment: {
        commentId: 'FB000001-CM0001',
        content: '넌 잘났냐',
        status: '게시',
        reports: 0,
        likes: 5,
        dislikes: 12,
        author: {
          memberId: 'NM000291',
          nickname: '블루보틀'
        },
        createdAt: '25.05.30. 00:00:00',
        updatedAt: '25.05.30. 00:00:00'
      }
    },
    {
      id: 4,
      post: {
        postId: 'PB000002',
        board: '정치인게시판',
        title: '나라 망했음',
        status: '숨김',
        views: 66
      },
      comment: {
        commentId: 'PB000002-CM0002',
        content: '웃기고 자빠졌네',
        status: '게시',
        reports: 1,
        likes: 2,
        dislikes: 7,
        author: {
          memberId: 'NM001191',
          nickname: '119전화'
        },
        createdAt: '25.05.15. 00:00:00',
        updatedAt: '25.05.15. 00:00:00'
      }
    },
    {
      id: 5,
      post: {
        postId: 'PB000002',
        board: '정치방망이!',
        title: '나라 망했음',
        status: '숨김',
        views: 66
      },
      comment: {
        commentId: 'PB000002-CM0001',
        content: '순대나 먹어',
        status: '숨김',
        reports: 11,
        likes: 1,
        dislikes: 15,
        author: {
          memberId: 'NM000098',
          nickname: '노스탠드업'
        },
        createdAt: '25.05.10. 00:00:00',
        updatedAt: '25.05.10. 00:00:00'
      }
    },
    {
      id: 6,
      post: {
        postId: 'FB000004',
        board: '자유게시판',
        title: '토끼민주 의견 - 정치 개혁 필요성',
        status: '게시',
        views: 67
      },
      comment: {
        commentId: 'FB000004-CM0001',
        content: '좋은 의견이네요. 동의합니다.',
        status: '게시',
        reports: 0,
        likes: 5,
        dislikes: 0,
        author: {
          memberId: 'PM000001',
          nickname: '정치인1'
        },
        createdAt: '25.05.29. 00:00:00',
        updatedAt: '25.05.29. 00:00:00'
      }
    },
    {
      id: 7,
      post: {
        postId: 'PB000003',
        board: '정치방망이!',
        title: '장대표님께 질문드립니다',
        status: '게시',
        views: 125
      },
      comment: {
        commentId: 'PB000003-CM0001',
        content: '좋은 질문입니다. 답변 드리겠습니다.',
        status: '게시',
        reports: 0,
        likes: 12,
        dislikes: 0,
        author: {
          memberId: 'PM000008',
          nickname: '장대표'
        },
        createdAt: '25.05.27. 00:00:00',
        updatedAt: '25.05.27. 00:00:00'
      }
    },
    {
      id: 8,
      post: {
        postId: 'PB000004',
        board: '정치방망이!',
        title: '장대표 답변 - 정치 개혁에 대하여',
        status: '게시',
        views: 234
      },
      comment: {
        commentId: 'PB000004-CM0001',
        content: '답변 감사합니다. 추가 질문이 있습니다.',
        status: '게시',
        reports: 0,
        likes: 8,
        dislikes: 0,
        author: {
          memberId: 'NM000008',
          nickname: '토끼민주'
        },
        createdAt: '25.05.28. 00:00:00',
        updatedAt: '25.05.28. 00:00:00'
      }
    }
  ];

  const boardOptions = ['전체', '자유게시판', '정치인게시판', '투표', '불편/제안 접수'];
  const statusOptions = ['전체', '게시', '숨김', '삭제'];
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

  const getBoardColor = (board: string) => {
    switch (board) {
      case '자유게시판':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case '정치인게시판':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case '투표':
        return 'bg-green-50 text-green-700 border-green-200';
      case '불편/제안 접수':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleCommentClick = (comment: any) => {
    setSelectedComment(comment);
  };

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
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
      // 추가 필드들을 기본값으로 초기화
      notificationSettings: {
        polibatNotification: true
      },
      politician: member.politician || {
        politicianName: '정치인명',
        party: '소속정당',
        politicianType: '국회의원',
        officialEmail: 'official@domain.go.kr'
      },
      activities: member.activities || {
        posts: 0,
        comments: 0,
        votes: 0,
        likesGiven: { posts: 0, comments: 0 },
        dislikesGiven: { posts: 0, comments: 0 },
        reportsGiven: { posts: 0, comments: 0 },
        reported: { posts: 0, comments: 0 }
      },
      application: member.application || {
        politicianName: '정치인명',
        party: '소속정당',
        officialEmail: 'official@domain.go.kr',
        appliedDate: '2025.01.01'
      }
    };
    setSelectedMember(memberData);
  };

  const handleLikesClick = (commentId: string, reactionType: string, count: number) => {
    if (count === 0) return;
    console.log(`좋아요/싫어요 이력 페이지로 이동 - 댓글: ${commentId}, 타입: ${reactionType}`);
    openAdminPage(`/likes-history?commentId=${commentId}&type=${reactionType}`);
  };

  const handleReportsClick = (commentId: string, count: number) => {
    if (count === 0) return;
    console.log(`신고이력 페이지로 이동 - 댓글: ${commentId}`);
    openAdminPage(`/reports?commentId=${commentId}`);
  };

  const filteredComments = sampleComments.filter(item => {
    const matchesSearch = item.comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.comment.commentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.comment.author.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBoard = boardFilter === '전체' || item.post.board === boardFilter;
    const matchesStatus = statusFilter === '전체' || item.comment.status === statusFilter;
    
    // 날짜 필터링 (dateType에 따라 작성일 또는 최종수정일 중 하나만)
    let matchesDateRange = true;
    if (dateStartDate && dateEndDate) {
      try {
        // 선택된 날짜 타입에 따라 해당 날짜 필드 사용
        const targetDate = dateType === '작성일' ? item.comment.createdAt : item.comment.updatedAt;
        
        // "25.05.30. 00:00:00" 형식을 Date 객체로 변환
        const dateMatch = targetDate.match(/(\d{2})\.(\d{2})\.(\d{2})\. (\d{2}):(\d{2}):(\d{2})/);
        if (dateMatch) {
          const [, year, month, day, hour, minute, second] = dateMatch;
          const commentDate = new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day), 
                                      parseInt(hour), parseInt(minute), parseInt(second));
          
          const filterStartDate = new Date(dateStartDate);
          const filterEndDate = new Date(dateEndDate);
          filterEndDate.setHours(23, 59, 59, 999); // 해당 날짜 끝까지 포함
          
          if (!isNaN(commentDate.getTime()) && !isNaN(filterStartDate.getTime()) && !isNaN(filterEndDate.getTime())) {
            matchesDateRange = commentDate >= filterStartDate && commentDate <= filterEndDate;
          }
        }
      } catch (error) {
        console.error(`${dateType} 변환 오류:`, dateType === '작성일' ? item.comment.createdAt : item.comment.updatedAt, error);
        matchesDateRange = true; // 오류 시 포함시킴
      }
    }
    
    return matchesSearch && matchesBoard && matchesStatus && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredComments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComments = filteredComments.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    console.log('댓글 데이터 내보내기');
  };

  const handleRefresh = () => {
    console.log('데이터 새로고침');
  };

  // 통계 계산
  const totalComments = sampleComments.length;
  const activeComments = sampleComments.filter(item => item.comment.status === '게시').length;
  const hiddenComments = sampleComments.filter(item => item.comment.status === '숨김').length;
  const reportedComments = sampleComments.filter(item => item.comment.reports > 0).length;

  return (
    <div className="p-6">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">댓글 관리</h1>
            <p className="mt-1 text-gray-600">댓글을 조회하고 관리할 수 있습니다.</p>
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
             onClick={() => setStatusFilter('전체')}>
          <div className="flex items-center">
            <MessageCircle className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">전체 댓글</p>
              <p className="text-2xl font-bold text-gray-900">{totalComments}개</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50"
             onClick={() => setStatusFilter('게시')}>
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">게시 중</p>
              <p className="text-2xl font-bold text-gray-900">{activeComments}개</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50"
             onClick={() => setStatusFilter('숨김')}>
          <div className="flex items-center">
            <Filter className="w-8 h-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">숨김 처리</p>
              <p className="text-2xl font-bold text-gray-900">{hiddenComments}개</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50"
             onClick={() => {
               setStatusFilter('전체');
               // 신고된 댓글은 별도 처리 (신고 수가 0보다 큰 것)
               // 실제 구현에서는 신고 상태 필터가 필요할 수 있음
             }}>
          <div className="flex items-center">
            <Flag className="w-8 h-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">신고된 댓글</p>
              <p className="text-2xl font-bold text-gray-900">{reportedComments}개</p>
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
                placeholder="댓글 내용, 댓글 ID, 작성자, 게시글 제목 검색..."
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
        {(boardFilter !== '전체' || statusFilter !== '전체' || periodFilter !== '전체' || dateStartDate || dateEndDate || searchTerm) && (
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
                {searchTerm && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    검색어: {searchTerm}
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
              <h3 className="text-lg font-semibold text-gray-900">댓글 목록</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                총 {filteredComments.length}개
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">게시글</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">댓글 아이디</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">댓글 내용</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">댓글 상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">받은 반응</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신고 받음</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">댓글 작성자</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일시</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">최종수정일시</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedComments.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <button
                        onClick={() => handlePostClick(item.post)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 underline"
                      >
                        {item.post.postId}
                      </button>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded border ${getBoardColor(item.post.board)}`}>
                          {item.post.board}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.post.status)}`}>
                          {item.post.status}
                        </span>
                      </div>
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-900 truncate" title={item.post.title}>
                          {item.post.title}
                        </p>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Eye className="w-3 h-3 mr-1" />
                        {item.post.views}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleCommentClick(item)}
                      className="text-blue-600 hover:text-blue-800 underline font-medium text-sm"
                    >
                      {item.comment.commentId}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-900 break-words" title={item.comment.content}>
                        {item.comment.content.length > 50 
                          ? `${item.comment.content.substring(0, 50)}...` 
                          : item.comment.content}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.comment.status)}`}>
                      {item.comment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleLikesClick(item.comment.commentId, '좋아요', item.comment.likes)}
                        className={`flex items-center ${item.comment.likes > 0 ? 'text-green-600 hover:text-green-800' : 'text-gray-400'}`}
                        disabled={item.comment.likes === 0}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {item.comment.likes}
                      </button>
                      <button
                        onClick={() => handleLikesClick(item.comment.commentId, '싫어요', item.comment.dislikes)}
                        className={`flex items-center ${item.comment.dislikes > 0 ? 'text-red-600 hover:text-red-800' : 'text-gray-400'}`}
                        disabled={item.comment.dislikes === 0}
                      >
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        {item.comment.dislikes}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleReportsClick(item.comment.commentId, item.comment.reports)}
                      className={`flex items-center ${item.comment.reports > 0 ? 'text-red-600 hover:text-red-800' : 'text-gray-400'}`}
                      disabled={item.comment.reports === 0}
                    >
                      <Flag className="w-4 h-4 mr-1" />
                      {item.comment.reports}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <button
                        onClick={() => handleMemberClick(item.comment.author)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 underline text-left"
                      >
                        {item.comment.author.memberId}
                      </button>
                      <button
                        onClick={() => handleMemberClick(item.comment.author)}
                        className="text-sm text-blue-600 hover:text-blue-800 underline text-left block"
                      >
                        {item.comment.author.nickname}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.comment.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.comment.updatedAt}
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
                <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredComments.length)}</span>
                의
                <span className="font-medium"> {filteredComments.length}</span>
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

      {/* 댓글 상세정보 팝업 */}
      {selectedComment && (
        <CommentDetailPopup
          isVisible={true}
          onClose={() => setSelectedComment(null)}
          commentData={selectedComment}
        />
      )}

      {/* 게시글 상세정보 팝업 */}
      {selectedPost && (
        <PostDetailPopup
          isVisible={true}
          onClose={() => setSelectedPost(null)}
          postData={selectedPost}
        />
      )}

      {/* 멤버 상세정보 팝업 */}
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

export default CommentsManagementPage; 