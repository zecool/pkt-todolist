// Token management utility functions
export const tokenManager = {
  // Store tokens in localStorage
  setTokens: (accessToken, refreshToken) => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  },

  // Get access token
  getAccessToken: () => {
    return localStorage.getItem('accessToken');
  },

  // Get refresh token
  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  },

  // Remove tokens
  removeTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = tokenManager.getAccessToken();
    return !!token;
  },

  // Decode JWT token to get user info
  decodeToken: (token) => {
    if (!token) return null;
    
    try {
      // Remove 'Bearer ' prefix if present
      const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;
      
      // Decode the token (without verification, just for user info)
      const payload = tokenString.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },
};