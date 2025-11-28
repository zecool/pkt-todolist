import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

// Todo service functions
export const todoService = {
  // Get todos with filters
  getTodos: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query parameters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const queryString = params.toString();
      const endpoint = queryString ? `${API_ENDPOINTS.TODOS.BASE}?${queryString}` : API_ENDPOINTS.TODOS.BASE;
      
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get todo by ID
  getTodoById: async (id) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.TODOS.BASE}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new todo
  createTodo: async (todoData) => {
    try {
      const response = await api.post(API_ENDPOINTS.TODOS.BASE, todoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update todo
  updateTodo: async (id, updateData) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.TODOS.BASE}/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Complete todo
  completeTodo: async (id) => {
    try {
      const response = await api.patch(API_ENDPOINTS.TODOS.COMPLETE(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete todo (move to trash)
  deleteTodo: async (id) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.TODOS.BASE}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Restore todo from trash
  restoreTodo: async (id) => {
    try {
      const response = await api.patch(API_ENDPOINTS.TODOS.RESTORE(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default todoService;