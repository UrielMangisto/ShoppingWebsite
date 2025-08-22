import api from './api';
import authService from './authService';

export const cartService = {
  getCart: async () => {
    const token = authService.getToken();
    return api.get('/cart', token);
  },

  addToCart: async (product_id, quantity) => {
    const token = authService.getToken();
    return api.post('/cart', { product_id, quantity }, token);
  },

  updateCartItem: async (id, quantity) => {
    const token = authService.getToken();
    return api.put(`/cart/${id}`, { quantity }, token);
  },

  deleteCartItem: async (id) => {
    const token = authService.getToken();
    return api.delete(`/cart/${id}`, token);
  },
};

export default cartService;
