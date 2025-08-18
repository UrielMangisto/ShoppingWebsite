import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reviewService } from '../../services/reviewService';
import { ButtonSpinner } from '../common/Loading';
import './ReviewForm.css';

const ReviewForm = ({ 
  productId, 
  existingReview = null, 
  onSubmit, 
  onCancel, 
  className = '' 
}) => {
  const { user, isAuthenticated } = useAuth();
  const isEditing = !!existingReview;

  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Initialize form data if editing
  useEffect(() => {
    if (existingReview) {
      setFormData({
        rating: existingReview.rating || 5,
        title: existingReview.title || '',
        comment: existingReview.comment || ''
      });
    }
  }, [existingReview]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear global error
    if (error) setError(null);
  };

  // Handle rating selection
  const handleRatingSelect = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
    if (formErrors.rating) {
      setFormErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const validation = reviewService.validateReview(formData);
    setFormErrors(validation.errors);
    return validation.isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const reviewData = {
        ...formData,
        product_id: productId
      };

      let result;
      if (isEditing) {
        result = await reviewService.updateReview(existingReview.id, reviewData);
      } else {
        result = await reviewService.createReview(reviewData);
      }

      // Call onSubmit callback
      if (onSubmit) {
        onSubmit(result.data);
      }

      // Reset form if creating new review
      if (!isEditing) {
        setFormData({ rating: 5, title: '', comment: '' });
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // Render star rating input
  const renderStarRating = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className={`star-btn ${i <= (hoveredRating || formData.rating) ? 'filled' : 'empty'}`}
          onClick={() => handleRatingSelect(i)}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
          disabled={isSubmitting}
        >
          
        </button>
      );
    }
    return stars;
  };

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <div className="review-form-login-prompt">
        <div className="login-prompt-content">
          <h4>Sign in to write a review</h4>
          <p>You need to be logged in to leave a review for this product.</p>
          <a href="/login" className="btn btn-primary">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`review-form-container ${className}`}>
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-header">
          <h3 className="form-title">
            {isEditing ? 'Edit Your Review' : 'Write a Review'}
          </h3>
          <div className="reviewer-info">
            <div className="reviewer-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
            </div>
            <span className="reviewer-name">{user?.name}</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Rating */}
        <div className="form-group">
          <label className="form-label">
            Rating *
          </label>
          <div className="rating-input">
            <div className="stars-container">
              {renderStarRating()}
            </div>
            <div className="rating-labels">
              <span className="rating-text">
                {formData.rating === 1 && 'Poor'}
                {formData.rating === 2 && 'Fair'}
                {formData.rating === 3 && 'Good'}
                {formData.rating === 4 && 'Very Good'}
                {formData.rating === 5 && 'Excellent'}
              </span>
              <span className="rating-number">({formData.rating}/5)</span>
            </div>
          </div>
          {formErrors.rating && (
            <span className="form-error">{formErrors.rating}</span>
          )}
        </div>

        {/* Title */}
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Review Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`form-input ${formErrors.title ? 'error' : ''}`}
            placeholder="Summarize your experience (optional)"
            disabled={isSubmitting}
            maxLength={100}
          />
          {formErrors.title && (
            <span className="form-error">{formErrors.title}</span>
          )}
          <div className="character-count">
            {formData.title.length}/100
          </div>
        </div>

        {/* Comment */}
        <div className="form-group">
          <label htmlFor="comment" className="form-label">
            Your Review *
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            className={`form-textarea ${formErrors.comment ? 'error' : ''}`}
            placeholder="Tell others about your experience with this product..."
            rows="5"
            required
            disabled={isSubmitting}
            maxLength={500}
          />
          {formErrors.comment && (
            <span className="form-error">{formErrors.comment}</span>
          )}
          <div className="character-count">
            {formData.comment.length}/500
          </div>
        </div>

        {/* Review Guidelines */}
        <div className="review-guidelines">
          <h5>Review Guidelines:</h5>
          <ul>
            <li>Share your honest experience with the product</li>
            <li>Be specific about what you liked or disliked</li>
            <li>Keep it respectful and constructive</li>
            <li>Don't include personal information</li>
          </ul>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !formData.comment.trim()}
          >
            {isSubmitting ? (
              <>
                <ButtonSpinner size="small" />
                {isEditing ? 'Updating...' : 'Submitting...'}
              </>
            ) : (
              isEditing ? 'Update Review' : 'Submit Review'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;