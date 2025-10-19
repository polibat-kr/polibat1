import React, { useState, useEffect } from 'react';
import { Shield, Search, Download, RefreshCw, Plus, Eye, Users } from 'lucide-react';
import PolicyDetailPopup from '../components/popups/PolicyDetailPopup';

const PolicyTemplatesPage = () => {
  // 브라우저 타이틀 설정
  useEffect(() => {
    document.title = '서비스정책 템플릿 관리 - POLIBAT admin';
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [dateType, setDateType] = useState('수정일시'); // '수정일시'만 사용
  const [periodFilter, setPeriodFilter] = useState('전체');
  const [dateStartDate, setDateStartDate] = useState('');
  const [dateEndDate, setDateEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);

  // 템플릿 등록 폼 상태
  const [templateForm, setTemplateForm] = useState({
    name: '',
    targetUsers: '전체'
  });

  // 샘플 서비스정책 템플릿 데이터
  const sampleTemplates = [
    {
      id: 1,
      templateId: 'TP000001',
      name: '이용약관',
      targetUsers: '전체',
      createdAt: '25.06.01',
      updatedAt: '25.06.01',
      currentPolicyId: 'TP000001-VN0003',
      currentPolicyTitle: '정치방망이 이용약관 v2'
    },
    {
      id: 2,
      templateId: 'TP000002',
      name: '개인정보 처리방침',
      targetUsers: '전체',
      createdAt: '25.06.01',
      updatedAt: '25.06.01',
      currentPolicyId: 'TP000002-VN0003',
      currentPolicyTitle: '정치방망이 개인정보처리방침 v2'
    },
    {
      id: 3,
      templateId: 'TP000003',
      name: '개인정보 수집동의서(일반회원)',
      targetUsers: '일반회원',
      createdAt: '25.06.01',
      updatedAt: '25.06.01',
      currentPolicyId: 'TP000003-VN0001',
      currentPolicyTitle: '(일반회원) 개인정보 수집동의서'
    },
    {
      id: 4,
      templateId: 'TP000004',
      name: '개인정보 수집동의서(정치인)',
      targetUsers: '정치인회원',
      createdAt: '25.06.01',
      updatedAt: '25.06.01',
      currentPolicyId: 'TP000004-VN0001',
      currentPolicyTitle: '(정치인) 개인정보 수집동의서'
    }
  ];

  const targetUserOptions = ['전체', '일반회원', '정치인회원'];

  const getTargetUsersColor = (targetUsers: string) => {
    switch (targetUsers) {
      case '전체':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case '일반회원':
        return 'bg-green-50 text-green-700 border-green-200';
      case '정치인회원':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleTemplateClick = (template: any) => {
    setEditingTemplate(template);
    setTemplateForm({
      name: template.name,
      targetUsers: template.targetUsers
    });
    setShowTemplateForm(true);
  };

  const handlePolicyClick = (policyId: string, template: any) => {
    // 안전한 정책 데이터 구조로 변환하여 팝업 열기
    const policyData = {
      policyId: template.currentPolicyId || policyId,
      title: template.currentPolicyTitle || template.name || '정책 제목 없음',
      type: template.name || '일반정책',
      version: '1.0', // 템플릿에서는 버전 정보가 없으므로 기본값
      status: '게시', // 현재 서비스정책이므로 게시 상태
      content: `이 정책의 상세 내용은 다음과 같습니다.\n\n${template.name}에 대한 정책 내용입니다.\n\n정책 ID: ${policyId}\n적용 대상: ${template.targetUsers}\n\n상세한 정책 내용은 관리자에게 문의하시기 바랍니다.`,
      effectiveDate: template.createdAt || '2025.01.01',
      targetUsers: template.targetUsers || '전체',
      previousVersion: null,
      stats: {
        views: Math.floor(Math.random() * 10000) + 1000, // 샘플 데이터
        agrees: Math.floor(Math.random() * 1000) + 100,
        downloads: Math.floor(Math.random() * 100) + 10
      },
      settings: {
        mandatory: template.targetUsers !== '전체', // 전체가 아니면 필수
        downloadable: true,
        showVersion: true,
        notifyChanges: true
      },
      dates: {
        created: template.createdAt || '2025.01.01 00:00:00',
        lastModified: template.updatedAt || '2025.01.01 00:00:00',
        published: template.createdAt || '2025.01.01 00:00:00'
      },
      creator: {
        id: 'ADMIN001',
        name: '관리자'
      },
      approver: {
        id: 'LEGAL001',
        name: '법무팀장',
        approvedDate: template.createdAt || '2025.01.01 00:00:00'
      }
    };
    setSelectedPolicy(policyData);
  };

  const handleFormSubmit = () => {
    if (editingTemplate) {
      console.log('템플릿 수정:', editingTemplate.templateId, templateForm);
    } else {
      console.log('템플릿 등록:', templateForm);
    }
    setShowTemplateForm(false);
    setEditingTemplate(null);
    setTemplateForm({
      name: '',
      targetUsers: '전체'
    });
  };

  const handleFormCancel = () => {
    setShowTemplateForm(false);
    setEditingTemplate(null);
    setTemplateForm({
      name: '',
      targetUsers: '전체'
    });
  };

  const filteredTemplates = sampleTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.templateId.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTemplates = filteredTemplates.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    console.log('서비스정책 템플릿 데이터 내보내기');
  };

  const handleRefresh = () => {
    console.log('데이터 새로고침');
  };

  // 통계 계산
  const totalTemplates = sampleTemplates.length;
  const allUserTemplates = sampleTemplates.filter(t => t.targetUsers === '전체').length;
  const normalUserTemplates = sampleTemplates.filter(t => t.targetUsers === '일반회원').length;
  const politicianTemplates = sampleTemplates.filter(t => t.targetUsers === '정치인회원').length;

  return (
    <div className="p-6">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">서비스정책 템플릿 관리</h1>
            <p className="mt-1 text-gray-600">서비스정책 템플릿을 조회하고 관리할 수 있습니다.</p>
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
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              내보내기
            </button>
            <button
              onClick={() => setShowTemplateForm(true)}
              className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              템플릿 등록
            </button>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">전체 템플릿</p>
              <p className="text-2xl font-bold text-gray-900">{totalTemplates}개</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">전체 대상</p>
              <p className="text-2xl font-bold text-gray-900">{allUserTemplates}개</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">일반회원</p>
              <p className="text-2xl font-bold text-gray-900">{normalUserTemplates}개</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">정치인회원</p>
              <p className="text-2xl font-bold text-gray-900">{politicianTemplates}개</p>
            </div>
          </div>
        </div>
      </div>

      {/* 검색 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">검색</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="템플릿명, 템플릿 ID 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">검색기간</label>
            <select
              value={periodFilter}
              onChange={(e) => {
                setPeriodFilter(e.target.value);
                if (e.target.value !== '전체') {
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
              <option value="전체">전체</option>
              <option value="일간">일간</option>
              <option value="주간">주간</option>
              <option value="월간">월간</option>
              <option value="연간">연간</option>
              <option value="사용자지정">사용자지정</option>
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
        {(periodFilter !== '전체' || dateStartDate || dateEndDate || searchTerm) && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-blue-700">적용된 필터:</span>
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
              <h3 className="text-lg font-semibold text-gray-900">서비스정책 템플릿 목록</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                총 {filteredTemplates.length}개
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">번호</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">서비스정책 템플릿 아이디</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">서비스정책 템플릿명</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">적용 대상</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">현재 서비스정책</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">최종수정일</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedTemplates.map((template, index) => (
                <tr key={template.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleTemplateClick(template)}
                      className="text-blue-600 hover:text-blue-800 underline font-medium"
                    >
                      {template.templateId}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {template.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded border ${getTargetUsersColor(template.targetUsers)}`}>
                      {template.targetUsers}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <button
                        onClick={() => handlePolicyClick(template.currentPolicyId, template)}
                        className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                      >
                        {template.currentPolicyId}
                      </button>
                      <div className="text-sm text-gray-600">
                        {template.currentPolicyTitle}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.updatedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 템플릿 등록/수정 폼 */}
      {showTemplateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editingTemplate ? '서비스정책 템플릿 수정' : '서비스정책 템플릿 등록'}
              </h2>
              <button
                onClick={handleFormCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">서비스정책 템플릿명 *</label>
                <input
                  type="text"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="템플릿명을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">적용대상 *</label>
                <select
                  value={templateForm.targetUsers}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, targetUsers: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {targetUserOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={handleFormCancel}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  onClick={handleFormSubmit}
                  disabled={!templateForm.name}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingTemplate ? '수정하기' : '등록하기'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 서비스정책 상세정보 팝업 */}
      {selectedPolicy && (
        <PolicyDetailPopup
          isVisible={true}
          onClose={() => setSelectedPolicy(null)}
          policyData={selectedPolicy}
        />
      )}
    </div>
  );
};

export default PolicyTemplatesPage; 