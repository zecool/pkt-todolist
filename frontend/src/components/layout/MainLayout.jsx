import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import useUiStore from '../../stores/uiStore';
import { 
  Calendar as CalendarIcon, 
  Archive as ArchiveIcon, 
  Home as HomeIcon, 
  User as UserIcon,
  Settings
} from 'lucide-react';

const MainLayout = ({ children }) => {
  const { user } = useAuthStore();
  const { showSidebar } = useUiStore();
  const location = useLocation();

  // Sidebar navigation items
  const navigation = [
    { name: '할일 목록', href: '/', icon: HomeIcon },
    { name: '휴지통', href: '/trash', icon: ArchiveIcon },
    { name: '국경일', href: '/holidays', icon: CalendarIcon },
    { name: '프로필', href: '/profile', icon: UserIcon },
  ];

  // Admin navigation items
  const adminNavigation = [
    { name: '국경일 관리', href: '/admin/holidays', icon: Settings },
  ];

  return (
    <div className="flex w-full h-full">
      {/* Sidebar for desktop */}
      {showSidebar && (
        <div className="hidden md:block w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 h-screen sticky top-0">
          <div className="flex flex-col h-full">
            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`${
                      isActive
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors`}
                  >
                    <Icon
                      className={`${
                        isActive
                          ? 'text-green-500 dark:text-green-400'
                          : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                      } mr-3 h-5 w-5 flex-shrink-0`}
                    />
                    {item.name}
                  </Link>
                );
              })}
              
              {/* Admin section */}
              {user?.role === 'admin' && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    관리자 전용
                  </p>
                  {adminNavigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    const Icon = item.icon;
                    
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={`${
                          isActive
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                        } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors`}
                      >
                        <Icon
                          className={`${
                            isActive
                              ? 'text-green-500 dark:text-green-400'
                              : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                          } mr-3 h-5 w-5 flex-shrink-0`}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-10">
        <div className="grid grid-cols-4 gap-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`${
                  isActive
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                } flex flex-col items-center justify-center py-2 text-xs font-medium`}
              >
                <Icon
                  className={`${
                    isActive ? 'text-green-500 dark:text-green-400' : 'text-gray-400'
                  } h-6 w-6 mb-1`}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <main
        className="flex-1 transition-all duration-300 pb-16 md:pb-0 w-full min-h-screen"
      >
        <div className="h-full w-full px-4 py-4 max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;