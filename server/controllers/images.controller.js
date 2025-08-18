// server/controllers/images.controller.js
import mongoose from 'mongoose';
import { Image } from '../models/image.model.js';

export const getImageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid image id' });
    const img = await Image.findById(id).lean();
    if (!img) return res.status(404).json({ message: 'Image not found' });
    res.set('Content-Type', img.contentType);
    res.send(Buffer.from(img.data));
  } catch (e) { next(e); }
};
