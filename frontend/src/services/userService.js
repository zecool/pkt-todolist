import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

// User service functions
export const userService = {
  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.USERS.PROFILE);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (updateData) => {
    try {
      const response = await api.patch(API_ENDPOINTS.USERS.PROFILE, updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;