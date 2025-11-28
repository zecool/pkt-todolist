import React from 'react';
import { format, isBefore, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar, Edit3, Trash2 } from 'lucide-react';
import { TODO_STATUS, TODO_STATUS_LABELS } from '../../constants/todoStatus';
import { formatDateRange, isDateOverdue } from '../../utils/dateFormatter';

const TodoCard = ({ todo, onEdit, onDelete, onComplete }) => {
  const {
    todoId,
    title,
    content,
    startDate,
    dueDate,
    isCompleted,
    status,
    createdAt,
    updatedAt,
  } = todo;

  // Determine the display status
  const displayStatus = isCompleted ? TODO_STATUS.COMPLETED : status;
  
  // Determine if the todo is overdue
  const isOverdue = isDateOverdue(dueDate, isCompleted);
  
  // Determine CSS classes based on status
  const statusClasses = {
    [TODO_STATUS.ACTIVE]: isCompleted 
      ? 'border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20' 
      : isOverdue
        ? 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/20'
        : 'border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-900/20',
    [TODO_STATUS.COMPLETED]: 'border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20',
    [TODO_STATUS.DELETED]: 'border-l-4 border-l-gray-500 bg-gray-50 dark:bg-gray-700/20',
  };
  
  // Status badge classes
  const statusBadgeClasses = {
    [TODO_STATUS.ACTIVE]: isCompleted 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' 
      : isOverdue
        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
        : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200',
    [TODO_STATUS.COMPLETED]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    [TODO_STATUS.DELETED]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  };

  return (
    <div className={`rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm transition-all hover:shadow-md ${statusClasses[status]}`}>
      <div className="flex items-start">
        {/* Checkbox */}
        <button
          onClick={() => onComplete && onComplete(todoId)}
          className="flex-shrink-0 mt-1 mr-3"
          aria-label={isCompleted ? '할일 미완료로 표시' : '할일 완료로 표시'}
          disabled={status === TODO_STATUS.DELETED}
        >
          <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
            isCompleted 
              ? 'bg-green-500 border-green-500' 
              : 'border-gray-300 dark:border-gray-600'
          }`}>
            {isCompleted && (
              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </button>

        {/* Todo Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`text-base font-medium truncate ${
              isCompleted 
                ? 'text-gray-500 dark:text-gray-400 line-through' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {title}
            </h3>
            <div className="flex items-center space-x-2">
              {status !== TODO_STATUS.DELETED && (
                <>
                  <button
                    onClick={() => onEdit && onEdit(todo)}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="수정"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(todoId)}
                    className="text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="삭제"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
          
          {content && (
            <p className={`mt-1 text-sm truncate ${
              isCompleted 
                ? 'text-gray-400 dark:text-gray-500' 
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {content}
            </p>
          )}
          
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {startDate || dueDate ? (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Calendar size={12} className="mr-1" />
                <span>{formatDateRange(startDate, dueDate)}</span>
              </div>
            ) : null}
            
            {(status === TODO_STATUS.ACTIVE || status === TODO_STATUS.COMPLETED) && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadgeClasses[displayStatus]}`}>
                {TODO_STATUS_LABELS[displayStatus]}
              </span>
            )}
            
            {isOverdue && !isCompleted && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">
                만료됨
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;