// src/services/authService.js
import { apiService } from './api';

export const authService = {
  // התחברות
  async login(credentials) {
    try {
      const response = await apiService.post('/auth/login', credentials);
      return response;
    } catch (error) {
      console.error('Login service error:', error);
      throw new Error(error.message || 'שגיאה בהתחברות');
    }
  },

  // רישום
  async register(userData) {
    try {
      const response = await apiService.post('/auth/register', userData);
      return response;
    } catch (error) {
      console.error('Register service error:', error);
      throw new Error(error.message || 'שגיאה ברישום');
    }
  },

  // איפוס סיסמה
  async resetPassword(resetData) {
    try {
      const response = await apiService.post('/auth/reset-password', resetData);
      return response;
    } catch (error) {
      console.error('Reset password service error:', error);
      throw new Error(error.message || 'שגיאה באיפוס סיסמה');
    }
  },

  // בדיקת תקינות טוקן
  async verifyToken() {
    try {
      const response = await apiService.get('/auth/verify');
      return response;
    } catch (error) {
      console.error('Token verification error:', error);
      throw new Error('טוקן לא תקין');
    }
  }
};