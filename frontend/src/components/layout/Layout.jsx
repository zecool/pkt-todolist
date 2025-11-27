import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';

const Layout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-[#00C73C]">pkt-TodoList</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-[#757575]">안녕하세요, {user.username}님</span>
                  <button
                    onClick={handleLogout}
                    className="ml-4 px-4 py-2 text-sm bg-[#F44336] text-white rounded-lg hover:bg-[#D32F2F] transition-colors"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;