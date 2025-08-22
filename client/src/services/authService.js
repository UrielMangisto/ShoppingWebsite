import api from './api';

const AUTH_TOKEN_KEY = 'authToken';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    }
    return response;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  resetPassword: async (email) => {
    return api.post('/auth/reset-password', { email });
  },

  getToken: () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
};

export default authService;
