import StarRating from '../StarRating/StarRating';
import './AverageRating.css';

const AverageRating = ({ reviews }) => {
  const average = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const roundedAverage = Math.round(average * 2) / 2;
  
  return (
    <div className="average-rating">
      <StarRating rating={roundedAverage} readonly />
      <span className="rating-text">
        {roundedAverage.toFixed(1)} out of 5 ({reviews.length} reviews)
      </span>
    </div>
  );
};

export default AverageRating;