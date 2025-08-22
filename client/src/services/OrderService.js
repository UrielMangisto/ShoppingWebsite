import api from './api';
import authService from './authService';

export const orderService = {
  createOrder: async (orderData) => {
    const token = authService.getToken();
    return api.post('/orders', orderData, token);
  },

  getMyOrders: async () => {
    const token = authService.getToken();
    return api.get('/orders', token);
  },

  getOrder: async (orderId) => {
    const token = authService.getToken();
    return api.get(`/orders/${orderId}`, token);
  },

  // Admin operations
  getAllOrdersAdmin: async () => {
    const token = authService.getToken();
    return api.get('/orders/all/admin', token);
  },
};

export default orderService;
