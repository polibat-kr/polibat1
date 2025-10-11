import React, { useState } from 'react';
import { X, Monitor, Eye, EyeOff, Trash2, RotateCcw, Calendar, User, Settings } from 'lucide-react';

interface PopupDetailPopupProps {
  isVisible: boolean;
  onClose: () => void;
  popupData?: any;
}

const PopupDetailPopup: React.FC<PopupDetailPopupProps> = ({ 
  isVisible, 
  onClose, 
  popupData 
}) => {
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionReason, setActionReason] = useState('');

  // 기본 팝업 데이터
  const defaultPopupData = {
    id: 'PP000001',
    title: '시스템 점검 안내',
    content: '안녕하세요. 서비스 개선을 위해 시스템 점검을 실시합니다.\n\n• 점검 일시: 2025년 1월 15일 새벽 2시 ~ 6시\n• 점검 내용: 서버 업그레이드 및 보안 패치\n\n점검 시간 동안 서비스 이용이 제한될 수 있습니다.\n이용에 불편을 드려 죄송합니다.',
    status: '활성', // '활성', '비활성', '삭제'
    type: '공지사항', // '공지사항', '이벤트', '광고'
    displayDuration: {
      start: '2025.01.10 09:00',
      end: '2025.01.20 18:00'
    },
    targetUsers: '전체', // '전체', '일반회원', '정치인'
    position: '중앙팝업', // '중앙팝업', '상단배너', '하단배너', '사이드배너'
    stats: {
      views: 1247,
      clicks: 89,
      closes: 1158
    },
    settings: {
      showToday: true, // 오늘 하루 안보기 버튼 표시
      autoClose: false, // 자동 닫기
      autoCloseTime: 5 // 자동 닫기 시간(초)
    },
    dates: {
      created: '2025.01.10 09:00:00',
      lastModified: '2025.01.10 09:00:00'
    },
    creator: {
      id: 'ADMIN001',
      name: '관리자'
    }
  };

  const currentPopupData = popupData ? {
    id: popupData.popupId || popupData.id || defaultPopupData.id,
    title: popupData.title || defaultPopupData.title,
    content: popupData.content || defaultPopupData.content,
    status: popupData.status || defaultPopupData.status,
    type: popupData.type || defaultPopupData.type,
    displayDuration: {
      start: popupData.displayDuration?.start || popupData.startDate || defaultPopupData.displayDuration.start,
      end: popupData.displayDuration?.end || popupData.endDate || defaultPopupData.displayDuration.end
    },
    targetUsers: popupData.targetUsers || defaultPopupData.targetUsers,
    position: popupData.position || defaultPopupData.position,
    stats: {
      views: popupData.stats?.views || popupData.views || defaultPopupData.stats.views,
      clicks: popupData.stats?.clicks || popupData.clicks || defaultPopupData.stats.clicks,
      closes: popupData.stats?.closes || popupData.closes || defaultPopupData.stats.closes
    },
    settings: {
      showToday: popupData.settings?.showToday ?? popupData.showToday ?? defaultPopupData.settings.showToday,
      autoClose: popupData.settings?.autoClose ?? popupData.autoClose ?? defaultPopupData.settings.autoClose,
      autoCloseTime: popupData.settings?.autoCloseTime || popupData.autoCloseTime || defaultPopupData.settings.autoCloseTime
    },
    dates: {
      created: popupData.dates?.created || popupData.createdAt || popupData.created || defaultPopupData.dates.created,
      lastModified: popupData.dates?.lastModified || popupData.updatedAt || popupData.updated || defaultPopupData.dates.lastModified
    },
    creator: {
      id: popupData.creator?.id || popupData.creatorId || defaultPopupData.creator.id,
      name: popupData.creator?.name || popupData.creatorName || defaultPopupData.creator.name
    }
  } : defaultPopupData;

  const handleAction = (action: string) => {
    setActionType(action);
    setShowActionModal(true);
  };

  const handleActionConfirm = () => {
    console.log(`팝업 ${actionType} 처리: ${actionReason}`);
    setShowActionModal(false);
    setActionReason('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '활성': return 'bg-green-100 text-green-800';
      case '비활성': return 'bg-yellow-100 text-yellow-800';
      case '삭제': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case '공지사항': return 'bg-blue-100 text-blue-800';
      case '이벤트': return 'bg-purple-100 text-purple-800';
      case '광고': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Monitor className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">팝업 상세정보</h2>
              <p className="text-xs sm:text-sm text-gray-600">{currentPopupData.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">팝업 아이디</label>
                    <p className="text-gray-900 font-mono text-sm sm:text-base">{currentPopupData.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(currentPopupData.status)}`}>
                      {currentPopupData.status === '활성' && <Eye className="w-3 h-3 mr-1" />}
                      {currentPopupData.status === '비활성' && <EyeOff className="w-3 h-3 mr-1" />}
                      {currentPopupData.status === '삭제' && <Trash2 className="w-3 h-3 mr-1" />}
                      {currentPopupData.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">유형</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(currentPopupData.type)}`}>
                      {currentPopupData.type}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">위치</label>
                    <p className="text-gray-900 text-sm">{currentPopupData.position}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">대상 사용자</label>
                  <p className="text-gray-900 text-sm">{currentPopupData.targetUsers}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">표시 기간</label>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">시작:</span>
                      <span className="ml-2 text-gray-900">{currentPopupData.displayDuration.start}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">종료:</span>
                      <span className="ml-2 text-gray-900">{currentPopupData.displayDuration.end}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">조회수</label>
                    <p className="text-gray-900 font-semibold">{currentPopupData.stats.views.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">클릭수</label>
                    <p className="text-blue-600 font-semibold">{currentPopupData.stats.clicks}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">닫기수</label>
                    <p className="text-gray-600 font-semibold">{currentPopupData.stats.closes}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 팝업 제목 및 내용 */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{currentPopupData.title}</h3>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">팝업 내용</label>
                <div className="text-gray-900 whitespace-pre-wrap">{currentPopupData.content}</div>
              </div>
            </div>

            {/* 팝업 설정 */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                팝업 설정
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">오늘 하루 안보기</label>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    currentPopupData.settings.showToday ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {currentPopupData.settings.showToday ? '표시' : '숨김'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">자동 닫기</label>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    currentPopupData.settings.autoClose ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {currentPopupData.settings.autoClose ? `${currentPopupData.settings.autoCloseTime}초 후` : '사용 안함'}
                  </span>
                </div>
              </div>
            </div>

            {/* 생성 정보 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">생성일</label>
                <p className="text-gray-900 text-sm">{currentPopupData.dates.created}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">수정일</label>
                <p className="text-gray-900 text-sm">{currentPopupData.dates.lastModified}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">생성자</label>
                <p className="text-gray-900 text-sm">{currentPopupData.creator.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 액션 버튼 */}
        <div className="border-t border-gray-200 px-4 sm:px-6 py-4 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3">
            {currentPopupData.status === '활성' && (
              <>
                <button
                  onClick={() => handleAction('비활성화')}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center"
                >
                  <EyeOff className="w-4 h-4 mr-1" />
                  비활성화
                </button>
                <button
                  onClick={() => handleAction('삭제')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  삭제
                </button>
              </>
            )}
            {currentPopupData.status === '비활성' && (
              <>
                <button
                  onClick={() => handleAction('활성화')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  활성화
                </button>
                <button
                  onClick={() => handleAction('삭제')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  삭제
                </button>
              </>
            )}
            {currentPopupData.status === '삭제' && (
              <button
                onClick={() => handleAction('복원')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                복원
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 액션 확인 모달 */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">팝업 {actionType}</h3>
            <p className="text-gray-600 mb-4">
              <strong>대상:</strong> {currentPopupData.title}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">사유</label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
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

export default PopupDetailPopup; 