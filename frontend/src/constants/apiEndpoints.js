// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  
  // Todo
  TODOS: {
    GET_ALL: '/todos',
    GET_BY_ID: (id) => `/todos/${id}`,
    CREATE: '/todos',
    UPDATE: (id) => `/todos/${id}`,
    COMPLETE: (id) => `/todos/${id}/complete`,
    DELETE: (id) => `/todos/${id}`,
    RESTORE: (id) => `/todos/${id}/restore`,
  },
  
  // Trash
  TRASH: {
    GET: '/trash',
    PERMANENT_DELETE: (id) => `/trash/${id}`,
  },
  
  // Holidays
  HOLIDAYS: {
    GET: '/holidays',
    CREATE: '/holidays',
    UPDATE: (id) => `/holidays/${id}`,
  },
  
  // User
  USER: {
    PROFILE: '/users/me',
  },
};