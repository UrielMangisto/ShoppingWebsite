import { useState } from 'react';
import AverageRating from '../AverageRating/AverageRating';
import ReviewCard from '../ReviewCard/ReviewCard';
import ReviewForm from '../ReviewForm/ReviewForm';
import './ReviewList.css';

const ReviewList = ({ reviews, productId, onAddReview, onEditReview, onDeleteReview }) => {
  const [editingReview, setEditingReview] = useState(null);

  const handleEdit = (review) => {
    setEditingReview(review);
  };

  const handleUpdate = async (formData) => {
    await onEditReview(editingReview._id, formData);
    setEditingReview(null);
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      await onDeleteReview(reviewId);
    }
  };

  return (
    <div className="review-list">
      <h3>Customer Reviews</h3>
      {reviews.length > 0 && <AverageRating reviews={reviews} />}

      {!editingReview && (
        <ReviewForm
          productId={productId}
          onSubmit={onAddReview}
        />
      )}

      <div className="reviews-container">
        {reviews.map(review => (
          editingReview?._id === review._id ? (
            <ReviewForm
              key={review._id}
              initialReview={review}
              onSubmit={handleUpdate}
              onCancel={() => setEditingReview(null)}
            />
          ) : (
            <ReviewCard
              key={review._id}
              review={review}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default ReviewList;