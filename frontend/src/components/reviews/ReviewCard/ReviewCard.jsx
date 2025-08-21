import React from 'react';
import Rating from '../../common/Rating/Rating';
import { formatDate } from '../../../utils/formatters';

const ReviewCard = ({ review, showAdminControls = false, onDelete }) => {
  const {
    id,
    user,
    rating,
    title,
    content,
    createdAt,
    verifiedPurchase,
    helpfulCount,
    images = []
  } = review;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Review Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {user.avatar ? (
              <img
                className="h-10 w-10 rounded-full"
                src={user.avatar}
                alt={user.name}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-medium text-gray-900">{user.name}</h4>
            <div className="mt-1 flex items-center space-x-2">
              <Rating value={rating} size="sm" readOnly />
              {verifiedPurchase && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  Verified Purchase
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          {formatDate(createdAt)}
        </div>
      </div>

      {/* Review Content */}
      <div className="mt-4">
        <h3 className="text-base font-medium text-gray-900">{title}</h3>
        <div className="mt-2 text-sm text-gray-600 space-y-4">
          <p>{content}</p>
        </div>

        {/* Review Images */}
        {images.length > 0 && (
          <div className="mt-4">
            <div className="flex space-x-2 overflow-x-auto">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="h-20 w-20 object-cover rounded-md"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Review Footer */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <svg
              className="h-5 w-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
            Helpful ({helpfulCount})
          </button>
          <button
            type="button"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Report
          </button>
        </div>

        {showAdminControls && (
          <button
            type="button"
            onClick={() => onDelete(id)}
            className="inline-flex items-center text-sm text-red-600 hover:text-red-800"
          >
            <svg
              className="h-5 w-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete Review
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
