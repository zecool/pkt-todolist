import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import useTodoStore from '../stores/todoStore';
import useUiStore from '../stores/uiStore';
import TodoFilter from '../components/todo/TodoFilter';
import TodoList from '../components/todo/TodoList';
import Button from '../components/common/Button';

const TodoListPage = () => {
  const { 
    todos, 
    isLoading, 
    error, 
    fetchTodos, 
    completeTodo, 
    deleteTodo,
    getFilteredTodos
  } = useTodoStore();

  const { openModal } = useUiStore();
  
  // Initialize filters
  const [filters, setFilters] = useState({
    status: null,
    search: '',
    sortBy: 'createdAt',
    order: 'desc'
  });

  // Fetch todos when component mounts or filters change
  useEffect(() => {
    fetchTodos(filters);
  }, [filters, fetchTodos]);

  // Handle todo completion
  const handleCompleteTodo = async (todoId) => {
    await completeTodo(todoId);
  };

  // Handle todo deletion
  const handleDeleteTodo = async (todoId) => {
    await deleteTodo(todoId);
  };

  // Handle edit todo
  const handleEditTodo = (todo) => {
    openModal('edit', todo);
  };

  // Handle adding a new todo
  const handleAddTodo = () => {
    openModal('add');
  };

  // Get filtered and sorted todos
  const filteredTodos = getFilteredTodos();

  return (
    <div className="w-full max-w-full relative">
      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">할일 목록</h1>
        <Button
          onClick={handleAddTodo}
          variant="primary"
          className="hidden sm:flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          새 할일 추가
        </Button>
      </div>

      {/* Filter Section */}
      <TodoFilter
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">에러 발생</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Todo List */}
      <TodoList
        todos={filteredTodos}
        onEdit={handleEditTodo}
        onDelete={handleDeleteTodo}
        onComplete={handleCompleteTodo}
        isLoading={isLoading}
        emptyMessage="할일이 없습니다. 새 할일을 추가해보세요!"
      />

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={handleAddTodo}
        className="sm:hidden fixed bottom-20 right-6 z-50 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        aria-label="새 할일 추가"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
};

export default TodoListPage;