import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

// Authentication service functions
export const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Register new user
  register: async (email, password, username) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
        email,
        password,
        username,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Refresh access token
  refreshToken: async (refreshToken) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REFRESH, {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout user (currently just for documentation as backend doesn't require API call)
  logout: async () => {
    // Client-side logout is handled by removing tokens from storage
    // Backend doesn't maintain server-side session
    return { success: true, message: 'Logged out successfully' };
  },
};

export default authService;