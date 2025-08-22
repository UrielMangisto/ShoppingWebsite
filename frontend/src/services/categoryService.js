// src/services/categoryService.js
import { apiService } from './api';

export const categoryService = {
  // קבלת כל הקטגוריות
  async getAllCategories() {
    try {
      const response = await apiService.get('/categories');
      return response;
    } catch (error) {
      console.error('Get categories service error:', error);
      throw new Error(error.message || 'שגיאה בטעינת קטגוריות');
    }
  },

  // קבלת קטגוריה לפי ID
  async getCategoryById(categoryId) {
    try {
      const response = await apiService.get(`/categories/${categoryId}`);
      return response;
    } catch (error) {
      console.error('Get category service error:', error);
      throw new Error(error.message || 'שגיאה בטעינת קטגוריה');
    }
  },

  // יצירת קטגוריה חדשה (אדמין)
  async createCategory(categoryData) {
    try {
      const response = await apiService.post('/categories', categoryData);
      return response;
    } catch (error) {
      console.error('Create category service error:', error);
      throw new Error(error.message || 'שגיאה ביצירת קטגוריה');
    }
  },

  // עדכון קטגוריה (אדמין)
  async updateCategory(categoryId, categoryData) {
    try {
      const response = await apiService.put(`/categories/${categoryId}`, categoryData);
      return response;
    } catch (error) {
      console.error('Update category service error:', error);
      throw new Error(error.message || 'שגיאה בעדכון קטגוריה');
    }
  },

  // מחיקת קטגוריה (אדמין)
  async deleteCategory(categoryId) {
    try {
      const response = await apiService.delete(`/categories/${categoryId}`);
      return response;
    } catch (error) {
      console.error('Delete category service error:', error);
      throw new Error(error.message || 'שגיאה במחיקת קטגוריה');
    }
  }
};