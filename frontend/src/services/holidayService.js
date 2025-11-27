import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const holidayService = {
  getHolidays: async (year, month) => {
    const params = new URLSearchParams();
    
    if (year) params.append('year', year);
    if (month) params.append('month', month);
    
    const queryString = params.toString();
    const endpoint = queryString ? `${API_ENDPOINTS.HOLIDAYS.GET}?${queryString}` : API_ENDPOINTS.HOLIDAYS.GET;
    
    const response = await api.get(endpoint);
    return response.data;
  },

  createHoliday: async (holidayData) => {
    const response = await api.post(API_ENDPOINTS.HOLIDAYS.CREATE, holidayData);
    return response.data;
  },

  updateHoliday: async (id, updateData) => {
    const response = await api.put(API_ENDPOINTS.HOLIDAYS.UPDATE(id), updateData);
    return response.data;
  },
};