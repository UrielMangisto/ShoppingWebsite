import { useState, useEffect } from 'react';
import StarRating from '../StarRating/StarRating';
import './ReviewForm.css';

const ReviewForm = ({ initialReview, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    comment: ''
  });

  useEffect(() => {
    if (initialReview) {
      setFormData({
        rating: initialReview.rating,
        comment: initialReview.comment
      });
    }
  }, [initialReview]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Rating</label>
        <StarRating
          rating={formData.rating}
          onChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
        />
      </div>

      <div className="form-group">
        <label htmlFor="comment">Your Review</label>
        <textarea
          id="comment"
          value={formData.comment}
          onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
          required
          minLength={10}
          rows={4}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-button">
          {initialReview ? 'Update Review' : 'Submit Review'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;