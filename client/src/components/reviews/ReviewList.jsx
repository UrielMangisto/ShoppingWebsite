import React, { useState, useEffect } from 'react';
import { reviewService } from '../../services/reviewService';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import Loading from '../common/Loading';
import './ReviewList.css';

const ReviewList = ({ 
  productId, 
  showWriteReview = true, 
  limit = null,
  className = '' 
}) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest, lowest, helpful
  const [filterRating, setFilterRating] = useState('all'); // all, 5, 4, 3, 2, 1

  useEffect(() => {
    if (productId) {
      loadReviews();
    }
  }, [productId, sortBy, filterRating]);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await reviewService.getProductReviews(productId);
      let reviewsData = response.data || [];
      
      // Apply filtering
      if (filterRating !== 'all') {
        reviewsData = reviewsData.filter(review => review.rating == filterRating);
      }

      // Apply sorting
      reviewsData = sortReviews(reviewsData, sortBy);

      // Apply limit if specified
      if (limit) {
        reviewsData = reviewsData.slice(0, limit);
      }

      setReviews(reviewsData);
    } catch (err) {
      console.error('Error loading reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const sortReviews = (reviewsArray, sortOrder) => {
    const sorted = [...reviewsArray];
    
    switch (sortOrder) {
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating);
      case 'helpful':
        return sorted.sort((a, b) => (b.helpful_count || 0) - (a.helpful_count || 0));
      case 'newest':
      default:
        return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  };

  const handleReviewSubmit = (review) => {
    if (editingReview) {
      // Update existing review
      setReviews(prev => prev.map(r => r.id === review.id ? review : r));
      setEditingReview(null);
    } else {
      // Add new review
      setReviews(prev => [review, ...prev]);
    }
    setShowReviewForm(false);
    
    // Reload reviews to get fresh data
    setTimeout(loadReviews, 1000);
  };

  const handleReviewEdit = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleReviewDelete = (reviewId) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  const handleCancelReviewForm = () => {
    setShowReviewForm(false);
    setEditingReview(null);
  };

  // Calculate review statistics
  const calculateStats = () => {
    if (reviews.length === 0) {
      return {
        average: 0,
        total: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const total = reviews.length;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / total;
    const distribution = reviewService.getRatingDistribution(reviews);

    return { average, total, distribution };
  };

  const stats = calculateStats();

  if (error) {
    return (
      <div className="reviews-error">
        <p>{error}</p>
        <button onClick={loadReviews} className="btn btn-outline">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`reviews-section ${className}`}>
      {/* Reviews Header */}
      <div className="reviews-header">
        <h3 className="reviews-title">
          Customer Reviews
          {stats.total > 0 && <span className="review-count">({stats.total})</span>}
        </h3>

        {showWriteReview && (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="btn btn-primary write-review-btn"
          >
            {showReviewForm ? 'Cancel' : ' Write Review'}
          </button>
        )}
      </div>

      {/* Review Statistics */}
      {stats.total > 0 && (
        <div className="reviews-stats">
          <div className="overall-rating">
            <div className="rating-score">
              <span className="score-number">{stats.average.toFixed(1)}</span>
              <div className="score-stars">
                {renderStars(stats.average)}
              </div>
            </div>
            <div className="rating-details">
              <span className="total-reviews">{stats.total} reviews</span>
            </div>
          </div>

          <div className="rating-breakdown">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = stats.distribution[rating] || 0;
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              
              return (
                <div key={rating} className="rating-row">
                  <div className="rating-label">
                    <span>{rating}</span>
                    <span className="star"></span>
                  </div>
                  <div className="rating-bar">
                    <div 
                      className="rating-fill"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="rating-count">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Write Review Form */}
      {showReviewForm && (
        <div className="review-form-section">
          <ReviewForm
            productId={productId}
            existingReview={editingReview}
            onSubmit={handleReviewSubmit}
            onCancel={handleCancelReviewForm}
          />
        </div>
      )}

      {/* Reviews Controls */}
      {stats.total > 0 && (
        <div className="reviews-controls">
          <div className="sort-controls">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>

          <div className="filter-controls">
            <label htmlFor="filter-select">Filter by rating:</label>
            <select
              id="filter-select"
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars Only</option>
              <option value="4">4 Stars Only</option>
              <option value="3">3 Stars Only</option>
              <option value="2">2 Stars Only</option>
              <option value="1">1 Star Only</option>
            </select>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {isLoading ? (
          <Loading size="medium" text="Loading reviews..." />
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onEdit={handleReviewEdit}
              onDelete={handleReviewDelete}
            />
          ))
        ) : (
          <div className="no-reviews">
            <div className="no-reviews-content">
              <div className="no-reviews-icon">=­</div>
              <h4>No reviews yet</h4>
              <p>
                {filterRating !== 'all' ? (
                  <>
                    No reviews match the selected rating filter.{' '}
                    <button 
                      onClick={() => setFilterRating('all')}
                      className="link-btn"
                    >
                      Show all reviews
                    </button>
                  </>
                ) : (
                  'Be the first to share your thoughts about this product!'
                )}
              </p>
              {showWriteReview && filterRating === 'all' && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="btn btn-primary"
                >
                  Write First Review
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Load More Button (if limited results) */}
      {limit && reviews.length >= limit && (
        <div className="load-more-section">
          <button
            onClick={() => window.location.reload()} // Simple implementation
            className="btn btn-outline"
          >
            View All Reviews
          </button>
        </div>
      )}
    </div>
  );
};

// Helper function to render stars
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

export default ReviewList;