import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const authService = {
  login: async (email, password) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
    return response.data;
  },

  register: async (email, password, username) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, { email, password, username });
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
    return response.data;
  },
};