import { create } from 'zustand';
import { authService } from '../services/authService';
import { tokenManager } from '../utils/tokenManager';

export const useAuthStore = create((set) => ({
  // State
  user: null,
  isAuthenticated: tokenManager.isAuthenticated(),
  isLoading: false,
  error: null,

  // Actions
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.login(email, password);
      const { data } = response;
      
      // Save tokens
      tokenManager.setAccessToken(data.accessToken);
      tokenManager.setRefreshToken(data.refreshToken);
      
      // Set user data and authentication state
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return { success: true, data };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || '로그인에 실패했습니다';
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  register: async (email, password, username) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.register(email, password, username);
      const { data } = response;
      
      // Save tokens
      tokenManager.setAccessToken(data.accessToken);
      tokenManager.setRefreshToken(data.refreshToken);
      
      // Set user data and authentication state
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return { success: true, data };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || '회원가입에 실패했습니다';
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  logout: () => {
    // Clear tokens
    tokenManager.clearTokens();
    
    // Reset state
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  refreshToken: async () => {
    set({ isLoading: true });
    
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await authService.refreshToken(refreshToken);
      const { data } = response;
      
      // Update access token
      tokenManager.setAccessToken(data.accessToken);
      
      // Update loading state
      set({ isLoading: false });
      
      return { success: true, data };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || '토큰 갱신에 실패했습니다';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      // Clear tokens if refresh fails
      tokenManager.clearTokens();
      set({
        user: null,
        isAuthenticated: false,
      });
      
      throw error;
    }
  },

  // Initialize auth state from stored tokens
  initializeAuth: () => {
    if (tokenManager.isAuthenticated()) {
      set({
        isAuthenticated: true,
        // We don't set user here since we need to fetch user data
        // This would typically be done in a separate action or effect
      });
    }
  },
}));