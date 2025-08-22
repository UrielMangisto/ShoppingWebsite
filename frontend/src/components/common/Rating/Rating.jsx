import React from 'react';

const Rating = ({ 
  value, 
  onChange, 
  size = 'md',
  readOnly = false,
  showValue = false,
  totalReviews = null 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const renderStar = (filled, half = false) => (
    <svg
      className={`${sizeClasses[size]} ${
        readOnly ? 'text-yellow-400' : 'text-yellow-400 cursor-pointer'
      }`}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {half ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill="url(#half-fill)"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      )}
      {half && (
        <defs>
          <linearGradient id="half-fill">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="white" />
          </linearGradient>
        </defs>
      )}
    </svg>
  );

  const handleClick = (rating) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };

  const stars = [];
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 !== 0;

  // Generate full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <span key={i} onClick={() => handleClick(i + 1)}>
        {renderStar(true)}
      </span>
    );
  }

  // Add half star if needed
  if (hasHalfStar) {
    stars.push(
      <span key="half" onClick={() => handleClick(Math.ceil(value))}>
        {renderStar(true, true)}
      </span>
    );
  }

  // Fill remaining with empty stars
  const remainingStars = 5 - stars.length;
  for (let i = 0; i < remainingStars; i++) {
    stars.push(
      <span
        key={`empty-${i}`}
        onClick={() => handleClick(fullStars + (hasHalfStar ? 1 : 0) + i + 1)}
      >
        {renderStar(false)}
      </span>
    );
  }

  return (
    <div className="flex items-center">
      <div className="flex space-x-1">
        {stars}
      </div>
      {showValue && (
        <span className="ml-2 text-sm text-gray-600">
          {value.toFixed(1)}
          {totalReviews !== null && (
            <span className="ml-1 text-gray-400">
              ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
            </span>
          )}
        </span>
      )}
    </div>
  );
};

export default Rating;
