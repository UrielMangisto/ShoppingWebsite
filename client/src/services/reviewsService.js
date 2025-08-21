import { get, post, put, del } from './api.js'

// Get reviews for a product
export const getProductReviews = async (productId) => {
  return await get(`/products/${productId}/reviews`)
}

// Add a review
export const addReview = async (productId, rating, comment) => {
  return await post(`/products/${productId}/reviews`, { rating, comment })
}

// Update a review
export const updateReview = async (productId, reviewId, rating, comment) => {
  return await put(`/products/${productId}/reviews/${reviewId}`, { rating, comment })
}

// Delete a review
export const deleteReview = async (productId, reviewId) => {
  return await del(`/products/${productId}/reviews/${reviewId}`)
}

// Get average rating
export const getAverageRating = async (productId) => {
  return await get(`/products/${productId}/reviews/average`)
}

// Generate star rating display
export const generateStarRating = (rating) => {
  if (!rating || rating < 1 || rating > 5) {
    return { full: 0, half: 0, empty: 5 }
  }

  const fullStars = Math.floor(rating)
  const hasHalfStar = (rating % 1) >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return {
    full: fullStars,
    half: hasHalfStar ? 1 : 0,
    empty: emptyStars,
    rating: rating
  }
}

// Format date
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateString))
  } catch {
    return 'Invalid date'
  }
}