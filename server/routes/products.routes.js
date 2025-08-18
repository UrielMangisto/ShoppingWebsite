// server/routes/products.routes.js
import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import {
  getAllProducts, getProduct, createProduct, updateProduct, deleteProduct
} from '../controllers/products.controller.js';
import reviewsRoutes from './reviews.routes.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.post('/', requireAuth, requireAdmin, upload.single('image'), createProduct);
router.put('/:id', requireAuth, requireAdmin, upload.single('image'), updateProduct);
router.delete('/:id', requireAuth, requireAdmin, deleteProduct);
router.use('/:productId/reviews', reviewsRoutes);

export default router;
