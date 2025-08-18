import React from 'react';
import './Loading.css';

const Loading = ({ 
  size = 'medium', 
  text = 'Loading...', 
  fullScreen = false,
  overlay = false,
  color = 'primary'
}) => {
  const loadingClass = `loading ${size} ${color} ${fullScreen ? 'fullscreen' : ''} ${overlay ? 'overlay' : ''}`;

  if (fullScreen) {
    return (
      <div className={loadingClass}>
        <div className="loading-content">
          <div className="loading-spinner">
            <div className="spinner-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          {text && <p className="loading-text">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={loadingClass}>
      <div className="loading-spinner">
        <div className="spinner-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      {text && <span className="loading-text">{text}</span>}
    </div>
  );
};

// Simple inline spinner for buttons
export const ButtonSpinner = ({ size = 'small' }) => (
  <div className={`button-spinner ${size}`}>
    <div className="spinner-dots">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
);

// Card skeleton loader
export const CardSkeleton = ({ count = 1 }) => (
  <div className="skeleton-container">
    {Array(count).fill(0).map((_, index) => (
      <div key={index} className="skeleton-card">
        <div className="skeleton-image"></div>
        <div className="skeleton-content">
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-line skeleton-price"></div>
          <div className="skeleton-line skeleton-description"></div>
        </div>
      </div>
    ))}
  </div>
);

// Table skeleton loader
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="skeleton-table">
    {Array(rows).fill(0).map((_, rowIndex) => (
      <div key={rowIndex} className="skeleton-table-row">
        {Array(columns).fill(0).map((_, colIndex) => (
          <div key={colIndex} className="skeleton-table-cell">
            <div className="skeleton-line"></div>
          </div>
        ))}
      </div>
    ))}
  </div>
);

// Page skeleton loader
export const PageSkeleton = () => (
  <div className="page-skeleton">
    <div className="skeleton-header">
      <div className="skeleton-line skeleton-page-title"></div>
      <div className="skeleton-line skeleton-subtitle"></div>
    </div>
    <div className="skeleton-content">
      <div className="skeleton-sidebar">
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
      </div>
      <div className="skeleton-main">
        <CardSkeleton count={6} />
      </div>
    </div>
  </div>
);

// Dots loading animation
export const DotsLoader = ({ size = 'medium', color = 'primary' }) => (
  <div className={`dots-loader ${size} ${color}`}>
    <div className="dot"></div>
    <div className="dot"></div>
    <div className="dot"></div>
  </div>
);

// Progress bar loader
export const ProgressLoader = ({ progress = 0, showPercentage = false }) => (
  <div className="progress-loader">
    <div className="progress-bar">
      <div 
        className="progress-fill" 
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      ></div>
    </div>
    {showPercentage && (
      <span className="progress-text">{Math.round(progress)}%</span>
    )}
  </div>
);

export default Loading;