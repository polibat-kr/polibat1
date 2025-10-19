import React, { useState } from 'react';
import { openAdminPage } from '../../utils/navigation';
import { X, User, Calendar, MessageCircle, ThumbsUp, ThumbsDown, Flag, Vote, FileText, CheckCircle, Clock, AlertCircle, ExternalLink, Bell, BellOff } from 'lucide-react';

interface MemberDetailPopupProps {
  isVisible: boolean;
  onClose: () => void;
  memberData?: any;
}

const MemberDetailPopup: React.FC<MemberDetailPopupProps> = ({ 
  isVisible, 
  onClose, 
  memberData 
}) => {
  const [activeTab, setActiveTab] = useState('info');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [approvalType, setApprovalType] = useState(''); // 'approve' or 'reject'
  const [suspensionDays, setSuspensionDays] = useState('');
  const [actionReason, setActionReason] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [statusChangeReason, setStatusChangeReason] = useState('');
  const [politicianType, setPoliticianType] = useState('');

  // 샘플 회원 데이터 (props로 받은 member가 없을 경우 사용)
  const defaultMemberData = {
    id: 'PA000008',
    memberId: 'PA000008',
    nickname: '김보좌',
    type: '보좌진',
    status: '승인대기',
    joinDate: '2025.05.02',
    lastLogin: '2025.05.31',
    // 정치방망이 알림 설정
    notificationSettings: {
      polibatNotification: true // true: ON, false: OFF
    },
    // 정치인 관련 정보
    politician: {
      politicianName: '김대표',
      party: '국민의힘',
      politicianType: '국회의원', // 운영자가 승인시 선택
      officialEmail: 'kimbo@assembly.go.kr' // 공식 도메인 이메일
    },
    activities: {
      posts: 2,
      comments: 5,
      votes: 3,
      likesGiven: { posts: 12, comments: 10 },
      dislikesGiven: { posts: 2, comments: 3 },
      reportsGiven: { posts: 1, comments: 0 },
      reported: { posts: 0, comments: 0 }
    },
    application: {
      politicianName: '김대표',
      party: '국민의힘',
      officialEmail: 'kimbo@assembly.go.kr', // 공식 도메인 이메일
      appliedDate: '2025.05.02'
    }
  };

  // props로 받은 memberData가 있으면 그것을 사용, 없으면 기본 데이터 사용
  const currentMemberData = memberData ? {
    id: memberData.memberId || memberData.id || defaultMemberData.id,
    memberId: memberData.memberId || memberData.id || defaultMemberData.id,
    nickname: memberData.nickname || defaultMemberData.nickname,
    type: memberData.type || defaultMemberData.type,
    status: memberData.status || defaultMemberData.status,
    joinDate: memberData.joinDate || defaultMemberData.joinDate,
    lastLogin: memberData.lastLogin || defaultMemberData.lastLogin,
    notificationSettings: {
      polibatNotification: memberData.notificationSettings?.polibatNotification ?? defaultMemberData.notificationSettings.polibatNotification
    },
    politician: {
      politicianName: memberData.politician?.politicianName || defaultMemberData.politician.politicianName,
      party: memberData.politician?.party || defaultMemberData.politician.party,
      politicianType: memberData.politician?.politicianType || defaultMemberData.politician.politicianType,
      officialEmail: memberData.politician?.officialEmail || defaultMemberData.politician.officialEmail
    },
    activities: {
      posts: memberData.activities?.posts || defaultMemberData.activities.posts,
      comments: memberData.activities?.comments || defaultMemberData.activities.comments,
      votes: memberData.activities?.votes || defaultMemberData.activities.votes,
      likesGiven: { 
        posts: memberData.activities?.likesGiven?.posts || defaultMemberData.activities.likesGiven.posts, 
        comments: memberData.activities?.likesGiven?.comments || defaultMemberData.activities.likesGiven.comments 
      },
      dislikesGiven: { 
        posts: memberData.activities?.dislikesGiven?.posts || defaultMemberData.activities.dislikesGiven.posts, 
        comments: memberData.activities?.dislikesGiven?.comments || defaultMemberData.activities.dislikesGiven.comments 
      },
      reportsGiven: { 
        posts: memberData.activities?.reportsGiven?.posts || defaultMemberData.activities.reportsGiven.posts, 
        comments: memberData.activities?.reportsGiven?.comments || defaultMemberData.activities.reportsGiven.comments 
      },
      reported: { 
        posts: memberData.activities?.reported?.posts || defaultMemberData.activities.reported.posts, 
        comments: memberData.activities?.reported?.comments || defaultMemberData.activities.reported.comments 
      }
    },
    application: {
      politicianName: memberData.application?.politicianName || defaultMemberData.application.politicianName,
      party: memberData.application?.party || defaultMemberData.application.party,
      officialEmail: memberData.application?.officialEmail || defaultMemberData.application.officialEmail,
      appliedDate: memberData.application?.appliedDate || defaultMemberData.application.appliedDate
    }
  } : defaultMemberData;

  // 게시판별 활동 통계 생성 (실제 데이터 기반)
  const getBoardStats = () => {
    const memberId = currentMemberData.memberId || currentMemberData.id;
    
    // 현재 회원이 토끼민주(NM000008)이거나 장대표(PM000008)인 경우 실제 데이터 반영
    if (memberId === 'NM000008') {
      return [
        { board: '자유게시판', posts: 1, comments: 1 },
        { board: '정치방망이!', posts: 1, comments: 1 },
        { board: '투표', posts: 0, comments: 0 },
        { board: '불편/제안 접수', posts: 0, comments: 0 }
      ];
    } else if (memberId === 'PM000008') {
      return [
        { board: '자유게시판', posts: 0, comments: 0 },
        { board: '정치방망이!', posts: 1, comments: 1 },
        { board: '투표', posts: 0, comments: 0 },
        { board: '불편/제안 접수', posts: 0, comments: 0 }
      ];
    } else {
      // 기본 샘플 데이터
      return [
        { board: '자유게시판', posts: 1, comments: 2 },
        { board: '정치방망이!', posts: 1, comments: 3 },
        { board: '투표', posts: 0, comments: 0 },
        { board: '불편/제안 접수', posts: 0, comments: 0 }
      ];
    }
  };
  
  const boardStats = getBoardStats();

  const voteData = [
    { 
      id: 1, 
      voteId: 'VP000001', 
      title: '2025년 예산안에 대한 의견', 
      status: '마감', 
      result: '찬성', 
      voteDate: '2025.05.15 14:30' 
    },
    { 
      id: 2, 
      voteId: 'VP000002', 
      title: '지역 개발 계획 찬반', 
      status: '진행', 
      result: '반대', 
      voteDate: '2025.05.20 09:15' 
    },
    { 
      id: 3, 
      voteId: 'VP000003', 
      title: '환경보호법 개정안', 
      status: '마감', 
      result: '찬성', 
      voteDate: '2025.05.25 16:45' 
    }
  ];

  const handleApproval = (approved: boolean) => {
    console.log(`회원 ${approved ? '승인' : '거부'} 처리`);
    if (approved && politicianType) {
              console.log(`정치인 유형: ${politicianType}`);
      console.log('승인 이메일 발송');
    } else if (!approved && rejectReason) {
      console.log(`거부 사유: ${rejectReason}`);
      console.log('거부 이메일 발송');
    }
    setShowApprovalModal(false);
    setPoliticianType('');
    setRejectReason('');
  };

  const handleMemberAction = () => {
    console.log(`회원 ${actionType} 처리: ${actionReason}`);
    if (actionType === '정지' && suspensionDays) {
      console.log(`정지 기간: ${suspensionDays}일`);
    }
    setShowActionModal(false);
    setActionReason('');
    setSuspensionDays('');
  };

  const handleStatusChange = () => {
    console.log(`회원 상태 변경 처리: 승인 → 승인대기`);
    console.log(`변경 사유: ${statusChangeReason}`);
    // 실제 구현시 API 호출
    setShowStatusChangeModal(false);
    setStatusChangeReason('');
  };

  const handleBoardClick = (board: string, type: string, count: number) => {
    if (count === 0) return;
    
    const memberId = currentMemberData.memberId || currentMemberData.id;
    
    if (type === '게시글') {
      // 전체인 경우 게시판 필터 없이, 특정 게시판인 경우 게시판 필터 포함
      const url = board === '전체' 
        ? `/posts?memberId=${memberId}` 
        : `/posts?memberId=${memberId}&board=${board}`;
      openAdminPage(url);
    } else if (type === '댓글') {
      // 전체인 경우 게시판 필터 없이, 특정 게시판인 경우 게시판 필터 포함
      const url = board === '전체' 
        ? `/comments?memberId=${memberId}` 
        : `/comments?memberId=${memberId}&board=${board}`;
      openAdminPage(url);
    }
  };

  const handleActivityClick = (activityType: string) => {
    const memberId = currentMemberData.memberId || currentMemberData.id;
    
    if (activityType === '좋아요 누른 게시글/댓글') {
      openAdminPage(`/likes-history?memberId=${memberId}&type=좋아요`);
    } else if (activityType === '싫어요 누른 게시글/댓글') {
      openAdminPage(`/likes-history?memberId=${memberId}&type=싫어요`);
    } else if (activityType === '신고한 게시글/댓글') {
      openAdminPage(`/reports?memberId=${memberId}&type=신고함`);
    } else if (activityType === '신고받은 게시글/댓글') {
      openAdminPage(`/reports?memberId=${memberId}&type=신고받음`);
    }
  };

  const handleVoteClick = (voteId: string) => {
    openAdminPage(`/votes?voteId=${voteId}`);
  };

  const handleVotesClick = () => {
    const memberId = currentMemberData.memberId || currentMemberData.id;
    openAdminPage(`/votes-history?memberId=${memberId}`);
  };

  const handleClose = () => {
    onClose();
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <User className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">회원 상세정보</h2>
              <p className="text-sm text-gray-600">{currentMemberData.id} - {currentMemberData.nickname}</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {[
            { id: 'info', label: '기본정보', icon: User },
            { id: 'activity', label: '활동내역', icon: MessageCircle },
            { id: 'votes', label: '투표내역', icon: Vote },
            { id: 'approval', label: '가입신청', icon: FileText, show: currentMemberData.status === '승인대기' }
          ].filter(tab => tab.show !== false).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">회원 아이디</label>
                    <p className="text-gray-900">{currentMemberData.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
                    <p className="text-gray-900">{currentMemberData.nickname}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">회원유형</label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {currentMemberData.type}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">정치방망이 알림</label>
                    <div className="flex items-center space-x-2">
                      {currentMemberData.notificationSettings?.polibatNotification ? (
                        <>
                          <Bell className="w-4 h-4 text-green-600" />
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ON
                          </span>
                        </>
                      ) : (
                        <>
                          <BellOff className="w-4 h-4 text-red-600" />
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            OFF
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">회원상태</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      currentMemberData.status === '승인대기' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {currentMemberData.status === '승인대기' ? <Clock className="w-3 h-3 mr-1" /> : <CheckCircle className="w-3 h-3 mr-1" />}
                      {currentMemberData.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">가입일</label>
                    <p className="text-gray-900">{currentMemberData.joinDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">최근접속일</label>
                    <p className="text-gray-900">{currentMemberData.lastLogin}</p>
                  </div>
                </div>
              </div>

              {/* 정치인 관련 정보 */}
              {currentMemberData.type.includes('정치인') && currentMemberData.status !== '승인대기' && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 text-blue-900">정치인 정보</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">보좌하는 정치인</label>
                      <p className="text-blue-900 font-medium">{currentMemberData.politician?.politicianName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">정당/소속</label>
                      <p className="text-blue-900">{currentMemberData.politician?.party}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">정치인 유형</label>
                      <p className="text-blue-900">{currentMemberData.politician?.politicianType}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">공식 이메일</label>
                      <p className="text-blue-900">{currentMemberData.politician?.officialEmail}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 회원 조치 버튼 */}
              <div className="flex space-x-3 pt-4 border-t">
                {/* 승인된 정치인/보좌진의 경우 승인대기로 변경 버튼 표시 */}
                {currentMemberData.status === '승인' && (currentMemberData.type === '정치인' || currentMemberData.type === '보좌진') && (
                  <button
                    onClick={() => setShowStatusChangeModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    승인대기로 변경
                  </button>
                )}
                <button
                  onClick={() => { setActionType('정지'); setShowActionModal(true); }}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  정지
                </button>
                <button
                  onClick={() => { setActionType('강퇴'); setShowActionModal(true); }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  강퇴
                </button>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              {/* 게시판별 활동 */}
              <div>
                <h3 className="text-lg font-semibold mb-3">게시판별 활동</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">게시판</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">게시글 수</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">댓글 수</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {boardStats.map((board, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{board.board}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleBoardClick(board.board, '게시글', board.posts)}
                              className={`${board.posts > 0 ? 'text-blue-600 hover:text-blue-800 italic underline' : 'text-gray-500'}`}
                              disabled={board.posts === 0}
                            >
                              {board.posts}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleBoardClick(board.board, '댓글', board.comments)}
                              className={`${board.comments > 0 ? 'text-blue-600 hover:text-blue-800 italic underline' : 'text-gray-500'}`}
                              disabled={board.comments === 0}
                            >
                              {board.comments}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 전체 작성 통계 */}
              <div>
                <h3 className="text-lg font-semibold mb-3">작성 통계</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors">
                    <button
                      onClick={() => handleBoardClick('전체', '게시글', currentMemberData.activities?.posts || 0)}
                      className="w-full text-left"
                    >
                      <p className="text-sm text-blue-600 mb-2">작성한 게시글</p>
                      <p className="text-xl font-bold text-blue-700 italic underline">
                        {currentMemberData.activities?.posts || 0}개
                      </p>
                    </button>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:bg-purple-100 transition-colors">
                    <button
                      onClick={() => handleBoardClick('전체', '댓글', currentMemberData.activities?.comments || 0)}
                      className="w-full text-left"
                    >
                      <p className="text-sm text-purple-600 mb-2">작성한 댓글</p>
                      <p className="text-xl font-bold text-purple-700 italic underline">
                        {currentMemberData.activities?.comments || 0}개
                      </p>
                    </button>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 hover:bg-indigo-100 transition-colors">
                    <button
                      onClick={() => handleVotesClick()}
                      className="w-full text-left"
                    >
                      <p className="text-sm text-indigo-600 mb-2">참여한 투표</p>
                      <p className="text-xl font-bold text-indigo-700 italic underline">
                        {currentMemberData.activities?.votes || 0}개
                      </p>
                    </button>
                  </div>
                </div>
              </div>

              {/* 반응 통계 */}
              <div>
                <h3 className="text-lg font-semibold mb-3">반응 통계</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition-colors">
                    <button
                      onClick={() => handleActivityClick('좋아요 누른 게시글/댓글')}
                      className="w-full text-left"
                    >
                      <p className="text-sm text-green-600 mb-2">좋아요 누른 게시글(댓글)</p>
                      <p className="text-xl font-bold text-green-700 italic underline">
                        {currentMemberData.activities?.likesGiven?.posts}({currentMemberData.activities?.likesGiven?.comments})
                      </p>
                    </button>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 hover:bg-red-100 transition-colors">
                    <button
                      onClick={() => handleActivityClick('싫어요 누른 게시글/댓글')}
                      className="w-full text-left"
                    >
                      <p className="text-sm text-red-600 mb-2">싫어요 누른 게시글(댓글)</p>
                      <p className="text-xl font-bold text-red-700 italic underline">
                        {currentMemberData.activities?.dislikesGiven?.posts}({currentMemberData.activities?.dislikesGiven?.comments})
                      </p>
                    </button>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 hover:bg-orange-100 transition-colors">
                    <button
                      onClick={() => handleActivityClick('신고한 게시글/댓글')}
                      className="w-full text-left"
                    >
                      <p className="text-sm text-orange-600 mb-2">신고한 게시글(댓글)</p>
                      <p className="text-xl font-bold text-orange-700 italic underline">
                        {currentMemberData.activities?.reportsGiven?.posts}({currentMemberData.activities?.reportsGiven?.comments})
                      </p>
                    </button>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <button
                      onClick={() => handleActivityClick('신고받은 게시글/댓글')}
                      className="w-full text-left"
                    >
                      <p className="text-sm text-gray-600 mb-2">신고받은 게시글(댓글)</p>
                      <p className="text-xl font-bold text-gray-700 italic underline">
                        {currentMemberData.activities?.reported?.posts}({currentMemberData.activities?.reported?.comments})
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'votes' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">참여한 투표 목록</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">번호</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">투표 아이디</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">투표 제목</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">투표상태</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">투표결과</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">투표일시</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {voteData.map((vote) => (
                      <tr key={vote.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vote.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleVoteClick(vote.voteId)}
                            className="text-blue-600 hover:text-blue-800 italic underline font-medium"
                          >
                            {vote.voteId}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{vote.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            vote.status === '진행' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {vote.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            vote.result === '찬성' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {vote.result}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vote.voteDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'approval' && currentMemberData.status === '승인대기' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="text-yellow-800 font-medium">정치인 가입 승인 대기 중</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">신청일</label>
                    <p className="text-gray-900">{currentMemberData.application?.appliedDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">보좌하는 정치인</label>
                    <p className="text-gray-900">{currentMemberData.application?.politicianName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">정당/소속</label>
                    <p className="text-gray-900">{currentMemberData.application?.party}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">공식 이메일</label>
                    <p className="text-gray-900">{currentMemberData.application?.officialEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">정치인 유형 (운영자 선택)</label>
                    <select
                      value={politicianType}
                      onChange={(e) => setPoliticianType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">선택하세요</option>
                      <option value="국회의원">국회의원</option>
                      <option value="대통령실">대통령실</option>
                      <option value="국무총리실">국무총리실</option>
                      <option value="부처">부처</option>
                      <option value="지방자치단체">지방자치단체</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t">
                <button
                  onClick={() => { setApprovalType('approve'); setShowApprovalModal(true); }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  승인
                </button>
                <button
                  onClick={() => { setApprovalType('reject'); setShowApprovalModal(true); }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  거부
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 승인/거부 확인 모달 */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              가입 신청 {approvalType === 'approve' ? '승인' : '거부'}
            </h3>
            
            {approvalType === 'approve' ? (
              <div>
                {!politicianType && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                          <p className="text-sm text-yellow-800">정치인 유형을 먼저 선택해주세요.</p>
                  </div>
                )}
                <p className="text-gray-600 mb-4">
                  정치인 가입 신청을 승인하시겠습니까?
                  {politicianType && <span className="block mt-2 text-sm text-blue-600">정치인 유형: {politicianType}</span>}
                </p>
                <div className="bg-blue-50 p-3 rounded-lg mb-6">
                  <p className="text-sm text-blue-700">
                    ✓ 승인 시 대상자에게 승인 완료 메일이 발송됩니다.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleApproval(true)}
                    disabled={!politicianType}
                    className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                      politicianType 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    승인 확정
                  </button>
                  <button
                    onClick={() => setShowApprovalModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">가입 신청을 거부하시겠습니까?</p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">거부 사유</label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="거부 사유를 입력하세요"
                  />
                </div>
                <div className="bg-red-50 p-3 rounded-lg mb-6">
                  <p className="text-sm text-red-700">
                    ✓ 거부 시 입력한 사유와 함께 대상자에게 거부 메일이 발송됩니다.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleApproval(false)}
                    disabled={!rejectReason.trim()}
                    className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                      rejectReason.trim() 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    거부 확정
                  </button>
                  <button
                    onClick={() => setShowApprovalModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 회원 조치 모달 */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">회원 조치 사유 입력</h3>
            
            {actionType === '정지' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">정지 기간 (일)</label>
                <input
                  type="number"
                  value={suspensionDays}
                  onChange={(e) => setSuspensionDays(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="정지 기간을 입력하세요"
                />
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {actionType} 사유
              </label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="조치 사유를 입력하세요"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleMemberAction}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                  actionType === '정지' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionType}
              </button>
              <button
                onClick={() => setShowActionModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 상태 변경 모달 */}
      {showStatusChangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">회원상태 변경</h3>
            
            <div className="mb-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-blue-600">현재 상태:</span>
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      승인
                    </span>
                  </div>
                  <div className="text-blue-400">→</div>
                  <div>
                    <span className="text-sm text-blue-600">변경 후:</span>
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Clock className="w-3 h-3 mr-1" />
                      승인대기
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">변경 사유</label>
              <textarea
                value={statusChangeReason}
                onChange={(e) => setStatusChangeReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="상태 변경 사유를 입력하세요 (예: 소속 정치인 변경, 신분 재확인 필요 등)"
              />
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6">
              <div className="flex items-start">
                <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 mr-2" />
                <div className="text-sm text-orange-700">
                  <p className="font-medium mb-1">상태 변경 안내</p>
                  <ul className="text-xs space-y-1">
                    <li>• 승인대기로 변경 시 해당 회원의 활동이 제한됩니다.</li>                    
                    <li>• 추후 재승인 절차를 통해 다시 활동할 수 있습니다.</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleStatusChange}
                disabled={!statusChangeReason.trim()}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                  statusChangeReason.trim() 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                승인대기로 변경
              </button>
              <button
                onClick={() => setShowStatusChangeModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDetailPopup; 