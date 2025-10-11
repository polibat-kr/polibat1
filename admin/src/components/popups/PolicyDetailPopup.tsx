import React, { useState } from 'react';
import { X, FileText, Eye, EyeOff, Trash2, RotateCcw, Calendar, User, Settings, Globe } from 'lucide-react';

interface PolicyDetailPopupProps {
  isVisible: boolean;
  onClose: () => void;
  policyData?: any;
}

const PolicyDetailPopup: React.FC<PolicyDetailPopupProps> = ({ 
  isVisible, 
  onClose, 
  policyData 
}) => {
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionReason, setActionReason] = useState('');

  // 기본 정책 데이터
  const defaultPolicyData = {
    id: 'PL000001',
    title: '개인정보처리방침',
    type: '개인정보보호', // '이용약관', '개인정보보호', '커뮤니티운영', '광고정책'
    version: '1.2',
    status: '게시', // '게시', '임시저장', '폐기'
    content: `제1조 (목적)
이 개인정보처리방침은 정치방망이(이하 '회사')가 제공하는 서비스와 관련하여 개인정보보호법 등 관련 법령에 따라 정보주체의 개인정보를 보호하고 이와 관련된 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같은 처리방침을 두고 있습니다.

제2조 (개인정보의 처리목적)
회사는 다음의 목적을 위하여 개인정보를 처리하고 있으며, 다음의 목적 이외의 용도로는 이용하지 않습니다.
1. 회원 가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증
2. 회원에 대한 서비스 이용기록과 접속 빈도 분석, 서비스 이용에 대한 통계
3. 불량회원의 부정 이용 방지와 비인가 사용 방지
4. 서비스 개선, 신규 서비스 개발 및 맞춤 서비스 제공

제3조 (개인정보의 처리 및 보유 기간)
회사는 정보주체로부터 개인정보를 수집할 때 동의받은 개인정보 보유·이용기간 또는 법령에 따른 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.`,
    effectiveDate: '2025.01.01',
    targetUsers: '전체',
    previousVersion: {
      version: '1.1',
      deprecatedDate: '2024.12.31'
    },
    stats: {
      views: 8456,
      agrees: 1247,
      downloads: 89
    },
    settings: {
      mandatory: true, // 필수 동의
      downloadable: true, // 다운로드 가능
      showVersion: true, // 버전 표시
      notifyChanges: true // 변경 시 알림
    },
    dates: {
      created: '2024.12.01 10:00:00',
      lastModified: '2024.12.15 16:30:00',
      published: '2025.01.01 00:00:00'
    },
    creator: {
      id: 'ADMIN001',
      name: '관리자'
    },
    approver: {
      id: 'LEGAL001',
      name: '법무팀장',
      approvedDate: '2024.12.30 17:00:00'
    }
  };

  const currentPolicyData = policyData ? {
    id: policyData.policyId || policyData.id || defaultPolicyData.id,
    title: policyData.policyName || policyData.title || defaultPolicyData.title,
    type: policyData.templateName || policyData.type || defaultPolicyData.type,
    version: policyData.version || defaultPolicyData.version,
    status: policyData.status || defaultPolicyData.status,
    content: policyData.content || defaultPolicyData.content,
    effectiveDate: policyData.startDate || policyData.effectiveDate || defaultPolicyData.effectiveDate,
    previousVersion: policyData.previousVersion || defaultPolicyData.previousVersion,
    stats: {
      views: policyData.stats?.views || policyData.views || defaultPolicyData.stats.views,
      agrees: policyData.stats?.agrees || policyData.agrees || defaultPolicyData.stats.agrees,
      downloads: policyData.stats?.downloads || policyData.downloads || defaultPolicyData.stats.downloads
    },
    settings: {
      mandatory: policyData.settings?.mandatory ?? policyData.mandatory ?? defaultPolicyData.settings.mandatory,
      downloadable: policyData.settings?.downloadable ?? policyData.downloadable ?? defaultPolicyData.settings.downloadable,
      showVersion: policyData.settings?.showVersion ?? policyData.showVersion ?? defaultPolicyData.settings.showVersion,
      notifyChanges: policyData.settings?.notifyChanges ?? policyData.notifyChanges ?? defaultPolicyData.settings.notifyChanges
    },
    dates: {
      created: policyData.dates?.created || policyData.createdAt || policyData.created || defaultPolicyData.dates.created,
      lastModified: policyData.dates?.lastModified || policyData.updatedAt || policyData.updated || defaultPolicyData.dates.lastModified,
      published: policyData.dates?.published || policyData.startDate || defaultPolicyData.dates.published
    },
    creator: {
      id: policyData.creator?.id || policyData.creatorId || defaultPolicyData.creator.id,
      name: policyData.creator?.name || policyData.creatorName || defaultPolicyData.creator.name
    },
    approver: policyData.approver || defaultPolicyData.approver,
    targetUsers: policyData.targetUsers || defaultPolicyData.targetUsers || '전체'
  } : defaultPolicyData;

  const handleAction = (action: string) => {
    setActionType(action);
    setShowActionModal(true);
  };

  const handleActionConfirm = () => {
    console.log(`정책 ${actionType} 처리: ${actionReason}`);
    setShowActionModal(false);
    setActionReason('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '게시': return 'bg-green-100 text-green-800';
      case '임시저장': return 'bg-yellow-100 text-yellow-800';
      case '폐기': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case '이용약관': return 'bg-blue-100 text-blue-800';
      case '개인정보보호': return 'bg-purple-100 text-purple-800';
      case '커뮤니티운영': return 'bg-green-100 text-green-800';
      case '광고정책': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">서비스정책 상세정보</h2>
              <p className="text-xs sm:text-sm text-gray-600">{currentPolicyData.id} - v{currentPolicyData.version}</p>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">정책 아이디</label>
                    <p className="text-gray-900 font-mono text-sm sm:text-base">{currentPolicyData.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(currentPolicyData.status)}`}>
                      {currentPolicyData.status === '게시' && <Globe className="w-3 h-3 mr-1" />}
                      {currentPolicyData.status === '임시저장' && <EyeOff className="w-3 h-3 mr-1" />}
                      {currentPolicyData.status === '폐기' && <Trash2 className="w-3 h-3 mr-1" />}
                      {currentPolicyData.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">정책 유형</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(currentPolicyData.type)}`}>
                      {currentPolicyData.type}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">버전</label>
                    <p className="text-gray-900 text-sm font-semibold">v{currentPolicyData.version}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">시행일</label>
                  <p className="text-gray-900 text-sm">{currentPolicyData.effectiveDate}</p>
                </div>

                {currentPolicyData.previousVersion && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">이전 버전</label>
                    <div className="text-sm text-gray-600">
                      <span>v{currentPolicyData.previousVersion.version}</span>
                      <span className="mx-2">•</span>
                      <span>폐기일: {currentPolicyData.previousVersion.deprecatedDate}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">조회수</label>
                    <p className="text-gray-900 font-semibold">{currentPolicyData.stats.views.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">동의수</label>
                    <p className="text-green-600 font-semibold">{currentPolicyData.stats.agrees.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">다운로드</label>
                    <p className="text-blue-600 font-semibold">{currentPolicyData.stats.downloads}</p>
                  </div>
                </div>

                {currentPolicyData.approver && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <label className="block text-sm font-medium text-green-700 mb-1">승인 정보</label>
                    <div className="text-sm text-green-800">
                      <div>{currentPolicyData.approver.name}</div>
                      <div className="text-green-600">{currentPolicyData.approver.approvedDate}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 정책 제목 */}
            <div>
              <h3 className="text-xl font-bold text-gray-900">{currentPolicyData.title}</h3>
            </div>

            {/* 정책 내용 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">정책 내용</label>
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 max-h-96 overflow-y-auto">
                <div className="text-gray-900 whitespace-pre-wrap text-sm leading-relaxed">
                  {currentPolicyData.content}
                </div>
              </div>
            </div>

            {/* 정책 설정 */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                정책 설정
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">필수 동의</label>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    currentPolicyData.settings.mandatory ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {currentPolicyData.settings.mandatory ? '필수' : '선택'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">다운로드 가능</label>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    currentPolicyData.settings.downloadable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {currentPolicyData.settings.downloadable ? '가능' : '불가'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">버전 표시</label>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    currentPolicyData.settings.showVersion ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {currentPolicyData.settings.showVersion ? '표시' : '숨김'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">변경 알림</label>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    currentPolicyData.settings.notifyChanges ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {currentPolicyData.settings.notifyChanges ? '발송' : '발송 안함'}
                  </span>
                </div>
              </div>
            </div>

            {/* 생성 정보 */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">생성일</label>
                <p className="text-gray-900 text-sm">{currentPolicyData.dates.created}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">수정일</label>
                <p className="text-gray-900 text-sm">{currentPolicyData.dates.lastModified}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">게시일</label>
                <p className="text-gray-900 text-sm">{currentPolicyData.dates.published}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">생성자</label>
                <p className="text-gray-900 text-sm">{currentPolicyData.creator.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 액션 버튼 */}
        <div className="border-t border-gray-200 px-4 sm:px-6 py-4 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3">
            {currentPolicyData.status === '게시' && (
              <>
                <button
                  onClick={() => handleAction('임시저장으로 변경')}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center"
                >
                  <EyeOff className="w-4 h-4 mr-1" />
                  임시저장
                </button>
                <button
                  onClick={() => handleAction('폐기')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  폐기
                </button>
              </>
            )}
            {currentPolicyData.status === '임시저장' && (
              <>
                <button
                  onClick={() => handleAction('게시')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Globe className="w-4 h-4 mr-1" />
                  게시
                </button>
                <button
                  onClick={() => handleAction('폐기')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  폐기
                </button>
              </>
            )}
            {currentPolicyData.status === '폐기' && (
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
            <h3 className="text-lg font-semibold mb-4">정책 {actionType}</h3>
            <p className="text-gray-600 mb-4">
              <strong>대상:</strong> {currentPolicyData.title} (v{currentPolicyData.version})
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">사유</label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
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

export default PolicyDetailPopup; 