import React, { useState, useRef, useEffect } from 'react';
import { openAdminPage } from '../../utils/navigation';
import { X, Vote, Calendar, Eye, Clock, CheckCircle, Ban, Users, MessageCircle, Edit, Trash2, Save, User, Plus } from 'lucide-react';

interface VoteDetailPopupProps {
  isVisible: boolean;
  onClose: () => void;
  voteData?: any;
}

const VoteDetailPopup: React.FC<VoteDetailPopupProps> = ({ 
  isVisible, 
  onClose, 
  voteData 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionReason, setActionReason] = useState('');
  const [saveReason, setSaveReason] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const defaultVoteData = {
    id: 'VP000003',
    voteId: 'VP000003',
    title: '무인도에 단둘이 남는다면?',
    description: '아래 정치인 중 함께 무인도에 남고 싶은 사람을 골라주세요.',
    image: 'vote-image.jpg',
    status: '진행',
    startDate: '25-06-01',
    endDate: '25-06-10',
    stats: {
      views: 1247,
      participants: 847
    },
    options: [
      {
        id: 1,
        name: '이재명',
        description: '무인도에서도 일할 수 있어',
        image: 'lee.jpg',
        votes: 347
      },
      {
        id: 2,
        name: '한동훈',
        description: '무인도에서 깐죽거려도 된다',
        image: 'han.jpg',
        votes: 259
      },
      {
        id: 3,
        name: '김건희',
        description: '나는 고문도 견뎠다',
        image: 'kim.jpg',
        votes: 41
      }
    ]
  };

  const currentVoteData = voteData ? {
    id: voteData.voteId || voteData.id || defaultVoteData.id,
    voteId: voteData.voteId || voteData.id || defaultVoteData.id,
    title: voteData.title || defaultVoteData.title,
    description: voteData.description || defaultVoteData.description,
    image: voteData.image || defaultVoteData.image,
    status: voteData.status || defaultVoteData.status,
    startDate: voteData.startDate || defaultVoteData.startDate,
    endDate: voteData.endDate || defaultVoteData.endDate,
    stats: {
      views: voteData.stats?.views || voteData.views || defaultVoteData.stats.views,
      participants: voteData.stats?.participants || voteData.participants || defaultVoteData.stats.participants
    },
    options: Array.isArray(voteData.options) ? voteData.options : defaultVoteData.options
  } : defaultVoteData;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Vote className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">투표 상세정보</h2>
              <p className="text-xs sm:text-sm text-gray-600">{currentVoteData.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">투표 아이디</label>
                    <p className="text-gray-900 font-mono text-sm sm:text-base">{currentVoteData.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {currentVoteData.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">조회수</label>
                    <p className="text-gray-900 text-sm sm:text-base">{currentVoteData.stats?.views?.toLocaleString() || '0'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">참여수</label>
                    <button
                      onClick={() => openAdminPage(`/votes-history?voteId=${currentVoteData.voteId || currentVoteData.id}`)}
                      className="text-blue-600 hover:text-blue-800 underline text-sm sm:text-base"
                    >
                      {currentVoteData.stats?.participants?.toLocaleString() || '0'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">투표 기간</label>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">투표 시작일</label>
                        <p className="text-gray-900 text-sm">{currentVoteData.startDate}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">투표 마감일</label>
                        <p className="text-gray-900 text-sm">{currentVoteData.endDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{currentVoteData.title}</h3>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                <div className="text-gray-900">{currentVoteData.description}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">투표 선택지</label>
                <div className="space-y-4">
                  {(currentVoteData.options && Array.isArray(currentVoteData.options) && currentVoteData.options.length > 0) ? 
                    currentVoteData.options.map((option: any, index: number) => (
                      <div key={option.id || index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">{option.name || '이름 없음'}</h4>
                          <div className="text-right">
                            <label className="block text-xs font-medium text-gray-600 mb-1">현재 득표수</label>
                            <p className="text-gray-900 text-sm font-medium">{option.votes || 0}표</p>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{option.description || '설명이 없습니다.'}</p>
                      </div>
                    )) : 
                    <p className="text-gray-500">투표 선택지가 없습니다.</p>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 sm:px-6 py-4 bg-gray-50">
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center">
              <Ban className="w-4 h-4 mr-1" />
              마감
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center">
              <Trash2 className="w-4 h-4 mr-1" />
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteDetailPopup; 
