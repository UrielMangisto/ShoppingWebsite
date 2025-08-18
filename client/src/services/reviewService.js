import { get, post, put, del } from './api';

// Note: You'll need to implement the reviews endpoints in your backend
// This service is prepared for when you add the review functionality

export const reviewService = {
  // Get reviews for a product
  getProductReviews: async (productId) => {
    const response = await get(`/products/${productId}/reviews`);
    return response;
  },

  // Create new review
  createReview: async (reviewData) => {
    const response = await post('/reviews', reviewData);
    return response;
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    const response = await put(`/reviews/${reviewId}`, reviewData);
    return response;
  },

  // Delete review
  deleteReview: async (reviewId) => {
    const response = await del(`/reviews/${reviewId}`);
    return response;
  },

  // Get user's reviews
  getUserReviews: async () => {
    const response = await get('/reviews/my-reviews');
    return response;
  },

  // Get all reviews (admin only)
  getAllReviews: async () => {
    const response = await get('/reviews/admin');
    return response;
  },

  // Get review statistics for a product
  getReviewStats: async (productId) => {
    const response = await get(`/products/${productId}/reviews/stats`);
    return response;
  },

  // Report inappropriate review
  reportReview: async (reviewId, reason) => {
    const response = await post(`/reviews/${reviewId}/report`, { reason });
    return response;
  },

  // Like/Unlike review
  toggleReviewLike: async (reviewId) => {
    const response = await post(`/reviews/${reviewId}/like`);
    return response;
  },

  // Calculate average rating
  calculateAverageRating: (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  },

  // Get rating distribution
  getRatingDistribution: (reviews) => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    
    return distribution;
  },

  // Validate review data
  validateReview: (reviewData) => {
    const errors = {};
    
    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      errors.rating = 'Rating must be between 1 and 5';
    }
    
    if (!reviewData.comment || reviewData.comment.trim().length < 10) {
      errors.comment = 'Comment must be at least 10 characters long';
    }
    
    if (reviewData.comment && reviewData.comment.length > 500) {
      errors.comment = 'Comment must be less than 500 characters';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Format review date
  formatReviewDate: (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays <= 365) return `${Math.ceil(diffDays / 30)} months ago`;
    
    return date.toLocaleDateString();
  }
};