import api from './api';
import authService from './authService';

export const usersService = {
  // Admin operations
  getAllUsers: async () => {
    const token = authService.getToken();
    return api.get('/users', token);
  },

  getUserById: async (id) => {
    const token = authService.getToken();
    return api.get(`/users/${id}`, token);
  },

  updateUser: async (id, userData) => {
    const token = authService.getToken();
    return api.put(`/users/${id}`, userData, token);
  },

  deleteUser: async (id) => {
    const token = authService.getToken();
    return api.delete(`/users/${id}`, token);
  },
};

export default usersService;
