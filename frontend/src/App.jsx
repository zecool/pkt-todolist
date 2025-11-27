import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import './App.css';

function App() {
  const { initializeAuth } = useAuthStore();

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div className="App">
      {/* Routes are handled by RouterProvider in main.jsx */}
    </div>
  );
}

export default App;
