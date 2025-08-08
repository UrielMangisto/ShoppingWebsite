// server/routes/order.routes.js
import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders
} from '../controllers/order.controller.js';

import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(requireAuth);
router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);
router.get('/all/admin', requireAdmin, getAllOrders); // admin only

export default router;
