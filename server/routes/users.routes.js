// server/routes/users.routes.js
import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/users.controller.js';

const router = express.Router();

router.get('/', requireAuth, requireAdmin, getAllUsers);
router.get('/:id', requireAuth, getUserById);
router.put('/:id', requireAuth, updateUser);
router.delete('/:id', requireAuth, requireAdmin, deleteUser);

export default router;
