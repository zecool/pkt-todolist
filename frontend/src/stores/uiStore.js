import { create } from 'zustand';

// UI store using Zustand
const useUiStore = create((set, get) => ({
  // State
  isModalOpen: false,
  modalType: null, // 'add', 'edit', 'confirm', etc.
  selectedTodo: null,
  isDarkMode: false, // Initially false, but could be set based on system preference
  showSidebar: true, // For mobile view primarily

  // Actions
  openModal: (type, data = null) => {
    set({
      isModalOpen: true,
      modalType: type,
      selectedTodo: data,
    });
  },

  closeModal: () => {
    set({
      isModalOpen: false,
      modalType: null,
      selectedTodo: null,
    });
  },

  toggleDarkMode: () => {
    const newMode = !get().isDarkMode;
    set({ isDarkMode: newMode });
    
    // Update document class for Tailwind dark mode
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  },

  // Initialize dark mode based on system preference or saved preference
  initializeDarkMode: () => {
    const savedMode = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldUseDarkMode = savedMode ? JSON.parse(savedMode) : systemPrefersDark;
    
    set({ isDarkMode: shouldUseDarkMode });
    
    if (shouldUseDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  toggleSidebar: () => {
    set(state => ({ showSidebar: !state.showSidebar }));
  },

  setShowSidebar: (show) => {
    set({ showSidebar: show });
  },
}));

export default useUiStore;