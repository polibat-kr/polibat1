import React, { useState } from 'react';
import { openExternalLink } from '../../utils/navigation';
import { X, Image, Eye, EyeOff, Trash2, RotateCcw, Calendar, User, ExternalLink } from 'lucide-react';

interface BannerDetailPopupProps {
  isVisible: boolean;
  onClose: () => void;
  bannerData?: any;
}

const BannerDetailPopup: React.FC<BannerDetailPopupProps> = ({ 
  isVisible, 
  onClose, 
  bannerData 
}) => {
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionReason, setActionReason] = useState('');

  // 기본 배너 데이터
  const defaultBannerData = {
    id: 'BN000001',
    title: '정치방망이 새해 이벤트',
    description: '2025년 새해를 맞아 정치방망이에서 특별한 이벤트를 진행합니다.',
    imageUrl: '/banner-images/new-year-event.jpg',
    linkUrl: 'https://example.com/event/new-year-2025',
    status: '활성', // '활성', '비활성', '삭제'
    position: '상단메인', // '상단메인', '하단메인', '사이드바', '게시판상단'
    displayDuration: {
      start: '2025.01.01 00:00',
      end: '2025.01.31 23:59'
    },
    targetUsers: '전체', // '전체', '일반회원', '정치인'
    priority: 1, // 우선순위 (1이 가장 높음)
    stats: {
      impressions: 15420, // 노출수
      clicks: 346, // 클릭수
      ctr: 2.24 // 클릭률(%)
    },
    settings: {
      newWindow: true, // 새 창에서 열기
      trackClicks: true, // 클릭 추적
      showOnMobile: true, // 모바일에서 표시
      autoRotate: false, // 자동 회전
      rotateInterval: 5 // 회전 간격(초)
    },
    dates: {
      created: '2024.12.25 14:30:00',
      lastModified: '2024.12.25 14:30:00'
    },
    creator: {
      id: 'ADMIN001',
      name: '관리자'
    }
  };

  const currentBannerData = bannerData ? {
    id: bannerData.bannerId || bannerData.id || defaultBannerData.id,
    title: bannerData.title || defaultBannerData.title,
    description: bannerData.description || defaultBannerData.description,
    imageUrl: bannerData.imageUrl || bannerData.image || defaultBannerData.imageUrl,
    linkUrl: bannerData.linkUrl || bannerData.link || defaultBannerData.linkUrl,
    status: bannerData.status || defaultBannerData.status,
    position: bannerData.position || defaultBannerData.position,
    displayDuration: {
      start: bannerData.displayDuration?.start || bannerData.startDate || defaultBannerData.displayDuration.start,
      end: bannerData.displayDuration?.end || bannerData.endDate || defaultBannerData.displayDuration.end
    },
    targetUsers: bannerData.targetUsers || defaultBannerData.targetUsers,
    priority: bannerData.priority || defaultBannerData.priority,
    stats: {
      impressions: bannerData.stats?.impressions || bannerData.impressions || defaultBannerData.stats.impressions,
      clicks: bannerData.stats?.clicks || bannerData.clicks || defaultBannerData.stats.clicks,
      ctr: bannerData.stats?.ctr || bannerData.ctr || defaultBannerData.stats.ctr
    },
    settings: {
      newWindow: bannerData.settings?.newWindow ?? bannerData.newWindow ?? defaultBannerData.settings.newWindow,
      trackClicks: bannerData.settings?.trackClicks ?? bannerData.trackClicks ?? defaultBannerData.settings.trackClicks,
      showOnMobile: bannerData.settings?.showOnMobile ?? bannerData.showOnMobile ?? defaultBannerData.settings.showOnMobile,
      autoRotate: bannerData.settings?.autoRotate ?? bannerData.autoRotate ?? defaultBannerData.settings.autoRotate,
      rotateInterval: bannerData.settings?.rotateInterval || bannerData.rotateInterval || defaultBannerData.settings.rotateInterval
    },
    dates: {
      created: bannerData.dates?.created || bannerData.createdAt || bannerData.created || defaultBannerData.dates.created,
      lastModified: bannerData.dates?.lastModified || bannerData.updatedAt || bannerData.updated || defaultBannerData.dates.lastModified
    },
    creator: {
      id: bannerData.creator?.id || bannerData.creatorId || defaultBannerData.creator.id,
      name: bannerData.creator?.name || bannerData.creatorName || defaultBannerData.creator.name
    }
  } : defaultBannerData;

  const handleAction = (action: string) => {
    setActionType(action);
    setShowActionModal(true);
  };

  const handleActionConfirm = () => {
    console.log(`배너 ${actionType} 처리: ${actionReason}`);
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

  const getPositionColor = (position: string) => {
    switch (position) {
      case '상단메인': return 'bg-blue-100 text-blue-800';
      case '하단메인': return 'bg-purple-100 text-purple-800';
      case '사이드바': return 'bg-green-100 text-green-800';
      case '게시판상단': return 'bg-orange-100 text-orange-800';
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
            <div className="p-2 bg-green-100 rounded-lg">
              <Image className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">배너 상세정보</h2>
              <p className="text-xs sm:text-sm text-gray-600">{currentBannerData.id}</p>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">배너 아이디</label>
                    <p className="text-gray-900 font-mono text-sm sm:text-base">{currentBannerData.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(currentBannerData.status)}`}>
                      {currentBannerData.status === '활성' && <Eye className="w-3 h-3 mr-1" />}
                      {currentBannerData.status === '비활성' && <EyeOff className="w-3 h-3 mr-1" />}
                      {currentBannerData.status === '삭제' && <Trash2 className="w-3 h-3 mr-1" />}
                      {currentBannerData.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">위치</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPositionColor(currentBannerData.position)}`}>
                      {currentBannerData.position}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">우선순위</label>
                    <p className="text-gray-900 text-sm font-semibold">{currentBannerData.priority}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">대상 사용자</label>
                  <p className="text-gray-900 text-sm">{currentBannerData.targetUsers}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">링크 URL</label>
                  <div className="flex items-center space-x-2">
                    <p className="text-blue-600 text-sm font-mono break-all">{currentBannerData.linkUrl}</p>
                    <button
                      onClick={() => openExternalLink(currentBannerData.linkUrl)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="새 창에서 열기"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">표시 기간</label>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">시작:</span>
                      <span className="ml-2 text-gray-900">{currentBannerData.displayDuration.start}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">종료:</span>
                      <span className="ml-2 text-gray-900">{currentBannerData.displayDuration.end}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">노출수</label>
                    <p className="text-gray-900 font-semibold">{currentBannerData.stats.impressions.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">클릭수</label>
                    <p className="text-blue-600 font-semibold">{currentBannerData.stats.clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">클릭률</label>
                    <p className="text-green-600 font-semibold">{currentBannerData.stats.ctr}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 배너 제목 및 설명 */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{currentBannerData.title}</h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                <p className="text-gray-900 text-sm">{currentBannerData.description}</p>
              </div>
            </div>

            {/* 배너 이미지 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">배너 이미지</label>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-center h-32 bg-gray-100 rounded border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <Image className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">배너 이미지 미리보기</p>
                    <p className="text-xs text-gray-400 mt-1">{currentBannerData.imageUrl}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 배너 설정 */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">배너 설정</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">새 창에서 열기</label>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    currentBannerData.settings.newWindow ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {currentBannerData.settings.newWindow ? '사용' : '사용 안함'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">클릭 추적</label>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    currentBannerData.settings.trackClicks ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {currentBannerData.settings.trackClicks ? '사용' : '사용 안함'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">모바일 표시</label>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    currentBannerData.settings.showOnMobile ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {currentBannerData.settings.showOnMobile ? '표시' : '숨김'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">자동 회전</label>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    currentBannerData.settings.autoRotate ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {currentBannerData.settings.autoRotate ? `${currentBannerData.settings.rotateInterval}초 간격` : '사용 안함'}
                  </span>
                </div>
              </div>
            </div>

            {/* 생성 정보 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">생성일</label>
                <p className="text-gray-900 text-sm">{currentBannerData.dates.created}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">수정일</label>
                <p className="text-gray-900 text-sm">{currentBannerData.dates.lastModified}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">생성자</label>
                <p className="text-gray-900 text-sm">{currentBannerData.creator.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 액션 버튼 */}
        <div className="border-t border-gray-200 px-4 sm:px-6 py-4 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3">
            {currentBannerData.status === '활성' && (
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
            {currentBannerData.status === '비활성' && (
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
            {currentBannerData.status === '삭제' && (
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
            <h3 className="text-lg font-semibold mb-4">배너 {actionType}</h3>
            <p className="text-gray-600 mb-4">
              <strong>대상:</strong> {currentBannerData.title}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">사유</label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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

export default BannerDetailPopup; 