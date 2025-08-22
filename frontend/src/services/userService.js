// src/services/userService.js
import { apiService } from './api';

export const userService = {
  // קבלת כל המשתמשים (אדמין)
  async getAllUsers() {
    try {
      const response = await apiService.get('/users');
      return response;
    } catch (error) {
      console.error('Get users service error:', error);
      throw new Error(error.message || 'שגיאה בטעינת משתמשים');
    }
  },

  // קבלת משתמש לפי ID
  async getUserById(userId) {
    try {
      const response = await apiService.get(`/users/${userId}`);
      return response;
    } catch (error) {
      console.error('Get user service error:', error);
      throw new Error(error.message || 'שגיאה בטעינת פרטי משתמש');
    }
  },

  // עדכון פרטי משתמש
  async updateUser(userId, userData) {
    try {
      const response = await apiService.put(`/users/${userId}`, userData);
      return response;
    } catch (error) {
      console.error('Update user service error:', error);
      throw new Error(error.message || 'שגיאה בעדכון פרטי משתמש');
    }
  },

  // מחיקת משתמש (אדמין)
  async deleteUser(userId) {
    try {
      const response = await apiService.delete(`/users/${userId}`);
      return response;
    } catch (error) {
      console.error('Delete user service error:', error);
      throw new Error(error.message || 'שגיאה במחיקת משתמש');
    }
  },

  // עדכון תפקיד משתמש (אדמין)
  async updateUserRole(userId, role) {
    try {
      const response = await apiService.put(`/users/${userId}/role`, {
        role: role
      });
      return response;
    } catch (error) {
      console.error('Update user role service error:', error);
      throw new Error(error.message || 'שגיאה בעדכון תפקיד משתמש');
    }
  }
};