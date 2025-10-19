import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Search, Filter, Download, RefreshCw, FileText, MessageCircle } from 'lucide-react';
import MemberDetailPopup from '../components/popups/MemberDetailPopup';
import PostDetailPopup from '../components/popups/PostDetailPopup';
import CommentDetailPopup from '../components/popups/CommentDetailPopup';

const LikesHistoryPage = () => {
  // 브라우저 타이틀 설정
  useEffect(() => {
    document.title = '좋아요/싫어요 이력 - POLIBAT admin';
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [memberTypeFilter, setMemberTypeFilter] = useState('전체');
  const [contentTypeFilter, setContentTypeFilter] = useState('전체');
  const [boardFilter, setBoardFilter] = useState('전체');
  const [reactionFilter, setReactionFilter] = useState('전체');
  const [dateType, setDateType] = useState('반응일시'); // '반응일시'만 사용 (하나의 날짜 필드만 있음)
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
  
  // URL 파라미터 처리
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('postId');
    const commentId = params.get('commentId');
    const memberId = params.get('memberId');
    const type = params.get('type');
    const suggestionId = params.get('suggestionId');
    const noticeId = params.get('noticeId');
    
    if (postId) {
      setSearchTerm(postId);
      setContentTypeFilter('게시글');
    } else if (commentId) {
      setSearchTerm(commentId);
      setContentTypeFilter('댓글');
    } else if (memberId) {
      setSearchTerm(memberId);
    } else if (suggestionId) {
      setSearchTerm(suggestionId);
      setContentTypeFilter('게시글');
    } else if (noticeId) {
      setSearchTerm(noticeId);
      setContentTypeFilter('게시글');
    }
    
    if (type === '좋아요') {
      setReactionFilter('좋아요');
    } else if (type === '싫어요') {
      setReactionFilter('싫어요');
    }
  }, []);

  // 샘플 좋아요/싫어요 이력 데이터
  const sampleLikesHistory = [
    {
      id: 1,
      member: {
        memberId: 'NM000123',
        nickname: '일반회원1',
        type: '일반회원',
        status: '승인'
      },
      content: {
        type: '게시글',
        id: 'PB123456',
        board: '자유게시판',
        title: '이재명 G7 순방요약',
        status: '게시'
      },
      reaction: '좋아요',
      reactionDate: '25.06.18. 06:32:17'
    },
    {
      id: 2,
      member: {
        memberId: 'PM000456',
        nickname: '정치인1',
        type: '정치인',
        status: '승인'
      },
      content: {
        type: '댓글',
        id: 'FB123456-CM0001',
        board: '정치인게시판',
        title: '국격올라가는 소리가 들린다',
        status: '게시'
      },
      reaction: '좋아요',
      reactionDate: '25.06.18. 06:32:57'
    },
    {
      id: 3,
      member: {
        memberId: 'NM000789',
        nickname: '민주회원',
        type: '일반회원',
        status: '승인'
      },
      content: {
        type: '게시글',
        id: 'PB789012',
        board: '정치인게시판',
        title: '정치개혁 필요성에 대해',
        status: '게시'
      },
      reaction: '싫어요',
      reactionDate: '25.06.17. 15:20:33'
    },
    {
      id: 4,
      member: {
        memberId: 'PA000111',
        nickname: '김보좌관',
        type: '보좌진',
        status: '승인'
      },
      content: {
        type: '댓글',
        id: 'VP000001-CM0005',
        board: '투표',
        title: '다음 대선 후보 선호도',
        status: '게시'
      },
      reaction: '좋아요',
      reactionDate: '25.06.17. 09:14:22'
    },
    {
      id: 5,
      member: {
        memberId: 'NM000555',
        nickname: '국민의견',
        type: '일반회원',
        status: '승인'
      },
      content: {
        type: '게시글',
        id: 'FB555666',
        board: '자유게시판',
        title: '경제정책에 대한 의견',
        status: '숨김'
      },
      reaction: '싫어요',
      reactionDate: '25.06.16. 20:45:18'
    },
    {
      id: 6,
      member: {
        memberId: 'NM000008',
        nickname: '토끼민주',
        type: '일반회원',
        status: '승인'
      },
      content: {
        type: '게시글',
        id: 'PB000004',
        board: '정치인게시판',
        title: '장대표 답변 - 정치 개혁에 대하여',
        status: '게시'
      },
      reaction: '좋아요',
      reactionDate: '25.05.28. 12:30:00'
    },
    {
      id: 7,
      member: {
        memberId: 'PM000008',
        nickname: '장대표',
        type: '정치인',
        status: '승인'
      },
      content: {
        type: '게시글',
        id: 'PB000003',
        board: '정치인게시판',
        title: '장대표님께 질문드립니다',
        status: '게시'
      },
      reaction: '좋아요',
      reactionDate: '25.05.27. 15:45:00'
    },
    {
      id: 8,
      member: {
        memberId: 'NM000008',
        nickname: '토끼민주',
        type: '일반회원',
        status: '승인'
      },
      content: {
        type: '댓글',
        id: 'PB000003-CM0001',
        board: '정치인게시판',
        title: '좋은 질문입니다. 답변 드리겠습니다.',
        status: '게시'
      },
      reaction: '좋아요',
      reactionDate: '25.05.27. 16:00:00'
    }
  ];

  const memberTypeOptions = ['전체', '일반회원', '정치인', '보좌진'];
  const contentTypeOptions = ['전체', '게시글', '댓글'];
  const boardOptions = ['전체', '자유게시판', '정치인게시판', '투표'];
  const reactionOptions = ['전체', '좋아요', '싫어요'];
  const dateTypeOptions = ['반응일시']; // LikesHistory는 반응일시만 있음
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

  const filteredHistory = sampleLikesHistory.filter(item => {
    const matchesSearch = item.member.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.member.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMemberType = memberTypeFilter === '전체' || item.member.type === memberTypeFilter;
    const matchesContentType = contentTypeFilter === '전체' || item.content.type === contentTypeFilter;
    const matchesBoard = boardFilter === '전체' || item.content.board === boardFilter;
    const matchesReaction = reactionFilter === '전체' || item.reaction === reactionFilter;
    
    // 날짜 필터링 (반응일시 기준)
    let matchesDateRange = true;
    if (dateStartDate && dateEndDate) {
      try {
        // "25.06.18. 06:32:17" 형식을 Date 객체로 변환
        const dateMatch = item.reactionDate.match(/(\d{2})\.(\d{2})\.(\d{2})\. (\d{2}):(\d{2}):(\d{2})/);
        if (dateMatch) {
          const [, year, month, day, hour, minute, second] = dateMatch;
          const reactionDate = new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day), 
                                       parseInt(hour), parseInt(minute), parseInt(second));
          
          const filterStartDate = new Date(dateStartDate);
          const filterEndDate = new Date(dateEndDate);
          filterEndDate.setHours(23, 59, 59, 999); // 해당 날짜 끝까지 포함
          
          if (!isNaN(reactionDate.getTime()) && !isNaN(filterStartDate.getTime()) && !isNaN(filterEndDate.getTime())) {
            matchesDateRange = reactionDate >= filterStartDate && reactionDate <= filterEndDate;
          }
        }
      } catch (error) {
        console.error('반응일시 변환 오류:', item.reactionDate, error);
        matchesDateRange = true; // 오류 시 포함시킴
      }
    }
    
    return matchesSearch && matchesMemberType && matchesContentType && matchesBoard && matchesReaction && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    console.log('좋아요/싫어요 이력 내보내기');
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

  const handleContentClick = (contentId: string, contentType: string, item: any) => {
    if (contentType === '게시글') {
      const postData = {
        id: contentId,
        board: item.content.board,
        title: item.content.title,
        content: '게시글 내용입니다.',
        status: item.content.status,
        author: item.member,
        stats: {
          views: 101,
          comments: 6,
          likes: 19,
          dislikes: 1,
          reports: 2
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
        content: item.content.title,
        status: item.content.status,
        author: item.member,
        post: {
          id: contentId.split('-')[0],
          board: item.content.board,
          title: '관련 게시글 제목',
          status: '게시',
          views: 101
        },
        stats: {
          likes: 5,
          dislikes: 12,
          reports: 2
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

  return (
    <div className="p-6">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">좋아요/싫어요 이력</h1>
            <p className="mt-1 text-gray-600">회원들의 좋아요/싫어요 활동 이력을 조회할 수 있습니다.</p>
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">검색</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="회원, 콘텐츠 제목 검색..."
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">반응 유형</label>
            <select
              value={reactionFilter}
              onChange={(e) => setReactionFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {reactionOptions.map(reaction => (
                <option key={reaction} value={reaction}>{reaction}</option>
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
        {(memberTypeFilter !== '전체' || contentTypeFilter !== '전체' || boardFilter !== '전체' || reactionFilter !== '전체' || periodFilter !== '전체' || dateStartDate || dateEndDate || searchTerm) && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-blue-700">적용된 필터:</span>
                {memberTypeFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    회원유형: {memberTypeFilter}
                  </span>
                )}
                {contentTypeFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    콘텐츠: {contentTypeFilter}
                  </span>
                )}
                {boardFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    게시판: {boardFilter}
                  </span>
                )}
                {reactionFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    반응: {reactionFilter}
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
                  setContentTypeFilter('전체');
                  setBoardFilter('전체');
                  setReactionFilter('전체');
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
              <h3 className="text-lg font-semibold text-gray-900">좋아요/싫어요 이력</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                총 {filteredHistory.length}개
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">좋아요/싫어요 누른 회원</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">게시글/댓글 구분</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">게시글/댓글 아이디</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">게시판</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">게시글 제목/댓글 내용</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">게시글/댓글 상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">좋아요/싫어요</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">좋아요/싫어요 일시</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedHistory.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <button
                        onClick={() => handleMemberClick(item.member)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 underline cursor-pointer"
                      >
                        {item.member.memberId}
                      </button>
                      <div className="text-sm text-gray-900">
                        {item.member.nickname}
                      </div>
                      <div className="flex space-x-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMemberTypeColor(item.member.type)}`}>
                          {item.member.type}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.member.status)}`}>
                          {item.member.status}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.content.type === '게시글' ? (
                        <FileText className="w-4 h-4 text-blue-500 mr-2" />
                      ) : (
                        <MessageCircle className="w-4 h-4 text-purple-500 mr-2" />
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        {item.content.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleContentClick(item.content.id, item.content.type, item)}
                      className="text-blue-600 hover:text-blue-800 underline font-medium text-sm"
                    >
                      {item.content.id}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded border ${getBoardColor(item.content.board)}`}>
                      {item.content.board}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-900 truncate" title={item.content.title}>
                        {item.content.title}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getContentStatusColor(item.content.status)}`}>
                      {item.content.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.reaction === '좋아요' ? (
                        <ThumbsUp className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <ThumbsDown className="w-4 h-4 text-red-500 mr-2" />
                      )}
                      <span className={`font-medium ${item.reaction === '좋아요' ? 'text-green-600' : 'text-red-600'}`}>
                        {item.reaction}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.reactionDate}
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
                <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredHistory.length)}</span>
                의
                <span className="font-medium"> {filteredHistory.length}</span>
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

export default LikesHistoryPage; 