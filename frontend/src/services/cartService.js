// src/services/cartService.js
import { apiService } from './api';

export const cartService = {
  // קבלת עגלת קניות
  async getCart() {
    try {
      const response = await apiService.get('/cart');
      return response;
    } catch (error) {
      console.error('Get cart service error:', error);
      throw new Error(error.message || 'שגיאה בטעינת עגלת הקניות');
    }
  },

  // הוספת מוצר לעגלה
  async addToCart(productId, quantity = 1) {
    try {
      const response = await apiService.post('/cart', {
        product_id: productId,
        quantity: quantity
      });
      return response;
    } catch (error) {
      console.error('Add to cart service error:', error);
      throw new Error(error.message || 'שגיאה בהוספה לעגלה');
    }
  },

  // עדכון כמות מוצר בעגלה
  async updateCartItem(itemId, quantity) {
    try {
      const response = await apiService.put(`/cart/${itemId}`, {
        quantity: quantity
      });
      return response;
    } catch (error) {
      console.error('Update cart item service error:', error);
      throw new Error(error.message || 'שגיאה בעדכון כמות');
    }
  },

  // הסרת מוצר מעגלה
  async removeFromCart(itemId) {
    try {
      const response = await apiService.delete(`/cart/${itemId}`);
      return response;
    } catch (error) {
      console.error('Remove from cart service error:', error);
      throw new Error(error.message || 'שגיאה בהסרה מעגלה');
    }
  },

  // ניקוי עגלה (מקומי - לאחר רכישה)
  clearLocalCart() {
    // פונקציה זו תיקרא כאשר ההזמנה מושלמת
    // השרת כבר מנקה את העגלה, אך אנחנו יכולים לנקות גם מקומית
    return Promise.resolve({ message: 'Cart cleared locally' });
  }
};