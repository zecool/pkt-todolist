const ACCESS_TOKEN_KEY = 'pkt_todolist_access_token';
const REFRESH_TOKEN_KEY = 'pkt_todolist_refresh_token';

export const tokenManager = {
  /**
   * Set access token
   * @param {string} token 
   */
  setAccessToken: (token) => {
    if (!token) return;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  /**
   * Get access token
   * @returns {string | null}
   */
  getAccessToken: () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  /**
   * Set refresh token
   * @param {string} token 
   */
  setRefreshToken: (token) => {
    if (!token) return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  /**
   * Get refresh token
   * @returns {string | null}
   */
  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Clear all tokens
   */
  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    return !!token;
  },
};