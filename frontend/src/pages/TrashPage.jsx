import React, { useEffect } from 'react';
import { Trash2, RotateCcw, AlertCircle } from 'lucide-react';
import useTodoStore from '../stores/todoStore';
import TodoList from '../components/todo/TodoList';
import Button from '../components/common/Button';
import { TODO_STATUS } from '../constants/todoStatus';

const TrashPage = () => {
  const { 
    todos, 
    isLoading, 
    error, 
    fetchTodos,
    restoreTodo,
    deleteTodo: permanentDeleteTodo
  } = useTodoStore();

  // Fetch deleted todos when component mounts
  useEffect(() => {
    fetchTodos({ status: TODO_STATUS.DELETED });
  }, [fetchTodos]);

  // Handle restore todo
  const handleRestoreTodo = async (todoId) => {
    await restoreTodo(todoId);
    // Refresh the list after restore
    fetchTodos({ status: TODO_STATUS.DELETED });
  };

  // Handle permanent delete
  const handlePermanentDelete = async (todoId) => {
    if (window.confirm('정말로 이 할일을 영구 삭제하시겠습니까? 복구할 수 없습니다.')) {
      await permanentDeleteTodo(todoId);
      // Refresh the list after deletion
      fetchTodos({ status: TODO_STATUS.DELETED });
    }
  };

  // Filter to only show deleted todos
  const deletedTodos = todos.filter(todo => todo.status === TODO_STATUS.DELETED);

  return (
    <div className="w-full max-w-full">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">휴지통</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          삭제된 할일 {deletedTodos.length}개
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start">
        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <p className="text-sm text-yellow-800">
            삭제된 할일은 30일 후 자동으로 영구 삭제됩니다.
          </p>
        </div>
      </div>

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
      <div className="space-y-3">
        {deletedTodos.map(todo => (
          <div key={todo.todoId} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1 mr-3 opacity-50">
                <Trash2 size={20} className="text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-gray-500 dark:text-gray-400 line-through">
                    {todo.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestoreTodo(todo.todoId)}
                      className="text-green-600 hover:text-green-700 border-green-300"
                    >
                      <RotateCcw size={14} className="mr-1" />
                      복원
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePermanentDelete(todo.todoId)}
                      className="text-red-600 hover:text-red-700 border-red-300"
                    >
                      <Trash2 size={14} className="mr-1" />
                      영구 삭제
                    </Button>
                  </div>
                </div>

                {todo.content && (
                  <p className="mt-1 text-sm text-gray-400 line-through">
                    {todo.content}
                  </p>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {todo.startDate || todo.dueDate ? (
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span>📅 {todo.startDate} ~ {todo.dueDate}</span>
                    </div>
                  ) : null}

                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    삭제됨
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {deletedTodos.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Trash2 className="text-gray-400" size={24} />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">휴지통이 비어있습니다</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrashPage;