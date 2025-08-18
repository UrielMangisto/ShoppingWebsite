import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reviewService } from '../../services/reviewService';
import './ReviewCard.css';

const ReviewCard = ({ 
  review, 
  onEdit, 
  onDelete, 
  showActions = true,
  className = '' 
}) => {
  const { user, isAuthenticated } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if current user owns this review
  const isOwner = isAuthenticated && user && user.id === review.user_id;
  const isAdmin = isAuthenticated && user && user.role === 'admin';

  // Handle delete review
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await reviewService.deleteReview(review.id);
      if (onDelete) {
        onDelete(review.id);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle edit review
  const handleEdit = () => {
    if (onEdit) {
      onEdit(review);
    }
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star filled"></span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="star half"></span>);
      } else {
        stars.push(<span key={i} className="star empty"></span>);
      }
    }

    return stars;
  };

  // Format date
  const formatDate = (dateString) => {
    return reviewService.formatReviewDate(dateString);
  };

  return (
    <div className={`review-card ${className} ${isDeleting ? 'deleting' : ''}`}>
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar">
            {review.user?.name ? review.user.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="reviewer-details">
            <h4 className="reviewer-name">
              {review.user?.name || 'Anonymous User'}
            </h4>
            <div className="review-meta">
              <div className="review-rating">
                {renderStars(review.rating)}
                <span className="rating-number">({review.rating}/5)</span>
              </div>
              <span className="review-date">
                {formatDate(review.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Review Actions */}
        {showActions && (isOwner || isAdmin) && (
          <div className="review-actions">
            {isOwner && (
              <button
                onClick={handleEdit}
                className="action-btn edit-btn"
                disabled={isDeleting}
                title="Edit review"
              >
                
              </button>
            )}
            <button
              onClick={handleDelete}
              className="action-btn delete-btn"
              disabled={isDeleting}
              title="Delete review"
            >
              {isDeleting ? 'ó' : '=Ñ'}
            </button>
          </div>
        )}
      </div>

      <div className="review-content">
        {/* Review Title (if exists) */}
        {review.title && (
          <h5 className="review-title">{review.title}</h5>
        )}

        {/* Review Comment */}
        <p className="review-comment">{review.comment}</p>

        {/* Helpful/Like Section */}
        <div className="review-footer">
          <div className="review-helpful">
            <button
              className="helpful-btn"
              disabled={!isAuthenticated}
              title={isAuthenticated ? 'Was this review helpful?' : 'Login to vote'}
            >
              =M Helpful
            </button>
            {review.helpful_count > 0 && (
              <span className="helpful-count">
                ({review.helpful_count})
              </span>
            )}
          </div>

          {/* Verified Purchase Badge */}
          {review.verified_purchase && (
            <div className="verified-badge">
              <span className="verified-icon"></span>
              <span className="verified-text">Verified Purchase</span>
            </div>
          )}
        </div>

        {/* Admin Flag (if flagged for review) */}
        {review.flagged && isAdmin && (
          <div className="admin-notice">
            <span className="flag-icon">=©</span>
            <span>This review has been flagged for moderation</span>
          </div>
        )}
      </div>

      {/* Product Info (if showing review outside product context) */}
      {review.product && (
        <div className="review-product-info">
          <span className="product-label">Product:</span>
          <span className="product-name">{review.product.name}</span>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;