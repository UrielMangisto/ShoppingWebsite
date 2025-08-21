import React, { useState } from 'react';
import { useReviews } from '../../../hooks/useReviews';
import Rating from '../../common/Rating/Rating';
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage';

const ReviewForm = ({ productId, onSuccess }) => {
  const { addReview } = useReviews();
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [characterCount, setCharacterCount] = useState(0);
  const maxCharacters = 500;

  const handleRatingChange = (value) => {
    setFormData(prev => ({ ...prev, rating: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'content') {
      setCharacterCount(value.length);
      if (value.length > maxCharacters) return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (formData.rating === 0) {
      setError('Please select a rating');
      return false;
    }
    if (!formData.title.trim()) {
      setError('Please enter a title');
      return false;
    }
    if (!formData.content.trim()) {
      setError('Please enter a review');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      await addReview(productId, formData);
      setFormData({ rating: 0, title: '', content: '' });
      setCharacterCount(0);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Rating Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Rating
          </label>
          <div className="mt-1">
            <Rating
              value={formData.rating}
              onChange={handleRatingChange}
              size="lg"
            />
          </div>
        </div>

        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Review Title
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Summarize your experience"
            />
          </div>
        </div>

        {/* Content Input */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Review Content
          </label>
          <div className="mt-1">
            <textarea
              id="content"
              name="content"
              rows={4}
              value={formData.content}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Share your experience with this product"
            />
            <div className="mt-2 flex justify-end">
              <span className={`text-sm ${
                characterCount > maxCharacters ? 'text-red-500' : 'text-gray-500'
              }`}>
                {characterCount}/{maxCharacters} characters
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-2">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading || characterCount > maxCharacters}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading || characterCount > maxCharacters
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
