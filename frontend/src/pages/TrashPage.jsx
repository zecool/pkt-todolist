import React, { useEffect } from 'react';
import { useTodoStore } from '../stores/todoStore';
import { useUiStore } from '../stores/uiStore';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { trashService } from '../services/trashService';

const TrashPage = () => {
  const {
    todos,
    isLoading,
    fetchTodos,
    restoreTodo
  } = useTodoStore();

  const {
    isModalOpen,
    modalType,
    selectedTodo,
    openModal,
    closeModal
  } = useUiStore();

  // Load only deleted todos on component mount
  useEffect(() => {
    fetchTodos({ status: 'deleted' });
  }, [fetchTodos]);

  const handleConfirmRestore = async () => {
    try {
      await restoreTodo(selectedTodo.todoId);
      closeModal();
    } catch (error) {
      console.error('할일 복원 실패:', error);
    }
  };

  const handleConfirmPermanentDelete = async () => {
    try {
      // Use the trash service for permanent deletion
      await trashService.permanentlyDelete(selectedTodo.todoId);
      closeModal();
      // Refresh the list after deletion
      fetchTodos({ status: 'deleted' });
    } catch (error) {
      console.error('할일 영구 삭제 실패:', error);
    }
  };

  // Filter to only show deleted todos
  const deletedTodos = todos.filter(todo => todo.status === 'deleted');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#212121]">휴지통</h1>
        <p className="text-[#757575] mt-1">삭제된 할일 목록 (30일 후 자동으로 영구 삭제됩니다)</p>
      </div>

      {isLoading ? (
        <div className="text-center py-8">로딩 중...</div>
      ) : deletedTodos.length > 0 ? (
        <div>
          {deletedTodos.map(todo => (
            <div key={todo.todoId} className="p-4 bg-white rounded-lg border border-[#E0E0E0] mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="mr-3 text-gray-400">⊗</span>
                  <div>
                    <h3 className="font-medium text-[#212121] line-through">{todo.title}</h3>
                    <div className="flex items-center text-xs text-[#757575] mt-1">
                      <span>📅 삭제 시간: {todo.deletedAt ? new Date(todo.deletedAt).toLocaleString('ko-KR') : '알 수 없음'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openModal('confirm-restore', todo)}
                  >
                    복원
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => openModal('confirm-permanent-delete', todo)}
                  >
                    영구 삭제
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-[#757575]">
          휴지통이 비어 있습니다.
        </div>
      )}

      {/* Confirmation Modal for Restore */}
      <Modal
        isOpen={isModalOpen && modalType === 'confirm-restore'}
        onClose={closeModal}
        title="할일 복원 확인"
      >
        <p className="mb-4">
          '{selectedTodo?.title}' 할일을 복원하시겠습니까?
        </p>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={closeModal}>취소</Button>
          <Button variant="primary" onClick={handleConfirmRestore}>복원</Button>
        </div>
      </Modal>

      {/* Confirmation Modal for Permanent Delete */}
      <Modal
        isOpen={isModalOpen && modalType === 'confirm-permanent-delete'}
        onClose={closeModal}
        title="할일 영구 삭제 확인"
      >
        <p className="mb-4">
          '{selectedTodo?.title}' 할일을 영구 삭제하시겠습니까?<br />
          이 작업은 되돌릴 수 없습니다.
        </p>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={closeModal}>취소</Button>
          <Button variant="danger" onClick={handleConfirmPermanentDelete}>영구 삭제</Button>
        </div>
      </Modal>
    </div>
  );
};

export default TrashPage;