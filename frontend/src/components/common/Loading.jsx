// src/components/common/Loading.jsx
import React from 'react';

const Loading = ({ 
  size = 'medium', 
  text = 'טוען...', 
  showText = true,
  centered = true,
  fullScreen = false 
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'w-6 h-6 border-2';
      case 'large':
        return 'w-16 h-16 border-4';
      case 'medium':
      default:
        return 'w-10 h-10 border-4';
    }
  };

  const containerClass = `
    ${centered ? 'flex flex-col items-center justify-center' : ''}
    ${fullScreen ? 'fixed inset-0 bg-white bg-opacity-80 z-50' : ''}
    ${centered && !fullScreen ? 'py-8' : ''}
  `.trim();

  const spinnerClass = `
    ${getSizeClass()}
    border-gray-200 
    border-t-primary-600 
    rounded-full 
    animate-spin
  `.trim();

  if (fullScreen) {
    return (
      <div className={containerClass}>
        <div className={spinnerClass}></div>
        {showText && (
          <p className="mt-4 text-gray-600 text-lg">{text}</p>
        )}
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className={spinnerClass}></div>
      {showText && (
        <p className="mt-2 text-gray-600">{text}</p>
      )}
    </div>
  );
};

// Spinner פשוט ללא טקסט
export const Spinner = ({ size = 'medium', className = '' }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4 border-2';
      case 'large':
        return 'w-8 h-8 border-2';
      case 'medium':
      default:
        return 'w-6 h-6 border-2';
    }
  };

  return (
    <div 
      className={`
        ${getSizeClass()} 
        border-gray-200 
        border-t-current 
        rounded-full 
        animate-spin 
        ${className}
      `.trim()}
    />
  );
};

// Loading עם skeleton
export const LoadingSkeleton = ({ lines = 3, className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }, (_, index) => (
        <div
          key={index}
          className={`
            h-4 
            bg-gray-200 
            rounded 
            mb-2
            ${index === lines - 1 ? 'w-3/4' : 'w-full'}
          `}
        />
      ))}
    </div>
  );
};

// Loading עבור כרטיסי מוצרים
export const ProductCardSkeleton = () => {
  return (
    <div className="card animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
};

export default Loading;