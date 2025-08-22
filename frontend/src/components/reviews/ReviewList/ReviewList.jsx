import React, { useState } from 'react';
import { useReviews } from '../../../hooks/useReviews';
import ReviewCard from '../ReviewCard/ReviewCard';
import Pagination from '../../common/Pagination/Pagination';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage';
import ConfirmationModal from '../../common/ConfirmationModal/ConfirmationModal';

const ReviewList = ({ productId, showAdminControls = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { reviews, loading, error, totalPages, deleteReview } = useReviews(productId, currentPage);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const handleDeleteClick = (reviewId) => {
    setReviewToDelete(reviewId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (reviewToDelete) {
      try {
        await deleteReview(reviewToDelete);
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    }
    setDeleteModalOpen(false);
    setReviewToDelete(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  // Group reviews by rating for summary
  const reviewSummary = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {});

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Customer Reviews</h3>
            <p className="mt-1 text-sm text-gray-500">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">out of 5</div>
          </div>
        </div>

        {/* Rating Bars */}
        <div className="mt-6 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviewSummary[rating] || 0;
            const percentage = (count / reviews.length) * 100;
            return (
              <div key={rating} className="flex items-center">
                <div className="w-12 text-sm text-gray-600">{rating} stars</div>
                <div className="flex-1 ml-4">
                  <div className="h-2 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-yellow-400"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right text-sm text-gray-600">
                  {count} ({percentage.toFixed(0)}%)
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            showAdminControls={showAdminControls}
            onDelete={() => handleDeleteClick(review.id)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default ReviewList;
