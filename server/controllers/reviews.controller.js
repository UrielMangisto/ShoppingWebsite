import { listReviewsByProductFromDB, createReviewInDB, updateReviewInDB, deleteReviewFromDB } from '../models/reviews.model.js';

// Helper function to transform review data for response
const transformReviewForResponse = (review) => {
  return {
    id: review.id,
    product_id: review.product_id,
    user_id: review.user_id,
    user_name: review.user_name,
    rating: review.rating,
    comment: review.comment,
    created_at: review.created_at,
    updated_at: review.updated_at
  };
};

export const getReviewsForProduct = async (req, res, next) => {
  try {
    const reviews = await listReviewsByProductFromDB(req.params.productId);
    const transformedReviews = reviews.map(transformReviewForResponse);
    res.json(transformedReviews);
  } catch (e) {
    next(e);
  }
};

export const addReviewForProduct = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    
    const review = await createReviewInDB({ 
      product_id: req.params.productId, 
      user_id: req.user.id, 
      rating, 
      comment 
    });
    
    res.status(201).json({ message: 'Review added', review });
  } catch (e) {
    next(e);
  }
};

export const updateReviewForProduct = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    
    const updated = await updateReviewInDB({ 
      id: req.params.reviewId, 
      user_id: req.user.id, 
      rating, 
      comment 
    });
    
    res.json({ message: 'Review updated', updated });
  } catch (e) {
    next(e);
  }
};

export const deleteReviewForProduct = async (req, res, next) => {
  try {
    await deleteReviewFromDB({ 
      id: req.params.reviewId, 
      user_id: req.user.id 
    });
    
    res.json({ message: 'Review deleted' });
  } catch (e) {
    next(e);
  }
};

export const getAverageRatingForProduct = async (req, res, next) => {
  try {
    const reviews = await listReviewsByProductFromDB(req.params.productId);
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    
    const result = reviews.length 
      ? { 
          average: total / reviews.length, 
          reviews: reviews.map(transformReviewForResponse) 
        } 
      : { 
          average: 0, 
          reviews: [] 
        };
    
    res.json(result);
  } catch (e) {
    next(e);
  }
};
