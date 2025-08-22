// src/components/products/ReviewForm/ReviewForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './ReviewForm.css';

const ReviewForm = ({ productId, onReviewAdded, existingReview, onReviewUpdated }) => {
  const { isAuthenticated, user } = useAuth();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isAuthenticated) {
    return (
      <div className="review-form-login">
        <p>Please log in to write a review</p>
      </div>
    );
  }

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const reviewData = { rating, comment: comment.trim() };
      
      let result;
      if (existingReview) {
        result = await onReviewUpdated(reviewData);
      } else {
        result = await onReviewAdded(reviewData);
      }
      
      // Check if the operation was successful
      if (result && result.success === false) {
        setError(result.error || 'Failed to submit review');
        return;
      }
      
      // Reset form only if adding new review (not updating)
      if (!existingReview) {
        setRating(0);
        setComment('');
      }
    } catch (err) {
      console.error('Review submission error:', err);
      setError(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInteractiveStars = () => {
    const stars = [];
    const displayRating = hoveredRating || rating;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className={`star-button ${i <= displayRating ? 'filled' : 'empty'}`}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={handleStarLeave}
          aria-label={`Rate ${i} star${i !== 1 ? 's' : ''}`}
        >
          ★
        </button>
      );
    }

    return stars;
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>{existingReview ? 'Update Your Review' : 'Write a Review'}</h3>
      
      <div className="rating-input">
        <label>Your Rating:</label>
        <div className="stars-input">
          {renderInteractiveStars()}
        </div>
        <span className="rating-text">
          {rating > 0 ? `${rating}/5 stars` : 'Click to rate'}
        </span>
      </div>

      <div className="comment-input">
        <label htmlFor="comment">Your Review (optional):</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this product..."
          rows={4}
          maxLength={500}
        />
        <small>{comment.length}/500 characters</small>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button 
        type="submit" 
        disabled={isSubmitting || rating === 0}
        className="submit-review-btn"
      >
        {isSubmitting ? 'Submitting...' : (existingReview ? 'Update Review' : 'Submit Review')}
      </button>
    </form>
  );
};

export default ReviewForm;
