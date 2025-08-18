// server/routes/orders.routes.js
import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';
import { createOrder, getMyOrders, getOrder, getAllOrdersAdmin } from '../controllers/orders.controller.js';

const router = express.Router();

router.use(requireAuth);
router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrder);
router.get('/all/admin', requireAdmin, getAllOrdersAdmin);

export default router;
