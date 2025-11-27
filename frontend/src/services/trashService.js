import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const trashService = {
  getTrash: async () => {
    const response = await api.get(API_ENDPOINTS.TRASH.GET);
    return response.data;
  },

  permanentlyDelete: async (id) => {
    const response = await api.delete(API_ENDPOINTS.TRASH.PERMANENT_DELETE(id));
    return response.data;
  },
};