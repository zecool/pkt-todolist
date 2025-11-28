import { create } from 'zustand';
import { tokenManager } from '../utils/tokenManager';
import api from '../services/api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { userService } from '../services/userService';

// Auth store using Zustand
const useAuthStore = create((set, get) => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Actions
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      if (response.data.success) {
        const { accessToken, refreshToken, user } = response.data.data;
        
        // Store tokens
        tokenManager.setTokens(accessToken, refreshToken);
        
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        
        return { success: true, data: user };
      } else {
        throw new Error(response.data.error?.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Login failed';
      
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  register: async (email, password, username) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
        email,
        password,
        username,
      });

      if (response.data.success) {
        const { accessToken, refreshToken, user } = response.data.data;
        
        // Store tokens
        tokenManager.setTokens(accessToken, refreshToken);
        
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        
        return { success: true, data: user };
      } else {
        throw new Error(response.data.error?.message || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Registration failed';
      
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  logout: () => {
    // Remove tokens from storage
    tokenManager.removeTokens();
    
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  refreshToken: async () => {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post(API_ENDPOINTS.AUTH.REFRESH, {
        refreshToken,
      });

      if (response.data.success) {
        const { accessToken } = response.data.data;
        
        // Update access token
        tokenManager.setTokens(accessToken, refreshToken);
        
        // Optionally update user state if needed
        return { success: true, accessToken };
      } else {
        throw new Error(response.data.error?.message || 'Token refresh failed');
      }
    } catch (error) {
      // If refresh fails, log out user
      get().logout();
      throw error;
    }
  },

  // Initialize auth state from token
  initializeAuth: () => {
    const token = tokenManager.getAccessToken();
    if (token && tokenManager.isAuthenticated()) {
      try {
        const decodedToken = tokenManager.decodeToken(token);
        if (decodedToken) {
          set({
            user: {
              userId: decodedToken.userId,
              email: decodedToken.email,
              username: decodedToken.username,
              role: decodedToken.role,
            },
            isAuthenticated: true,
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      }
    }
  },

  // Update user profile
  updateProfile: async (updateData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await userService.updateProfile(updateData);

      // Update the user info in the store
      set((state) => ({
        user: {
          ...state.user,
          ...updateData,
        },
        isLoading: false,
      }));

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Profile update failed';

      set({
        isLoading: false,
        error: errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  },
}));

export default useAuthStore;