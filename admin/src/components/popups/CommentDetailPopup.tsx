import React, { useState } from 'react';
import { openAdminPage } from '../../utils/navigation';
import { X, MessageCircle, Eye, EyeOff, Trash2, RotateCcw, FileText, Flag, ThumbsUp, ThumbsDown, Calendar, User, ExternalLink } from 'lucide-react';

interface CommentDetailPopupProps {
  isVisible: boolean;
  onClose: () => void;
  commentData?: any;
}

const CommentDetailPopup: React.FC<CommentDetailPopupProps> = ({ 
  isVisible, 
  onClose, 
  commentData 
}) => {
  const [activeTab, setActiveTab] = useState('info');
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(''); // '숨김', '삭제', '재게시'
  const [actionReason, setActionReason] = useState('');

  // 신고 이력 데이터
  const reportData = [
    {
      id: 1,
      reporter: {
        memberId: 'NM000123',
        nickname: '일반회원1',
        type: '일반회원',
        status: '승인'
      },
      reportReason: '욕설/비하발언이 포함되어 있어 신고합니다.',
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
      reportReason: '선정적 내용',
      reportDate: '25.06.18. 06:32:57'
    }
  ];

  // 샘플 댓글 데이터 (props로 받은 데이터가 없을 경우 사용)
  const defaultCommentData = {
    id: 'FB000001-CM0001',
    content: '넌 잘났냐',
    status: '게시', // '게시', '숨김', '삭제'
    author: {
      memberId: 'NM000291',
      nickname: '블루보틀',
      type: '일반회원'
    },
    post: {
      id: 'FB000001',
      board: '자유게시판',
      title: '어떤 글 입니다',
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

  // props로 받은 commentData가 있으면 사용하고, 없으면 기본 데이터 사용
  const currentCommentData = commentData ? {
    id: commentData.comment?.commentId || commentData.commentId || commentData.id || defaultCommentData.id,
    content: commentData.comment?.content || commentData.content || defaultCommentData.content,
    status: commentData.comment?.status || commentData.status || defaultCommentData.status,
    author: {
      memberId: commentData.comment?.author?.memberId || commentData.author?.memberId || defaultCommentData.author.memberId,
      nickname: commentData.comment?.author?.nickname || commentData.author?.nickname || defaultCommentData.author.nickname,
      type: commentData.comment?.author?.type || commentData.author?.type || defaultCommentData.author.type
    },
    post: {
      id: commentData.post?.postId || commentData.post?.id || defaultCommentData.post.id,
      board: commentData.post?.board || defaultCommentData.post.board,
      title: commentData.post?.title || defaultCommentData.post.title,
      status: commentData.post?.status || defaultCommentData.post.status,
      views: commentData.post?.views || defaultCommentData.post.views
    },
    stats: {
      likes: commentData.comment?.likes || commentData.likes || commentData.stats?.likes || 0,
      dislikes: commentData.comment?.dislikes || commentData.dislikes || commentData.stats?.dislikes || 0,
      reports: commentData.comment?.reports || commentData.reports || commentData.stats?.reports || 0
    },
    dates: {
      created: commentData.comment?.createdAt || commentData.createdAt || commentData.dates?.created || defaultCommentData.dates.created,
      lastModified: commentData.comment?.updatedAt || commentData.updatedAt || commentData.dates?.lastModified || defaultCommentData.dates.lastModified
    }
  } : defaultCommentData;

  const handleAction = (action: string) => {
    setActionType(action);
    setShowActionModal(true);
  };

  const handleActionConfirm = () => {
    console.log(`댓글 ${actionType} 처리: ${actionReason}`);
    console.log(`댓글 ID: ${currentCommentData.id}`);
    setShowActionModal(false);
    setActionReason('');
  };

  const handleLikesClick = () => {
    openAdminPage(`/likes-history?commentId=${currentCommentData.id}&type=좋아요`);
  };

  const handleDislikesClick = () => {
    openAdminPage(`/likes-history?commentId=${currentCommentData.id}&type=싫어요`);
  };

  const handleAuthorClick = () => {
    openAdminPage(`/members/all?memberId=${currentCommentData.author.memberId}`);
  };

  const handlePostClick = () => {
    openAdminPage(`/posts?postId=${currentCommentData.post.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '게시': return 'bg-green-100 text-green-800';
      case '숨김': return 'bg-yellow-100 text-yellow-800';
      case '삭제': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionButtons = () => {
    switch (currentCommentData.status) {
      case '게시':
        return (
          <>
            <button
              onClick={() => handleAction('숨김')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center"
            >
              <EyeOff className="w-4 h-4 mr-2" />
              숨김
            </button>
            <button
              onClick={() => handleAction('삭제')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              삭제
            </button>
          </>
        );
      case '숨김':
        return (
          <>
            <button
              onClick={() => handleAction('재게시')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              재게시
            </button>
            <button
              onClick={() => handleAction('삭제')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              삭제
            </button>
          </>
        );
      case '삭제':
        return (
          <button
            onClick={() => handleAction('재게시')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            재게시
          </button>
        );
      default:
        return null;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">댓글 상세정보</h2>
              <p className="text-xs sm:text-sm text-gray-600">{currentCommentData.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </button>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {[
            { id: 'info', label: '기본정보', icon: MessageCircle },
            { id: 'reports', label: `신고이력 (${reportData.length}건)`, icon: Flag }
          ].map(tab => (
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
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'info' && (
            <div className="space-y-4 sm:space-y-6">
              {/* 댓글 기본 정보 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">댓글 아이디</label>
                  <p className="text-gray-900 font-mono text-sm sm:text-base">{currentCommentData.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">댓글 상태</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(currentCommentData.status)}`}>
                    {currentCommentData.status === '게시' && <Eye className="w-3 h-3 mr-1" />}
                    {currentCommentData.status === '숨김' && <EyeOff className="w-3 h-3 mr-1" />}
                    {currentCommentData.status === '삭제' && <Trash2 className="w-3 h-3 mr-1" />}
                    {currentCommentData.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">받은 반응</label>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="w-4 h-4 text-green-600" />
                      <button
                        onClick={handleLikesClick}
                        className="font-medium text-green-700 text-sm italic underline hover:text-green-800"
                      >
                        {currentCommentData.stats.likes}
                      </button>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsDown className="w-4 h-4 text-red-600" />
                      <button
                        onClick={handleDislikesClick}
                        className="font-medium text-red-700 text-sm italic underline hover:text-red-800"
                      >
                        {currentCommentData.stats.dislikes}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 작성자 정보 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">작성자</label>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-gray-900 text-sm sm:text-base">{currentCommentData.author.nickname}</span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    (<button
                      onClick={handleAuthorClick}
                      className="text-blue-600 hover:text-blue-800 italic underline font-medium"
                    >
                      {currentCommentData.author.memberId}
                    </button>)
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {currentCommentData.author.type}
                  </span>
                </div>
              </div>

              {/* 관련 게시글 정보 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-700 mb-3">관련 게시글</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-blue-600 mb-1">게시글 아이디</label>
                    <button
                      onClick={handlePostClick}
                      className="text-blue-800 font-mono text-sm italic underline hover:text-blue-900"
                    >
                      {currentCommentData.post.id}
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-blue-600 mb-1">게시판</label>
                    <p className="text-blue-800 text-sm">{currentCommentData.post.board}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-blue-600 mb-1">게시글 제목</label>
                    <p className="text-blue-800 text-sm">{currentCommentData.post.title}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-blue-600 mb-1">게시글 상태</label>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(currentCommentData.post.status)}`}>
                      {currentCommentData.post.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-blue-600 mb-1">조회수</label>
                    <p className="text-blue-800 text-sm">{currentCommentData.post.views.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* 날짜 정보 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">작성일</label>
                  <p className="text-gray-900 text-sm sm:text-base">{currentCommentData.dates.created}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">최종수정일</label>
                  <p className="text-gray-900 text-sm sm:text-base">{currentCommentData.dates.lastModified}</p>
                </div>
              </div>

              {/* 댓글 내용 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">댓글 내용</label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[100px]">
                  <div className="text-gray-900 whitespace-pre-wrap">{currentCommentData.content}</div>
                </div>
              </div>

              {/* 댓글 조치 버튼 */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                {getActionButtons()}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">신고 이력</h3>
                <span className="text-sm text-gray-500">총 {reportData.length}건</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">번호</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">신고한 회원</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신고사유</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">신고일시</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.map((report, index) => (
                      <tr key={report.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="text-gray-900">{report.reporter.nickname}</div>
                            <div className="text-gray-500">
                              (<button
                                onClick={() => console.log(`회원 상세정보 팝업 열기 - 회원 ID: ${report.reporter.memberId}`)}
                                className="text-blue-600 hover:text-blue-800 italic underline font-medium"
                              >
                                {report.reporter.memberId}
                              </button>) {report.reporter.type}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="max-w-xs break-words">{report.reportReason}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.reportDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 댓글 조치 버튼 - 신고이력 탭에서도 표시 */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                {getActionButtons()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 댓글 조치 사유 입력 모달 */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">댓글 조치 사유 입력</h3>
            
            <div className="mb-4">
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-blue-700">
                  <strong>조치 대상:</strong> {currentCommentData.content}
                </p>
                <p className="text-sm text-blue-700">
                  <strong>조치 내용:</strong> {actionType}
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {actionType} 사유
              </label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="조치 사유를 입력하세요"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleActionConfirm}
                disabled={!actionReason.trim()}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium ${
                  actionReason.trim()
                    ? actionType === '삭제' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : actionType === '숨김'
                      ? 'bg-yellow-600 hover:bg-yellow-700'
                      : 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {actionType} 확정
              </button>
              <button
                onClick={() => setShowActionModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm font-medium"
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

export default CommentDetailPopup; 