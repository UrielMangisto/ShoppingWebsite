// src/services/orderService.js
import { apiService } from './api';

export const orderService = {
  // יצירת הזמנה חדשה
  async createOrder() {
    try {
      const response = await apiService.post('/orders');
      return response;
    } catch (error) {
      console.error('Create order service error:', error);
      throw new Error(error.message || 'שגיאה ביצירת הזמנה');
    }
  },

  // קבלת ההזמנות של המשתמש
  async getMyOrders() {
    try {
      const response = await apiService.get('/orders');
      return response;
    } catch (error) {
      console.error('Get orders service error:', error);
      throw new Error(error.message || 'שגיאה בטעינת הזמנות');
    }
  },

  // קבלת פרטי הזמנה ספציפית
  async getOrderById(orderId) {
    try {
      const response = await apiService.get(`/orders/${orderId}`);
      return response;
    } catch (error) {
      console.error('Get order service error:', error);
      throw new Error(error.message || 'שגיאה בטעינת פרטי הזמנה');
    }
  },

  // קבלת כל הההזמנות (אדמין)
  async getAllOrders() {
    try {
      const response = await apiService.get('/orders/all/admin');
      return response;
    } catch (error) {
      console.error('Get all orders service error:', error);
      throw new Error(error.message || 'שגיאה בטעינת כל ההזמנות');
    }
  },

  // עדכון סטטוס הזמנה (אדמין)
  async updateOrderStatus(orderId, status) {
    try {
      const response = await apiService.put(`/orders/${orderId}/status`, {
        status: status
      });
      return response;
    } catch (error) {
      console.error('Update order status service error:', error);
      throw new Error(error.message || 'שגיאה בעדכון סטטוס הזמנה');
    }
  }
};