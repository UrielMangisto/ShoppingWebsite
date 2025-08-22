import api from './api';
import { authHeader } from '../utils/auth';

export const adminService = {
  // Products
  getProducts: () => api.get('/products'),
  createProduct: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'image' && data[key] instanceof File) {
        formData.append('image', data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });
    return api.post('/products', formData, authHeader());
  },
  updateProduct: (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'image' && data[key] instanceof File) {
        formData.append('image', data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });
    return api.put(`/products/${id}`, formData, authHeader());
  },
  deleteProduct: (id) => api.delete(`/products/${id}`, { headers: authHeader() }),

  // Categories
  getCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/categories', data, { headers: authHeader() }),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data, { headers: authHeader() }),
  deleteCategory: (id) => api.delete(`/categories/${id}`, { headers: authHeader() }),

  // Users
  getUsers: () => api.get('/users', { headers: authHeader() }),
  updateUser: (id, data) => api.put(`/users/${id}`, data, { headers: authHeader() }),
  deleteUser: (id) => api.delete(`/users/${id}`, { headers: authHeader() }),

  // Orders
  getOrders: () => api.get('/orders/all/admin', { headers: authHeader() }),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }, { headers: authHeader() })
};

export default adminService;
