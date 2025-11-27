import React, { useState, useEffect } from 'react';
import { useTodoStore } from '../stores/todoStore';
import { useUiStore } from '../stores/uiStore';
import { useHolidayStore } from '../stores/holidayStore';
import TodoItem from '../components/todo/TodoItem';
import Modal from '../components/common/Modal';
import TodoForm from '../components/todo/TodoForm';
import Button from '../components/common/Button';
import { Plus, Calendar, Clock } from 'lucide-react';
import { isToday, isThisWeek, parseISO } from 'date-fns';

const TodoListPage = () => {
  const {
    todos,
    isLoading,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    setFilters
  } = useTodoStore();

  const {
    isModalOpen,
    modalType,
    selectedTodo,
    openModal,
    closeModal
  } = useUiStore();

  const { holidays, fetchHolidays } = useHolidayStore();

  // Track active filter
  const [activeFilter, setActiveFilter] = useState('all');

  // Load todos and holidays on component mount
  useEffect(() => {
    fetchTodos();
    fetchHolidays(new Date().getFullYear());
  }, [fetchTodos, fetchHolidays]);

  const handleCreateTodo = async (formData) => {
    try {
      await createTodo(formData);
      closeModal();
    } catch (error) {
      console.error('할일 생성 실패:', error);
    }
  };

  const handleUpdateTodo = async (formData) => {
    try {
      await updateTodo(selectedTodo.todoId, formData);
      closeModal();
    } catch (error) {
      console.error('할일 수정 실패:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTodo(selectedTodo.todoId);
      closeModal();
    } catch (error) {
      console.error('할일 삭제 실패:', error);
    }
  };

  const handleModalSubmit = (formData) => {
    if (modalType === 'edit') {
      handleUpdateTodo(formData);
    } else {
      handleCreateTodo(formData);
    }
  };

  const handleAddNewTodo = () => {
    openModal('create');
  };

  const handleFilterChange = (filterType) => {
    setActiveFilter(filterType);

    switch(filterType) {
      case 'all':
        setFilters({ status: null, search: '', sortBy: 'createdAt', order: 'desc' });
        break;
      case 'today':
        // This will be handled with client-side filtering
        setFilters({ status: null, search: '', sortBy: 'createdAt', order: 'desc' });
        break;
      case 'thisWeek':
        // This will be handled with client-side filtering
        setFilters({ status: null, search: '', sortBy: 'createdAt', order: 'desc' });
        break;
      case 'completed':
        setFilters({ status: 'completed', search: '', sortBy: 'createdAt', order: 'desc' });
        break;
      case 'pending':
        setFilters({ status: 'active', search: '', sortBy: 'createdAt', order: 'desc' });
        break;
      default:
        setFilters({ status: 'active', search: '', sortBy: 'createdAt', order: 'desc' });
    }
  };

  // Apply client-side filtering based on active filter
  const getFilteredTodos = () => {
    switch(activeFilter) {
      case 'today':
        return todos.filter(todo =>
          todo.dueDate && isToday(parseISO(todo.dueDate))
        );
      case 'thisWeek':
        return todos.filter(todo =>
          todo.dueDate && isThisWeek(parseISO(todo.dueDate), { weekStartsOn: 0 })
        );
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#212121]">할일 목록</h1>
        <Button
          variant="primary"
          onClick={handleAddNewTodo}
          className="flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" />
          새 할일 추가
        </Button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center ${
            activeFilter === 'all' ? 'bg-[#00C73C] text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => handleFilterChange('all')}
        >
          <span>전체</span>
        </button>
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center ${
            activeFilter === 'today' ? 'bg-[#00C73C] text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => handleFilterChange('today')}
        >
          <Calendar className="w-4 h-4 mr-1" />
          <span>오늘</span>
        </button>
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center ${
            activeFilter === 'thisWeek' ? 'bg-[#00C73C] text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => handleFilterChange('thisWeek')}
        >
          <Clock className="w-4 h-4 mr-1" />
          <span>이번주</span>
        </button>
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            activeFilter === 'completed' ? 'bg-[#00C73C] text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => handleFilterChange('completed')}
        >
          완료
        </button>
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            activeFilter === 'pending' ? 'bg-[#00C73C] text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => handleFilterChange('pending')}
        >
          미완료
        </button>
      </div>

      {/* Main content with todos and holidays panel */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Todo List */}
        <div className="lg:w-3/4">
          {isLoading ? (
            <div className="text-center py-8">로딩 중...</div>
          ) : filteredTodos.length > 0 ? (
            <div>
              {filteredTodos.map(todo => (
                <TodoItem key={todo.todoId} todo={todo} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#757575]">
              등록된 할일이 없습니다.
            </div>
          )}
        </div>

        {/* Holidays Panel (Right side) */}
        <div className="lg:w-1/4">
          <div className="bg-[#F9F9F9] rounded-xl p-4 border border-[#E0E0E0]">
            <h2 className="font-bold text-lg text-[#212121] mb-3">국경일</h2>
            <div className="space-y-3">
              {holidays.length > 0 ? (
                holidays.map(holiday => (
                  <div key={holiday.holidayId} className="text-red-600">
                    <div className="font-medium">{holiday.title}</div>
                    <div className="text-sm">{holiday.date}</div>
                  </div>
                ))
              ) : (
                <div className="text-[#757575]">국경일 정보가 없습니다.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Todo Form */}
      <Modal
        isOpen={isModalOpen && (modalType === 'create' || modalType === 'edit')}
        onClose={closeModal}
        title={modalType === 'edit' ? '할일 수정' : '새 할일 추가'}
        size="lg"
      >
        <TodoForm
          initialData={modalType === 'edit' ? selectedTodo : null}
          onSubmit={handleModalSubmit}
          onCancel={closeModal}
          submitButtonText={modalType === 'edit' ? '수정' : '추가'}
        />
      </Modal>

      {/* Confirmation Modal for Delete */}
      <Modal
        isOpen={isModalOpen && modalType === 'confirm-delete'}
        onClose={closeModal}
        title="할일 삭제 확인"
      >
        <p className="mb-4">
          '{selectedTodo?.title}' 할일을 정말 삭제하시겠습니까?
        </p>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={closeModal}>취소</Button>
          <Button variant="danger" onClick={handleConfirmDelete}>삭제</Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoListPage;