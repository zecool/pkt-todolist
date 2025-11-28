import { create } from 'zustand';
import { todoService } from '../services/todoService';
import { TODO_STATUS } from '../constants/todoStatus';

// Todo store using Zustand
const useTodoStore = create((set, get) => ({
  // State
  todos: [],
  isLoading: false,
  error: null,
  filters: {
    status: null, // 'active', 'completed', 'deleted', or null for all
    search: '',
    sortBy: 'createdAt', // 'dueDate', 'createdAt'
    order: 'desc', // 'asc', 'desc'
  },

  // Actions
  fetchTodos: async (additionalFilters = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      // Combine current filters with additional filters
      const filters = { ...get().filters, ...additionalFilters };
      const response = await todoService.getTodos(filters);
      
      set({
        todos: response.data || [],
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error?.message || error.message || 'Failed to fetch todos',
      });
    }
  },

  createTodo: async (todoData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await todoService.createTodo(todoData);
      const newTodo = response.data;
      
      // Add new todo to the list
      set(state => ({
        todos: [newTodo, ...state.todos],
        isLoading: false,
      }));
      
      return { success: true, data: newTodo };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to create todo';
      
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  updateTodo: async (id, updateData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await todoService.updateTodo(id, updateData);
      const updatedTodo = response.data;
      
      // Update the todo in the list
      set(state => ({
        todos: state.todos.map(todo => 
          todo.todoId === id ? updatedTodo : todo
        ),
        isLoading: false,
      }));
      
      return { success: true, data: updatedTodo };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to update todo';
      
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  completeTodo: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await todoService.completeTodo(id);
      const updatedTodo = response.data;
      
      // Update the todo in the list
      set(state => ({
        todos: state.todos.map(todo => 
          todo.todoId === id ? updatedTodo : todo
        ),
        isLoading: false,
      }));
      
      return { success: true, data: updatedTodo };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to complete todo';
      
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  deleteTodo: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await todoService.deleteTodo(id);
      const deletedTodo = response.data;
      
      // Update the todo in the list
      set(state => ({
        todos: state.todos.map(todo => 
          todo.todoId === id ? deletedTodo : todo
        ),
        isLoading: false,
      }));
      
      return { success: true, data: deletedTodo };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to delete todo';
      
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  restoreTodo: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await todoService.restoreTodo(id);
      const restoredTodo = response.data;
      
      // Update the todo in the list
      set(state => ({
        todos: state.todos.map(todo => 
          todo.todoId === id ? restoredTodo : todo
        ),
        isLoading: false,
      }));
      
      return { success: true, data: restoredTodo };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to restore todo';
      
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  setFilters: (newFilters) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  // Filter todos based on current filters
  getFilteredTodos: () => {
    const { todos, filters } = get();
    let filteredTodos = [...todos];

    // Apply status filter
    if (filters.status) {
      filteredTodos = filteredTodos.filter(todo => 
        todo.status === filters.status
      );
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredTodos = filteredTodos.filter(todo =>
        todo.title.toLowerCase().includes(searchTerm) ||
        (todo.content && todo.content.toLowerCase().includes(searchTerm))
      );
    }

    // Apply sorting
    filteredTodos.sort((a, b) => {
      let aValue, bValue;
      
      if (filters.sortBy === 'dueDate') {
        aValue = a.dueDate ? new Date(a.dueDate) : new Date(8640000000000000); // Max date if no due date
        bValue = b.dueDate ? new Date(b.dueDate) : new Date(8640000000000000);
      } else { // createdAt
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
      }
      
      if (filters.order === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return filteredTodos;
  },

  // Get todo by ID
  getTodoById: (id) => {
    return get().todos.find(todo => todo.todoId === id);
  },

  // Get count of active todos
  getActiveCount: () => {
    return get().todos.filter(todo => todo.status === TODO_STATUS.ACTIVE && !todo.isCompleted).length;
  },

  // Get count of completed todos
  getCompletedCount: () => {
    return get().todos.filter(todo => todo.status === TODO_STATUS.ACTIVE && todo.isCompleted).length;
  },
}));

export default useTodoStore;