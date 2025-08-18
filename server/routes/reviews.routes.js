// server/routes/reviews.routes.js
import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';
import { getReviewsForProduct, addReviewForProduct, deleteReviewForProduct as removeReview, updateReviewForProduct as updateReview } from '../controllers/reviews.controller.js';

const router = express.Router();

// nested under /api
router.get('/:productId/reviews', getReviewsForProduct);
router.post('/:productId/reviews', requireAuth, addReviewForProduct);
router.delete('/:productId/reviews/:id', requireAuth, removeReview);
router.put('/:productId/reviews/:reviewId', requireAuth, updateReview);

export default router;
