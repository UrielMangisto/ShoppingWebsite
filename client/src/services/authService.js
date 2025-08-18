import { postNoAuth } from './api';

export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await postNoAuth('/auth/register', userData);
    return response;
  },

  // Login user
  login: async (email, password) => {
    const response = await postNoAuth('/auth/login', { email, password });
    return response;
  },

  // Logout user (clear local storage is handled in AuthContext)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user from token
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get current token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Check if user is admin
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    const response = await postNoAuth('/auth/forgot-password', { email });
    return response;
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    const response = await postNoAuth('/auth/reset-password', {
      token,
      password: newPassword
    });
    return response;
  },

  // Verify email with token
  verifyEmail: async (token) => {
    const response = await postNoAuth('/auth/verify-email', { token });
    return response;
  },

  // Resend verification email
  resendVerification: async (email) => {
    const response = await postNoAuth('/auth/resend-verification', { email });
    return response;
  }
};