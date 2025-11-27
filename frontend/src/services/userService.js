import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const userService = {
  getProfile: async () => {
    const response = await api.get(API_ENDPOINTS.USER.PROFILE);
    return response.data;
  },

  updateProfile: async (updateData) => {
    const response = await api.put(API_ENDPOINTS.USER.PROFILE, updateData);
    return response.data;
  },
};