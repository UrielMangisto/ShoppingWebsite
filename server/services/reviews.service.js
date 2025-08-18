import { listReviewsByProductFromDB, createReviewInDB, updateReviewInDB, deleteReviewFromDB } from '../models/reviews.model.js';
import { ReviewDTO } from '../dtos/review.dto.js';

export const fetchReviewsForProduct = async (productId) => {
  const reviews = await listReviewsByProductFromDB(productId);
  return reviews.map(review => new ReviewDTO(review));
};

export const addReviewToProduct = async ({ userId, productId, rating, comment }) => {
  return await createReviewInDB({ product_id: productId, user_id: userId, rating, comment });
};

export const modifyReview = async ({ reviewId, userId, rating, comment }) => {
  return await updateReviewInDB({ id: reviewId, user_id: userId, rating, comment });
};

export const removeReviewFromProduct = async ({ reviewId, userId }) => {
  return await deleteReviewFromDB({ id: reviewId, user_id: userId });
};

export const calculateProductAverageRating = async (productId) => {
  const reviews = await listReviewsByProductFromDB(productId);
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return reviews.length ? { average: total / reviews.length, reviews: reviews.map(review => new ReviewDTO(review)) } : { average: 0, reviews: [] };
};
