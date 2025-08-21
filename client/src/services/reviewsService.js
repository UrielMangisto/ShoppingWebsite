import api from './api';
import authService from './authService';

export const reviewsService = {
  getReviewsForProduct: async (productId) => {
    return api.get(`/products/${productId}/reviews`);
  },

  addReviewForProduct: async (productId, { rating, comment }) => {
    const token = authService.getToken();
    return api.post(`/products/${productId}/reviews`, { rating, comment }, token);
  },

  updateReviewForProduct: async (productId, reviewId, { rating, comment }) => {
    const token = authService.getToken();
    return api.put(`/products/${productId}/reviews/${reviewId}`, { rating, comment }, token);
  },

  deleteReviewForProduct: async (productId, reviewId) => {
    const token = authService.getToken();
    return api.delete(`/products/${productId}/reviews/${reviewId}`, token);
  }
};

export default reviewsService;
