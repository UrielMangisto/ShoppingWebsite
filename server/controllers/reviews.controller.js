import { fetchReviewsForProduct, addReviewToProduct, modifyReview, removeReviewFromProduct, calculateProductAverageRating } from '../services/reviews.service.js';

export const getReviewsForProduct = async (req, res, next) => {
  try {
    const reviews = await fetchReviewsForProduct(req.params.productId);
    res.json(reviews);
  } catch (e) {
    next(e);
  }
};

export const addReviewForProduct = async (req, res, next) => {
  try {
    const review = await addReviewToProduct({ userId: req.user.id, productId: req.params.productId, ...req.body });
    res.status(201).json({ message: 'Review added', review });
  } catch (e) {
    next(e);
  }
};

export const updateReviewForProduct = async (req, res, next) => {
  try {
    const updated = await modifyReview({ reviewId: req.params.reviewId, userId: req.user.id, ...req.body });
    res.json({ message: 'Review updated', updated });
  } catch (e) {
    next(e);
  }
};

export const deleteReviewForProduct = async (req, res, next) => {
  try {
    await removeReviewFromProduct({ reviewId: req.params.reviewId, userId: req.user.id });
    res.json({ message: 'Review deleted' });
  } catch (e) {
    next(e);
  }
};

export const getAverageRatingForProduct = async (req, res, next) => {
  try {
    const average = await calculateProductAverageRating(req.params.productId);
    res.json({ average });
  } catch (e) {
    next(e);
  }
};
