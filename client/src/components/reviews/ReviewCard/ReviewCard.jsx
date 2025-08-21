import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import StarRating from '../StarRating/StarRating';
import { formatDate } from '../../../utils/formatters';
import './ReviewCard.css';

const ReviewCard = ({ review, onEdit, onDelete }) => {
  const { user } = useAuth();
  const [showActions, setShowActions] = useState(false);
  
  const canModify = user && (user.id === review.userId || user.role === 'admin');

  return (
    <div 
      className="review-card"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="review-header">
        <div className="reviewer-info">
          <h4>{review.user.name}</h4>
          <span className="review-date">{formatDate(review.createdAt)}</span>
        </div>
        <StarRating rating={review.rating} readonly />
      </div>

      <p className="review-content">{review.comment}</p>

      {canModify && showActions && (
        <div className="review-actions">
          <button onClick={() => onEdit(review)} className="edit-button">
            Edit
          </button>
          <button onClick={() => onDelete(review._id)} className="delete-button">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;