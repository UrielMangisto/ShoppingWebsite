// server/models/image.model.js
import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema(
  {
    filename: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 255
    },
    contentType: { 
      type: String, 
      required: true,
      enum: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    },
    data: { 
      type: Buffer, 
      required: true 
    },
    size: {
      type: Number,
      required: true,
      min: 0,
      max: 10 * 1024 * 1024 // 10MB max
    }
  },
  { 
    timestamps: true,
    collection: 'images'
  }
);

// Add indexes for better performance
ImageSchema.index({ filename: 1 });
ImageSchema.index({ contentType: 1 });
ImageSchema.index({ createdAt: -1 });

export const Image = mongoose.model('Image', ImageSchema);
