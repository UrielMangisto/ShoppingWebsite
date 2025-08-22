// src/hooks/useReviews.js
import { useState, useEffect } from 'react';
import { reviewsService } from '../services/reviewsService';

export const useReviews = (productId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await reviewsService.getReviewsForProduct(productId);
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (reviewData) => {
    try {
      const newReview = await reviewsService.addReviewForProduct(productId, reviewData);
      await fetchReviews(); // Refresh reviews to get updated list
      return { success: true, review: newReview };
    } catch (err) {
      console.error('Error adding review:', err);
      return { success: false, error: err.message };
    }
  };

  const updateReview = async (reviewId, reviewData) => {
    try {
      const updatedReview = await reviewsService.updateReviewForProduct(productId, reviewId, reviewData);
      await fetchReviews(); // Refresh reviews to get updated list
      return { success: true, review: updatedReview };
    } catch (err) {
      console.error('Error updating review:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await reviewsService.deleteReviewForProduct(productId, reviewId);
      await fetchReviews(); // Refresh reviews to get updated list
      return { success: true };
    } catch (err) {
      console.error('Error deleting review:', err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  return {
    reviews,
    loading,
    error,
    addReview,
    updateReview,
    deleteReview,
    refetch: fetchReviews
  };
};