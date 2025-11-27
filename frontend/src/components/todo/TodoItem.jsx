import React from 'react';
import { useTodoStore } from '../../stores/todoStore';
import { useUiStore } from '../../stores/uiStore';
import { TODO_STATUS } from '../../constants/todoStatus';
import { format, isBefore, isToday, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Check, MoreVertical } from 'lucide-react';

const TodoItem = ({ todo }) => {
  const { completeTodo, deleteTodo } = useTodoStore();
  const { openModal } = useUiStore();

  const handleToggleComplete = async () => {
    if (!todo.isCompleted) {
      await completeTodo(todo.todoId);
    }
  };

  const handleEdit = () => {
    openModal('edit', todo);
  };

  const handleDelete = () => {
    // For active todos, move to trash.
    // For deleted todos, we should not allow permanent deletion from the main TodoListPage
    // Permanent deletion should only happen on the TrashPage
    openModal('confirm-delete', todo);
  };

  const getStatusColor = (status, isCompleted) => {
    if (isCompleted) return 'bg-[#66BB6A]'; // Green for completed
    if (status === TODO_STATUS.ACTIVE) {
      // Check if due date is past due
      if (todo.dueDate && isBefore(parseISO(todo.dueDate), new Date())) {
        return 'bg-[#F44336]'; // Red for overdue
      }
      return 'bg-[#FF7043]'; // Orange for active
    }
    return 'bg-[#BDBDBD]'; // Gray for deleted
  };

  const getBadgeText = (status, isCompleted) => {
    if (isCompleted) return '완료';
    if (status === TODO_STATUS.ACTIVE) {
      if (todo.dueDate && isBefore(parseISO(todo.dueDate), new Date())) {
        return '기한지남';
      }
      return '진행 중';
    }
    if (status === TODO_STATUS.DELETED) return '삭제됨';
    return '예정';
  };

  // Determine if the due date is close (within 1 day)
  const isDueSoon = todo.dueDate &&
    !isToday(parseISO(todo.dueDate)) &&
    isBefore(new Date(), parseISO(todo.dueDate)) &&
    isBefore(new Date(Date.now() + 24 * 60 * 60 * 1000), parseISO(todo.dueDate));

  return (
    <div className={`p-4 rounded-lg border border-[#E0E0E0] mb-3 transition-all duration-200 ${
      todo.isCompleted ? 'bg-[#F1F8E9]' : 'bg-white'
    }`}>
      <div className="flex items-start">
        <button
          onClick={handleToggleComplete}
          className={`mr-3 mt-1 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center ${
            todo.isCompleted
              ? 'bg-[#4CAF50] border-[#4CAF50]'
              : 'border-[#BDBDBD] hover:border-[#00C73C]'
          }`}
          disabled={todo.isCompleted}
          aria-label={todo.isCompleted ? '완료됨' : '완료 처리'}
        >
          {todo.isCompleted && <Check className="w-4 h-4 text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`font-medium truncate ${
              todo.isCompleted ? 'line-through text-[#757575]' : 'text-[#212121]'
            }`}>
              {todo.title}
            </h3>

            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(todo.status, todo.isCompleted)}`}>
                {getBadgeText(todo.status, todo.isCompleted)}
              </span>

              <button className="p-1 text-[#757575] hover:text-[#424242]">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {todo.content && (
            <p className="text-sm text-[#757575] mt-1 truncate">
              {todo.content}
            </p>
          )}

          {todo.startDate && todo.dueDate && (
            <div className="flex items-center mt-2 text-xs text-[#757575]">
              <span className="mr-2">
                📅 {format(parseISO(todo.startDate), 'MM-dd', { locale: ko })} ~ {format(parseISO(todo.dueDate), 'MM-dd', { locale: ko })}
              </span>
              {isDueSoon && <span className="text-[#F44336]">곧 마감</span>}
            </div>
          )}

          <div className="flex space-x-2 mt-3">
            <button
              onClick={handleEdit}
              className="text-xs px-3 py-1 bg-[#0066FF] text-white rounded hover:bg-[#0056D2] transition-colors"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="text-xs px-3 py-1 bg-[#F44336] text-white rounded hover:bg-[#D32F2F] transition-colors"
            >
              {todo.status === TODO_STATUS.DELETED ? '영구 삭제' : '삭제'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;