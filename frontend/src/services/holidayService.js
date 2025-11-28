import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

// Holiday service functions
export const holidayService = {
  // Get holidays with optional filters
  getHolidays: async (year, month) => {
    try {
      const params = new URLSearchParams();
      
      if (year) params.append('year', year);
      if (month) params.append('month', month);
      
      const queryString = params.toString();
      const endpoint = queryString ? `${API_ENDPOINTS.HOLIDAYS.BASE}?${queryString}` : API_ENDPOINTS.HOLIDAYS.BASE;
      
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new holiday (admin only)
  createHoliday: async (holidayData) => {
    try {
      const response = await api.post(API_ENDPOINTS.HOLIDAYS.BASE, holidayData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update holiday (admin only)
  updateHoliday: async (id, updateData) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.HOLIDAYS.BASE}/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default holidayService;