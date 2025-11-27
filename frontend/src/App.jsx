import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';

function App() {
  const { initializeAuth, isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Redirect authenticated users from login/register pages to todo list
  useEffect(() => {
    if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
      navigate('/todos', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00C73C]"></div>
          <p className="mt-4 text-[#757575]">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Outlet />
    </div>
  );
}

export default App;
