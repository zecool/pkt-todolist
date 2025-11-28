import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import useAuthStore from './stores/authStore';
import useUiStore from './stores/uiStore';
import Header from './components/layout/Header';
import MainLayout from './components/layout/MainLayout';
import Modal from './components/common/Modal';
import TodoForm from './components/todo/TodoForm';

function App() {
  const initializeAuth = useAuthStore(state => state.initializeAuth);
  const initializeDarkMode = useUiStore(state => state.initializeDarkMode);
  const { isModalOpen, modalType, selectedTodo, closeModal } = useUiStore();
  const location = useLocation();

  useEffect(() => {
    // Initialize authentication state from stored token
    initializeAuth();

    // Initialize dark mode preference
    initializeDarkMode();
  }, [initializeAuth, initializeDarkMode]);

  // Get modal title based on modal type
  const getModalTitle = () => {
    switch (modalType) {
      case 'add':
        return '새 할일 추가';
      case 'edit':
        return '할일 수정';
      default:
        return '';
    }
  };

  // Check if current route is auth page
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {!isAuthPage && <Header />}
      {isAuthPage ? (
        <Outlet />
      ) : (
        <MainLayout>
          <Outlet />
        </MainLayout>
      )}

      {/* Todo Modal */}
      {isModalOpen && (modalType === 'add' || modalType === 'edit') && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title={getModalTitle()}
          size="md"
        >
          <TodoForm todo={selectedTodo} />
        </Modal>
      )}
    </div>
  );
}

export default App;
