// server/routes/products.routes.js
import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/products.controller.js';

import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', requireAuth, requireAdmin, upload.single('image'), createProduct);
router.put('/:id', requireAuth, requireAdmin, upload.single('image'), updateProduct);
router.delete('/:id', requireAuth, requireAdmin, deleteProduct);

export default router;
