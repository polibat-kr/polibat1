import React, { useState } from 'react';
import { openAdminPage } from '../../utils/navigation';
import { X, FileText, Eye, EyeOff, Trash2, RotateCcw, MessageCircle, Flag, ThumbsUp, ThumbsDown, User, Clock, CheckCircle, AlertTriangle, XCircle, Calendar } from 'lucide-react';

interface SuggestionDetailPopupProps {
  isVisible: boolean;
  onClose: () => void;
  suggestionData?: any;
}

const SuggestionDetailPopup: React.FC<SuggestionDetailPopupProps> = ({ 
  isVisible, 
  onClose, 
  suggestionData 
}) => {
  const [activeTab, setActiveTab] = useState('info');
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(''); // '숨김', '삭제', '재게시'
  const [actionReason, setActionReason] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('접수대기');
  const [statusDetails, setStatusDetails] = useState('');

  // 샘플 불편/제안 데이터 (props로 받은 데이터가 없을 경우 사용)
  const defaultSuggestionData = {
    id: 'RS000001',
    type: '기능제안', // '불편사항', '기능제안'
    title: '댓글 수정 기능을 추가해주세요',
    content: '댓글을 작성한 후에 오타를 발견했는데 수정할 수 없어서 불편합니다. 댓글 수정 기능이 있으면 좋겠습니다.',
    status: '게시', // '게시', '숨김', '삭제'
    processingStatus: '접수대기', // '접수대기', '검토중', '처리완료', '처리불가', '추후검토'
    processingDetails: '', // 조치 내역
    author: {
      memberId: 'NM000291',
      nickname: '블루보틀',
      type: '일반회원'
    },
    stats: {
      views: 287,
      comments: 5,
      likes: 12,
      dislikes: 1,
      reports: 0
    },
    dates: {
      created: '2025.06.02 14:25:30',
      lastModified: '2025.06.02 14:25:30'
    }
  };

  // props로 받은 suggestionData가 있으면 사용하고, 없으면 기본 데이터 사용
  const currentSuggestionData = suggestionData ? {
    id: suggestionData.suggestionId || suggestionData.id || defaultSuggestionData.id,
    type: suggestionData.type || defaultSuggestionData.type,
    title: suggestionData.title || defaultSuggestionData.title,
    content: suggestionData.content || defaultSuggestionData.content,
    status: suggestionData.status || defaultSuggestionData.status,
    processingStatus: suggestionData.actionStatus || suggestionData.processingStatus || defaultSuggestionData.processingStatus,
    processingDetails: suggestionData.actionDetails || suggestionData.processingDetails || defaultSuggestionData.processingDetails,
    author: {
      memberId: suggestionData.author?.memberId || defaultSuggestionData.author.memberId,
      nickname: suggestionData.author?.nickname || defaultSuggestionData.author.nickname,
      type: suggestionData.author?.type || defaultSuggestionData.author.type
    },
    stats: {
      views: suggestionData.views || suggestionData.stats?.views || defaultSuggestionData.stats.views,
      comments: suggestionData.commentsCount || suggestionData.stats?.comments || defaultSuggestionData.stats.comments,
      likes: suggestionData.reactions?.likes || suggestionData.stats?.likes || defaultSuggestionData.stats.likes,
      dislikes: suggestionData.reactions?.dislikes || suggestionData.stats?.dislikes || defaultSuggestionData.stats.dislikes,
      reports: suggestionData.reports || suggestionData.stats?.reports || defaultSuggestionData.stats.reports
    },
    dates: {
      created: suggestionData.dates?.created || suggestionData.createdAt || defaultSuggestionData.dates.created,
      lastModified: suggestionData.dates?.lastModified || suggestionData.updatedAt || defaultSuggestionData.dates.lastModified
    }
  } : defaultSuggestionData;

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
  };

  const handleDetailsChange = (details: string) => {
    setStatusDetails(details);
  };

  const handleSave = () => {
    if (!statusDetails.trim()) {
      alert('조치 내역을 입력해주세요.');
      return;
    }
    console.log('처리 상태 변경:', selectedStatus);
    console.log('조치 내역:', statusDetails);
  };

  const handleAction = (action: string) => {
    setActionType(action);
    setShowActionModal(true);
  };

  const handleActionConfirm = () => {
    console.log(`불편/제안 ${actionType} 처리: ${actionReason}`);
    setShowActionModal(false);
    setActionReason('');
  };

  const handleMemberClick = () => {
    openAdminPage(`/members/all?memberId=${currentSuggestionData.author.memberId}`);
  };

  const handleCommentsClick = () => {
    openAdminPage(`/comments?suggestionId=${currentSuggestionData.id}`);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case '불편사항': return 'bg-red-100 text-red-800';
      case '기능제안': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
    switch (currentSuggestionData.status) {
      case '게시':
        return (
          <>
            <button
              onClick={() => handleAction('숨김')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center"
            >
              <EyeOff className="w-4 h-4 mr-1" />
              숨김
            </button>
            <button
              onClick={() => handleAction('삭제')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-1" />
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
              <Eye className="w-4 h-4 mr-1" />
              재게시
            </button>
            <button
              onClick={() => handleAction('삭제')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-1" />
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
            <RotateCcw className="w-4 h-4 mr-1" />
            재게시
          </button>
        );
      default:
        return null;
    }
  };

  const getProcessingStatusColor = (status: string) => {
    switch (status) {
      case '접수대기': return 'bg-gray-100 text-gray-800';
      case '검토중': return 'bg-blue-100 text-blue-800';
      case '처리완료': return 'bg-green-100 text-green-800';
      case '처리불가': return 'bg-red-100 text-red-800';
      case '추후검토': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProcessingStatusIcon = (status: string) => {
    switch (status) {
      case '접수대기': return <Clock className="w-3 h-3 mr-1" />;
      case '검토중': return <AlertTriangle className="w-3 h-3 mr-1" />;
      case '처리완료': return <CheckCircle className="w-3 h-3 mr-1" />;
      case '처리불가': return <XCircle className="w-3 h-3 mr-1" />;
      case '추후검토': return <Calendar className="w-3 h-3 mr-1" />;
      default: return null;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">불편/제안 상세정보</h2>
              <p className="text-xs sm:text-sm text-gray-600">{currentSuggestionData.id} - {currentSuggestionData.type}</p>
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
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 sm:px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'info'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            기본정보
          </button>
          <button
            onClick={() => setActiveTab('processing')}
            className={`px-4 sm:px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'processing'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            처리상태
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">불편/제안 아이디</label>
                      <p className="text-gray-900 font-mono text-sm sm:text-base">{currentSuggestionData.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">유형</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(currentSuggestionData.type)}`}>
                        {currentSuggestionData.type}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(currentSuggestionData.status)}`}>
                        {currentSuggestionData.status === '게시' && <Eye className="w-3 h-3 mr-1" />}
                        {currentSuggestionData.status === '숨김' && <EyeOff className="w-3 h-3 mr-1" />}
                        {currentSuggestionData.status === '삭제' && <Trash2 className="w-3 h-3 mr-1" />}
                        {currentSuggestionData.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">처리상태</label>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getProcessingStatusColor(currentSuggestionData.processingStatus)}`}>
                        {getProcessingStatusIcon(currentSuggestionData.processingStatus)}
                        {currentSuggestionData.processingStatus}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">작성자</label>
                    <div 
                      onClick={handleMemberClick}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="p-2 bg-blue-100 rounded-full">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-900 text-sm sm:text-base">{currentSuggestionData.author.nickname}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                          <span>ID: {currentSuggestionData.author.memberId}</span>
                          <span>•</span>
                          <span>{currentSuggestionData.author.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">조회수</label>
                      <p className="text-gray-900 text-sm sm:text-base">{currentSuggestionData.stats.views.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">댓글수</label>
                      <button 
                        onClick={handleCommentsClick}
                        className="text-blue-600 hover:text-blue-800 hover:underline text-sm sm:text-base"
                      >
                        {currentSuggestionData.stats.comments}
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">좋아요</label>
                      <span className="font-medium text-green-700 text-sm">{currentSuggestionData.stats.likes}</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">싫어요</label>
                      <span className="font-medium text-red-700 text-sm">{currentSuggestionData.stats.dislikes}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">작성일시</label>
                      <p className="text-gray-900 text-sm sm:text-base">{currentSuggestionData.dates.created}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">수정일시</label>
                      <p className="text-gray-900 text-sm sm:text-base">{currentSuggestionData.dates.lastModified}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 제목 및 내용 */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{currentSuggestionData.title}</h3>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
                  <div className="text-gray-900 whitespace-pre-wrap">{currentSuggestionData.content}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'processing' && (
            <div className="space-y-6">
              {/* 현재 처리 상태 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-blue-900">현재 처리 상태</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getProcessingStatusColor(currentSuggestionData.processingStatus)}`}>
                      {getProcessingStatusIcon(currentSuggestionData.processingStatus)}
                      {currentSuggestionData.processingStatus}
                    </span>
                  </div>
                </div>
                {currentSuggestionData.processingDetails && (
                  <div className="mt-3 p-3 bg-blue-100 rounded">
                    <label className="block text-sm font-medium text-blue-900 mb-1">조치 내역</label>
                    <p className="text-blue-900 text-sm">{currentSuggestionData.processingDetails}</p>
                  </div>
                )}
              </div>

              {/* 처리 상태 변경 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">처리 상태 변경</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">새로운 처리 상태</label>
                    <div className="space-y-2">
                      {['접수대기', '검토중', '처리완료', '처리불가', '추후검토'].map(status => (
                        <label key={status} className="flex items-center">
                          <input
                            type="radio"
                            name="processingStatus"
                            value={status}
                            checked={selectedStatus === status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="mr-2"
                          />
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getProcessingStatusColor(status)}`}>
                            {getProcessingStatusIcon(status)}
                            {status}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">조치 내역</label>
                    <textarea
                      value={statusDetails}
                      onChange={(e) => handleDetailsChange(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={4}
                      placeholder="처리 상태 변경에 대한 상세 내역을 입력해주세요..."
                    />
                  </div>

                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    저장
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 하단 액션 버튼 */}
        <div className="border-t border-gray-200 px-4 sm:px-6 py-4 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3">
            {getActionButtons()}
          </div>
        </div>
      </div>

      {/* 액션 확인 모달 */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">불편/제안 {actionType}</h3>
            <p className="text-gray-600 mb-4">
              <strong>조치 대상:</strong> {currentSuggestionData.title}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">사유</label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
                placeholder={`${actionType} 사유를 입력해주세요...`}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowActionModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleActionConfirm}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestionDetailPopup; 
