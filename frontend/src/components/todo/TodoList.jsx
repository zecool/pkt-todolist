import React from 'react';
import TodoCard from './TodoCard';
import { TODO_STATUS } from '../../constants/todoStatus';

const TodoList = ({ 
  todos, 
  onEdit, 
  onDelete, 
  onComplete,
  isLoading,
  emptyMessage = "할일이 없습니다"
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!todos || todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-2xl text-gray-400">📋</span>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{emptyMessage}</h3>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map(todo => (
        <TodoCard
          key={todo.todoId}
          todo={todo}
          onEdit={onEdit}
          onDelete={onDelete}
          onComplete={onComplete}
        />
      ))}
    </div>
  );
};

export default TodoList;