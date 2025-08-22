// src/services/productService.js
import { apiService } from './api';

export const productService = {
  // קבלת כל המוצרים עם פילטרים
  async getAllProducts(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const endpoint = queryParams.toString() 
        ? `/products?${queryParams.toString()}` 
        : '/products';
        
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error('Get products service error:', error);
      throw new Error(error.message || 'שגיאה בטעינת מוצרים');
    }
  },

  // קבלת מוצר לפי ID
  async getProductById(id) {
    try {
      const response = await apiService.get(`/products/${id}`);
      return response;
    } catch (error) {
      console.error('Get product service error:', error);
      throw new Error(error.message || 'שגיאה בטעינת המוצר');
    }
  },

  // יצירת מוצר חדש (אדמין)
  async createProduct(productData) {
    try {
      const formData = new FormData();
      
      // הוספת שדות טקסט
      Object.entries(productData).forEach(([key, value]) => {
        if (key !== 'image' && value !== undefined) {
          formData.append(key, value);
        }
      });

      // הוספת תמונה אם קיימת
      if (productData.image) {
        formData.append('image', productData.image);
      }

      const response = await apiService.uploadFile('/products', formData);
      return response;
    } catch (error) {
      console.error('Create product service error:', error);
      throw new Error(error.message || 'שגיאה ביצירת המוצר');
    }
  },

  // עדכון מוצר (אדמין)
  async updateProduct(id, productData) {
    try {
      const formData = new FormData();
      
      // הוספת שדות טקסט
      Object.entries(productData).forEach(([key, value]) => {
        if (key !== 'image' && value !== undefined) {
          formData.append(key, value);
        }
      });

      // הוספת תמונה אם קיימת
      if (productData.image) {
        formData.append('image', productData.image);
      }

      const response = await apiService.uploadFile(`/products/${id}`, formData);
      return response;
    } catch (error) {
      console.error('Update product service error:', error);
      throw new Error(error.message || 'שגיאה בעדכון המוצר');
    }
  },

  // מחיקת מוצר (אדמין)
  async deleteProduct(id) {
    try {
      const response = await apiService.delete(`/products/${id}`);
      return response;
    } catch (error) {
      console.error('Delete product service error:', error);
      throw new Error(error.message || 'שגיאה במחיקת המוצר');
    }
  },

  // קבלת ביקורות למוצר
  async getProductReviews(productId) {
    try {
      const response = await apiService.get(`/products/${productId}/reviews`);
      return response;
    } catch (error) {
      console.error('Get reviews service error:', error);
      throw new Error(error.message || 'שגיאה בטעינת ביקורות');
    }
  },

  // הוספת ביקורת למוצר
  async addProductReview(productId, reviewData) {
    try {
      const response = await apiService.post(`/products/${productId}/reviews`, reviewData);
      return response;
    } catch (error) {
      console.error('Add review service error:', error);
      throw new Error(error.message || 'שגיאה בהוספת ביקורת');
    }
  },

  // עדכון ביקורת
  async updateProductReview(productId, reviewId, reviewData) {
    try {
      const response = await apiService.put(`/products/${productId}/reviews/${reviewId}`, reviewData);
      return response;
    } catch (error) {
      console.error('Update review service error:', error);
      throw new Error(error.message || 'שגיאה בעדכון ביקורת');
    }
  },

  // מחיקת ביקורת
  async deleteProductReview(productId, reviewId) {
    try {
      const response = await apiService.delete(`/products/${productId}/reviews/${reviewId}`);
      return response;
    } catch (error) {
      console.error('Delete review service error:', error);
      throw new Error(error.message || 'שגיאה במחיקת ביקורת');
    }
  }
};