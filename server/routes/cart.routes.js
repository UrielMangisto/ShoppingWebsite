// server/routes/cart.routes.js
import express from 'express';
import {
  getUserCart,
  addToCart,
  updateCartItem,
  deleteCartItem
} from '../controllers/cart.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(requireAuth);
router.get('/', getUserCart);
router.post('/', addToCart);
router.put('/:id', updateCartItem);
router.delete('/:id', deleteCartItem);

export default router;
