import { create } from 'zustand';
import { todoService } from '../services/todoService';

export const useTodoStore = create((set, get) => ({
  // State
  todos: [],
  isLoading: false,
  error: null,
  filters: {
    status: 'active', // Default to active todos
    search: '',
    sortBy: 'createdAt', // Default sort by creation date
    order: 'desc', // Default descending order
  },

  // Actions
  fetchTodos: async () => {
    set({ isLoading: true, error: null });

    try {
      // Only send status filter to the API if it's not null
      const { status, ...otherFilters } = get().filters;
      const apiFilters = status ? { status, ...otherFilters } : { ...otherFilters };

      const response = await todoService.getTodos(apiFilters);
      set({
        todos: response.data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || '할일 목록을 불러오는데 실패했습니다';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  createTodo: async (todoData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await todoService.createTodo(todoData);
      const newTodo = response.data;
      
      // Add the new todo to the list
      set((state) => ({
        todos: [newTodo, ...state.todos],
        isLoading: false,
        error: null,
      }));
      
      return { success: true, data: newTodo };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || '할일을 생성하는데 실패했습니다';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  updateTodo: async (id, updateData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await todoService.updateTodo(id, updateData);
      const updatedTodo = response.data;
      
      // Update the todo in the list
      set((state) => ({
        todos: state.todos.map(todo => 
          todo.todoId === id ? updatedTodo : todo
        ),
        isLoading: false,
        error: null,
      }));
      
      return { success: true, data: updatedTodo };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || '할일을 수정하는데 실패했습니다';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  deleteTodo: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await todoService.deleteTodo(id);
      const deletedTodo = response.data;
      
      // Update the todo status in the list (soft delete)
      set((state) => ({
        todos: state.todos.map(todo => 
          todo.todoId === id 
            ? { ...todo, status: 'deleted', deletedAt: deletedTodo.deletedAt } 
            : todo
        ),
        isLoading: false,
        error: null,
      }));
      
      return { success: true, data: deletedTodo };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || '할일을 삭제하는데 실패했습니다';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  restoreTodo: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await todoService.restoreTodo(id);
      const restoredTodo = response.data;
      
      // Update the todo status in the list (restore)
      set((state) => ({
        todos: state.todos.map(todo => 
          todo.todoId === id 
            ? { ...todo, status: 'active', deletedAt: null } 
            : todo
        ),
        isLoading: false,
        error: null,
      }));
      
      return { success: true, data: restoredTodo };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || '할일을 복원하는데 실패했습니다';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));

    // Fetch todos with new filters
    get().fetchTodos();
  },

  resetFilters: () => {
    set({
      filters: {
        status: 'active',
        search: '',
        sortBy: 'createdAt',
        order: 'desc',
      }
    });

    // Fetch todos with default filters
    get().fetchTodos();
  },

  // Set todo as complete
  completeTodo: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await todoService.completeTodo(id);
      const completedTodo = response.data;
      
      // Update the todo status in the list
      set((state) => ({
        todos: state.todos.map(todo => 
          todo.todoId === id 
            ? { ...todo, isCompleted: true, status: completedTodo.status } 
            : todo
        ),
        isLoading: false,
        error: null,
      }));
      
      return { success: true, data: completedTodo };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || '할일 완료 처리에 실패했습니다';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },
}));