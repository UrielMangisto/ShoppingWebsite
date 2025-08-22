import api from './api';
import authService from './authService';

export const categoriesService = {
  getCategories: async () => {
    return api.get('/categories');
  },

  getCategory: async (id) => {
    return api.get(`/categories/${id}`);
  },

  // Admin operations
  createCategory: async (name) => {
    const token = authService.getToken();
    return api.post('/categories', { name }, token);
  },

  updateCategory: async (id, name) => {
    const token = authService.getToken();
    return api.put(`/categories/${id}`, { name }, token);
  },

  deleteCategory: async (id) => {
    const token = authService.getToken();
    return api.delete(`/categories/${id}`, token);
  },
};

export default categoriesService;
