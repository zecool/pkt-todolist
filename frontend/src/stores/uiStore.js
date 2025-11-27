import { create } from 'zustand';

export const useUiStore = create((set) => ({
  // State
  isModalOpen: false,
  modalType: null, // 'create', 'edit', 'confirm', etc.
  selectedTodo: null,
  isDarkMode: false,

  // Actions
  openModal: (modalType, todo = null) => set({
    isModalOpen: true,
    modalType,
    selectedTodo: todo,
  }),

  closeModal: () => set({
    isModalOpen: false,
    modalType: null,
    selectedTodo: null,
  }),

  toggleDarkMode: () => set((state) => ({
    isDarkMode: !state.isDarkMode,
  })),

  setSelectedTodo: (todo) => set({
    selectedTodo: todo,
  }),
}));