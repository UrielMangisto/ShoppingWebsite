// server/routes/images.routes.js
import express from 'express';
import { getImageById } from '../controllers/images.controller.js';

const router = express.Router();

router.get('/:id', getImageById);

export default router;
