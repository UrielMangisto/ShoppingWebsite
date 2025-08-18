// server/models/image.model.js
import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    data: { type: Buffer, required: true }
  },
  { timestamps: true }
);

export const Image = mongoose.model('Image', ImageSchema);
