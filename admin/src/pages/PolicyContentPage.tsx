import React, { useState, useEffect } from 'react';
import { Shield, Search, Filter, Download, RefreshCw, Plus, Eye, Calendar } from 'lucide-react';
import PolicyDetailPopup from '../components/popups/PolicyDetailPopup';

const PolicyContentPage = () => {
  // 브라우저 타이틀 설정
  useEffect(() => {
    document.title = '서비스정책 관리 - POLIBAT admin';
  }, []);

  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [templateFilter, setTemplateFilter] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [dateType, setDateType] = useState('게시시작일'); // '게시시작일' 또는 '게시종료일'
  const [periodFilter, setPeriodFilter] = useState('전체');
  const [dateStartDate, setDateStartDate] = useState('');
  const [dateEndDate, setDateEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showPolicyForm, setShowPolicyForm] = useState(false);

  // 샘플 서비스정책 데이터
  const samplePolicies = [
    {
      id: 1,
      policyId: 'TP000001-VN0003',
      templateName: '이용약관',
      targetUsers: '전체',
      policyName: '정치방망이 이용약관 v2',
      status: '게시',
      startDate: '25.06.01',
      endDate: '-',
      createdAt: '25.06.01'
    },
    {
      id: 2,
      policyId: 'TP000001-VN0002',
      templateName: '이용약관',
      targetUsers: '전체',
      policyName: '정치방망이 이용약관 v1',
      status: '만료',
      startDate: '25.04.30',
      endDate: '25.05.12',
      createdAt: '25.04.30'
    },
    {
      id: 3,
      policyId: 'TP000001-VN0001',
      templateName: '이용약관',
      targetUsers: '전체',
      policyName: '정치방망이 이용약관 draft',
      status: '삭제',
      startDate: '25.04.01',
      endDate: '25.04.10',
      createdAt: '25.02.02'
    },
    {
      id: 4,
      policyId: 'TP000002-VN0003',
      templateName: '개인정보 처리방침',
      targetUsers: '전체',
      policyName: '정치방망이 개인정보처리방침 v2',
      status: '게시',
      startDate: '25.06.01',
      endDate: '-',
      createdAt: '25.06.01'
    },
    {
      id: 5,
      policyId: 'TP000002-VN0002',
      templateName: '개인정보 처리방침',
      targetUsers: '전체',
      policyName: '정치방망이 개인정보처리방침 v1',
      status: '만료',
      startDate: '25.04.30',
      endDate: '25.05.12',
      createdAt: '25.04.30'
    },
    {
      id: 6,
      policyId: 'TP000002-VN0001',
      templateName: '개인정보 처리방침',
      targetUsers: '전체',
      policyName: '정치방망이 개인정보처리방침 draft',
      status: '삭제',
      startDate: '25.04.01',
      endDate: '25.04.10',
      createdAt: '25.02.02'
    },
    {
      id: 7,
      policyId: 'TP000003-VN0001',
      templateName: '개인정보 수집동의서(일반회원)',
      targetUsers: '일반회원',
      policyName: '(일반회원) 개인정보 수집동의서',
      status: '게시',
      startDate: '25.06.01',
      endDate: '-',
      createdAt: '25.06.01'
    },
    {
      id: 8,
      policyId: 'TP000004-VN0001',
      templateName: '개인정보 수집동의서(정치인)',
      targetUsers: '정치인회원',
      policyName: '(정치인) 개인정보 수집동의서',
      status: '게시',
      startDate: '25.06.01',
      endDate: '-',
      createdAt: '25.06.01'
    }
  ];

  const templateOptions = ['전체', '이용약관', '개인정보 처리방침', '개인정보 수집동의서(일반회원)', '개인정보 수집동의서(정치인)'];
  const statusOptions = ['전체', '게시', '만료', '삭제'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '게시':
        return 'bg-green-100 text-green-800';
      case '만료':
        return 'bg-yellow-100 text-yellow-800';
      case '삭제':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

  const handlePolicyClick = (policy: any) => {
    // 안전한 정책 데이터 구조로 변환
    const policyData = {
      policyId: policy.policyId || policy.id,
      title: policy.policyName || policy.title || '정책 제목 없음',
      type: policy.templateName || policy.type || '일반정책',
      version: policy.version || '1.0',
      status: policy.status || '게시',
      content: policy.content || '정책 내용이 설정되지 않았습니다.\n\n이 정책의 상세 내용은 관리자에게 문의하시기 바랍니다.',
      effectiveDate: policy.startDate || policy.effectiveDate || '2025.01.01',
      targetUsers: policy.targetUsers || '전체',
      previousVersion: policy.previousVersion || null,
      stats: {
        views: policy.stats?.views || policy.views || 0,
        agrees: policy.stats?.agrees || policy.agrees || 0,
        downloads: policy.stats?.downloads || policy.downloads || 0
      },
      settings: {
        mandatory: policy.settings?.mandatory ?? policy.mandatory ?? true,
        downloadable: policy.settings?.downloadable ?? policy.downloadable ?? true,
        showVersion: policy.settings?.showVersion ?? policy.showVersion ?? true,
        notifyChanges: policy.settings?.notifyChanges ?? policy.notifyChanges ?? true
      },
      dates: {
        created: policy.createdAt || policy.dates?.created || '2025.01.01 00:00:00',
        lastModified: policy.updatedAt || policy.dates?.lastModified || '2025.01.01 00:00:00',
        published: policy.startDate || policy.dates?.published || '2025.01.01 00:00:00'
      },
      creator: {
        id: policy.creator?.id || policy.creatorId || 'ADMIN001',
        name: policy.creator?.name || policy.creatorName || '관리자'
      },
      approver: policy.approver || {
        id: 'LEGAL001',
        name: '법무팀장',
        approvedDate: '2025.01.01 00:00:00'
      }
    };
    setSelectedPolicy(policyData);
  };

  const filteredPolicies = samplePolicies.filter(policy => {
    const matchesSearch = policy.policyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.policyId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTemplate = templateFilter === '전체' || policy.templateName === templateFilter;
    const matchesStatus = statusFilter === '전체' || policy.status === statusFilter;
    
    return matchesSearch && matchesTemplate && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPolicies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPolicies = filteredPolicies.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    console.log('서비스정책 데이터 내보내기');
  };

  const handleRefresh = () => {
    console.log('데이터 새로고침');
  };

  // 통계 계산
  const totalPolicies = samplePolicies.length;
  const activePolicies = samplePolicies.filter(p => p.status === '게시').length;
  const expiredPolicies = samplePolicies.filter(p => p.status === '만료').length;
  const deletedPolicies = samplePolicies.filter(p => p.status === '삭제').length;

  return (
    <div className="p-6">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">서비스정책 관리</h1>
            <p className="mt-1 text-gray-600">서비스정책을 조회하고 관리할 수 있습니다.</p>
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
              onClick={() => setShowPolicyForm(true)}
              className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              서비스정책 등록
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
              <p className="text-sm font-medium text-gray-600">전체 정책</p>
              <p className="text-2xl font-bold text-gray-900">{totalPolicies}개</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">게시 중</p>
              <p className="text-2xl font-bold text-gray-900">{activePolicies}개</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">만료</p>
              <p className="text-2xl font-bold text-gray-900">{expiredPolicies}개</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Filter className="w-8 h-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">삭제</p>
              <p className="text-2xl font-bold text-gray-900">{deletedPolicies}개</p>
            </div>
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">검색</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="정책명, 정책 ID 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">템플릿</label>
            <select
              value={templateFilter}
              onChange={(e) => setTemplateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {templateOptions.map(template => (
                <option key={template} value={template}>{template}</option>
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">검색일 기준</label>
            <select
              value={dateType}
              onChange={(e) => setDateType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="게시시작일">게시시작일</option>
              <option value="게시종료일">게시종료일</option>
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
        {(templateFilter !== '전체' || statusFilter !== '전체' || periodFilter !== '전체' || dateStartDate || dateEndDate || searchTerm) && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-blue-700">적용된 필터:</span>
                {templateFilter !== '전체' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    템플릿: {templateFilter}
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
                  setTemplateFilter('전체');
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
              <h3 className="text-lg font-semibold text-gray-900">서비스정책 목록</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                총 {filteredPolicies.length}개
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">번호</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">서비스정책 아이디</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">서비스정책 템플릿명</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">적용 대상</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">서비스정책명</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">정책 상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">게시 시작일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">게시 종료일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedPolicies.map((policy, index) => (
                <tr key={policy.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handlePolicyClick(policy)}
                      className="text-blue-600 hover:text-blue-800 underline font-medium"
                    >
                      {policy.policyId}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {policy.templateName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded border ${getTargetUsersColor(policy.targetUsers)}`}>
                      {policy.targetUsers}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-900 truncate" title={policy.policyName}>
                        {policy.policyName}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(policy.status)}`}>
                      {policy.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {policy.startDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {policy.endDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {policy.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 서비스정책 등록 폼 */}
      {showPolicyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">서비스정책 등록</h2>
              <button
                onClick={() => setShowPolicyForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">서비스정책 템플릿명 *</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">템플릿을 선택하세요</option>
                    <option value="이용약관">이용약관</option>
                    <option value="개인정보 처리방침">개인정보 처리방침</option>
                    <option value="개인정보 수집동의서(일반회원)">개인정보 수집동의서(일반회원)</option>
                    <option value="개인정보 수집동의서(정치인)">개인정보 수집동의서(정치인)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">적용대상</label>
                  <input
                    type="text"
                    value="(템플릿 선택에 따라 자동 노출됨)"
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">서비스정책명 *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="서비스정책명을 입력하세요"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">게시 시작일 *</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">게시 종료일</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">정책 내용 *</label>
                <textarea
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="정책 내용을 입력하세요 (리치 텍스트 에디터)"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowPolicyForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    console.log('서비스정책 등록');
                    setShowPolicyForm(false);
                  }}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  등록하기
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

export default PolicyContentPage; 