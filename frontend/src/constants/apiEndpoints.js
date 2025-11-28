// API endpoints constants
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  
  // Todos
  TODOS: {
    BASE: '/todos',
    COMPLETE: (id) => `/todos/${id}/complete`,
    RESTORE: (id) => `/todos/${id}/restore`,
  },
  
  // Trash
  TRASH: {
    BASE: '/trash',
    PERMANENT_DELETE: (id) => `/trash/${id}`,
  },
  
  // Holidays
  HOLIDAYS: {
    BASE: '/holidays',
  },
  
  // Users
  USERS: {
    PROFILE: '/users/me',
  },
};