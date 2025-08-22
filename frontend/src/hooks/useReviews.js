import { useState, useCallback } from 'react';
import reviewsService from '../services/reviewsService';

export const useReviews = (productId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);

  const getReviews = useCallback(async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await reviewsService.getReviewsForProduct(productId);
      setReviews(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch reviews');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const getAverageRating = useCallback(async () => {
    if (!productId) return;

    try {
      const data = await reviewsService.getAverageRatingForProduct(productId);
      setAverageRating(data.average);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch average rating');
      throw err;
    }
  }, [productId]);

  const addReview = useCallback(async ({ rating, comment }) => {
    if (!productId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await reviewsService.addReviewForProduct(productId, { rating, comment });
      await getReviews(); // Refresh reviews
      await getAverageRating(); // Update average rating
      return response;
    } catch (err) {
      setError(err.message || 'Failed to add review');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [productId, getReviews, getAverageRating]);

  const updateReview = useCallback(async (id, { rating, comment }) => {
    if (!productId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await reviewsService.updateReviewForProduct(productId, id, { rating, comment });
      await getReviews(); // Refresh reviews
      await getAverageRating(); // Update average rating
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update review');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [productId, getReviews, getAverageRating]);

  const deleteReview = useCallback(async (id) => {
    if (!productId) return;

    try {
      setLoading(true);
      setError(null);
      await reviewsService.deleteReviewForProduct(productId, id);
      await getReviews(); // Refresh reviews
      await getAverageRating(); // Update average rating
    } catch (err) {
      setError(err.message || 'Failed to delete review');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [productId, getReviews, getAverageRating]);

  return {
    reviews,
    loading,
    error,
    averageRating,
    getReviews,
    getAverageRating,
    addReview,
    updateReview,
    deleteReview,
  };
};

export default useReviews;
