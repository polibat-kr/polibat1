import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  Home, 
  Users, 
  FileText, 
  MessageCircle, 
  Flag, 
  Vote, 
  AlertTriangle, 
  Bell, 
  Monitor, 
  Shield, 
  Settings,
  Menu,
  X,
  LogOut,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['members']);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const menuItems = [
    {
      id: 'dashboard',
      title: '대시보드',
      icon: Home,
      path: '/dashboard'
    },
    {
      id: 'members',
      title: '회원관리',
      icon: Users,
      children: [
        { title: '전체회원관리', path: '/members/all' },
        { title: '정치인관리', path: '/members/politicians' },
        { title: '회원상태 변경이력', path: '/members/status-history' }
      ]
    },
    {
      id: 'likes',
      title: '좋아요/싫어요 이력',
      icon: FileText,
      path: '/likes-history'
    },
    {
      id: 'votes-history',
      title: '투표 이력',
      icon: Vote,
      path: '/votes-history'
    },
    {
      id: 'posts',
      title: '게시글 관리',
      icon: FileText,
      path: '/posts'
    },
    {
      id: 'comments',
      title: '댓글 관리',
      icon: MessageCircle,
      path: '/comments'
    },
    {
      id: 'reports',
      title: '신고이력',
      icon: Flag,
      path: '/reports'
    },
    {
      id: 'votes',
      title: '투표관리',
      icon: Vote,
      path: '/votes'
    },
    {
      id: 'suggestions',
      title: '불편/제안 접수 관리',
      icon: AlertTriangle,
      path: '/suggestions'
    },
    {
      id: 'notices',
      title: '공지사항 관리',
      icon: Bell,
      path: '/notices'
    },
    {
      id: 'popups',
      title: '팝업 관리',
      icon: Monitor,
      path: '/popups'
    },
    {
      id: 'banners',
      title: '배너 관리',
      icon: Monitor,
      path: '/banners'
    },
    {
      id: 'policies',
      title: '서비스 정책관리',
      icon: Shield,
      children: [
        { title: '서비스정책 템플릿 관리', path: '/policies/templates' },
        { title: '서비스정책 관리', path: '/policies/content' }
      ]
    }
  ];

  const renderMenuItem = (item: any) => {
    const isExpanded = expandedMenus.includes(item.id);
    
    if (item.children) {
      return (
        <div key={item.id}>
          <button
            onClick={() => toggleMenu(item.id)}
            className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
          >
            <div className="flex items-center">
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.title}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {isExpanded && (
            <div className="ml-8 space-y-1">
              {item.children.map((child: any, index: number) => (
                <NavLink
                  key={index}
                  to={child.path}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors rounded-md ${
                      isActive ? 'bg-blue-50 text-blue-600 font-medium' : ''
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  {child.title}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.id}
        to={item.path}
        className={({ isActive }) =>
          `flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors ${
            isActive ? 'bg-blue-50 text-blue-600 font-medium border-r-2 border-blue-600' : ''
          }`
        }
        onClick={() => setSidebarOpen(false)}
      >
        <item.icon className="w-5 h-5 mr-3" />
        <span className="font-medium">{item.title}</span>
      </NavLink>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 사이드바 */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out`}>
        {/* 로고 */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200">
          <NavLink 
            to="/dashboard" 
            className="flex items-center hover:opacity-80 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          >
            <img 
              src={`${process.env.PUBLIC_URL}/polibat-logo.png`}
              alt="정치방망이" 
              className="h-16 w-auto object-contain"
            />
          </NavLink>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="flex-1 overflow-y-auto">
          <div className="py-4 space-y-1">
            {menuItems.map(renderMenuItem)}
          </div>
        </nav>

        {/* 사용자 정보 */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-gray-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">관리자</p>
              <p className="text-xs text-gray-500">admin@polibat.com</p>
            </div>
          </div>
          <button className="mt-3 w-full flex items-center justify-center px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
            <LogOut className="w-4 h-4 mr-2" />
            로그아웃
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 헤더 */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 ml-2 lg:ml-0">관리자 페이지</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric',
                  weekday: 'long'
                })}
              </div>
            </div>
          </div>
        </header>

        {/* 페이지 콘텐츠 */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* 모바일 오버레이 */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout; 