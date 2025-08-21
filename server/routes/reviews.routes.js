// server/routes/reviews.routes.js
import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';
import { getReviewsForProduct, addReviewForProduct, deleteReviewForProduct as removeReview, updateReviewForProduct as updateReview } from '../controllers/reviews.controller.js';

const router = express.Router({ mergeParams: true });

// nested under /api
router.get('/', getReviewsForProduct);
router.post('/', requireAuth, addReviewForProduct);
router.delete('/:reviewId', requireAuth, removeReview);
router.put('/:reviewId', requireAuth, updateReview);

export default router;
