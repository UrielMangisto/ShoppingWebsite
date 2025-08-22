import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'blue', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const colorClasses = {
    blue: 'border-blue-500',
    gray: 'border-gray-500',
    white: 'border-white'
  };

  const spinnerClasses = `
    animate-spin rounded-full 
    border-2 
    border-t-transparent 
    ${sizeClasses[size]} 
    ${colorClasses[color]}
  `;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className={spinnerClasses}></div>
      </div>
    );
  }

  return <div className={spinnerClasses}></div>;
};

export default LoadingSpinner;
