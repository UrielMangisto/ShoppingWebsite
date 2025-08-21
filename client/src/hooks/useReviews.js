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
      await reviewsService.addReviewForProduct(productId, reviewData);
      await fetchReviews(); // Refresh reviews
      return true;
    } catch (err) {
      throw err;
    }
  };

  const updateReview = async (reviewId, reviewData) => {
    try {
      await reviewsService.updateReviewForProduct(productId, reviewId, reviewData);
      await fetchReviews(); // Refresh reviews
      return true;
    } catch (err) {
      throw err;
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await reviewsService.deleteReviewForProduct(productId, reviewId);
      await fetchReviews(); // Refresh reviews
      return true;
    } catch (err) {
      throw err;
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