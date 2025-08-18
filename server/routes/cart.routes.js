// server/routes/cart.routes.js
import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { getCart, addToCart, updateCartItem, deleteCartItem } from '../controllers/cart.controller.js';

const router = express.Router();

router.use(requireAuth);
router.get('/', getCart);
router.post('/', addToCart);
router.put('/:id', updateCartItem);
router.delete('/:id', deleteCartItem);

export default router;
