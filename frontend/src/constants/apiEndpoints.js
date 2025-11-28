// API endpoints constants
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
  },

  // Todos
  TODOS: {
    BASE: '/api/todos',
    COMPLETE: (id) => `/api/todos/${id}/complete`,
    RESTORE: (id) => `/api/todos/${id}/restore`,
  },

  // Trash
  TRASH: {
    BASE: '/api/trash',
    PERMANENT_DELETE: (id) => `/api/trash/${id}`,
  },

  // Holidays
  HOLIDAYS: {
    BASE: '/api/holidays',
  },

  // Users
  USERS: {
    PROFILE: '/api/users/me',
  },
};