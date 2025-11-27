import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const todoService = {
  getTodos: async (filters = {}) => {
    const params = new URLSearchParams();

    // Add filters as query parameters
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.order) params.append('order', filters.order);

    const queryString = params.toString();
    const endpoint = queryString ? `${API_ENDPOINTS.TODOS.GET_ALL}?${queryString}` : API_ENDPOINTS.TODOS.GET_ALL;

    const response = await api.get(endpoint);
    return response.data;
  },

  getTodoById: async (id) => {
    const response = await api.get(API_ENDPOINTS.TODOS.GET_BY_ID(id));
    return response.data;
  },

  createTodo: async (todoData) => {
    const response = await api.post(API_ENDPOINTS.TODOS.CREATE, todoData);
    return response.data;
  },

  updateTodo: async (id, updateData) => {
    const response = await api.put(API_ENDPOINTS.TODOS.UPDATE(id), updateData);
    return response.data;
  },

  completeTodo: async (id) => {
    const response = await api.patch(API_ENDPOINTS.TODOS.COMPLETE(id));
    return response.data;
  },

  deleteTodo: async (id) => {
    const response = await api.delete(API_ENDPOINTS.TODOS.DELETE(id));
    return response.data;
  },

  restoreTodo: async (id) => {
    const response = await api.patch(API_ENDPOINTS.TODOS.RESTORE(id));
    return response.data;
  },
};