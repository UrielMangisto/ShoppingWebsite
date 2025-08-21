import { useState, useEffect } from 'react'
import * as reviewsService from '../services/reviewsService'

export const useReviews = (productId) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch reviews for product
  const fetchReviews = async () => {
    if (!productId) return

    setLoading(true)
    setError(null)
    
    try {
      const result = await reviewsService.getProductReviews(productId)
      setReviews(result)
      return { success: true, data: result }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch reviews'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Add review
  const addReview = async (rating, comment) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await reviewsService.addReview(productId, rating, comment)
      await fetchReviews() // Refresh reviews
      return { success: true, data: result }
    } catch (err) {
      const errorMessage = err.message || 'Failed to add review'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Update review
  const updateReview = async (reviewId, rating, comment) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await reviewsService.updateReview(productId, reviewId, rating, comment)
      await fetchReviews() // Refresh reviews
      return { success: true, data: result }
    } catch (err) {
      const errorMessage = err.message || 'Failed to update review'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Delete review
  const deleteReview = async (reviewId) => {
    setLoading(true)
    setError(null)
    
    try {
      await reviewsService.deleteReview(productId, reviewId)
      await fetchReviews() // Refresh reviews
      return { success: true }
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete review'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Clear error
  const clearError = () => {
    setError(null)
  }

  // Auto-fetch reviews when productId changes
  useEffect(() => {
    fetchReviews()
  }, [productId])

  return {
    reviews,
    loading,
    error,
    fetchReviews,
    addReview,
    updateReview,
    deleteReview,
    clearError
  }
}

// Hook for average rating
export const useAverageRating = (productId) => {
  const [averageRating, setAverageRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAverageRating = async () => {
    if (!productId) return

    setLoading(true)
    setError(null)
    
    try {
      const result = await reviewsService.getAverageRating(productId)
      setAverageRating(result.average || 0)
      setReviewCount(result.reviews ? result.reviews.length : 0)
      return { success: true, data: result }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch rating'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAverageRating()
  }, [productId])

  return {
    averageRating,
    reviewCount,
    loading,
    error,
    refetch: fetchAverageRating
  }
}