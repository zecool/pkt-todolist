import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import useUiStore from '../../stores/uiStore';
import { Menu, X, Sun, Moon, User, LogOut, Calendar, Archive, Home } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuthStore();
  const { showSidebar, setShowSidebar } = useUiStore();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine page title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return '할일 목록';
      case '/trash':
        return '휴지통';
      case '/holidays':
        return '국경일';
      case '/profile':
        return '프로필';
      default:
        return '';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close profile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (isProfileMenuOpen) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileMenuOpen]);

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Logo and menu button */}
          <div className="flex items-center">
            <button
              type="button"
              className="mr-2 sm:mr-3 rounded-md p-1 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
              onClick={() => setShowSidebar(!showSidebar)}
              aria-label="Toggle sidebar"
            >
              {showSidebar ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link to="/" className="flex items-center">
              <Home className="h-8 w-8 text-green-600 mr-2" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">pkt-TodoList</span>
            </Link>
            <span className="ml-4 text-lg font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
              {getPageTitle()}
            </span>
          </div>

          {/* Right section - Profile */}
          <div className="flex items-center">
            {/* Dark mode toggle */}
            <button
              type="button"
              className="p-1 rounded-full text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none mr-3"
              onClick={() => useUiStore.getState().toggleDarkMode()}
              aria-label="Toggle dark mode"
            >
              {useUiStore.getState().isDarkMode ? (
                <Sun className="h-6 w-6" />
              ) : (
                <Moon className="h-6 w-6" />
              )}
            </button>

            {/* Profile dropdown */}
            <div className="relative ml-3">
              <div>
                <button
                  type="button"
                  className="flex rounded-full bg-white text-sm focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileMenuOpen(!isProfileMenuOpen);
                  }}
                  aria-expanded={isProfileMenuOpen}
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-medium">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </button>
              </div>

              {isProfileMenuOpen && (
                <div
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <User className="inline h-4 w-4 mr-2" />
                    프로필
                  </Link>
                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    <LogOut className="inline h-4 w-4 mr-2" />
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;