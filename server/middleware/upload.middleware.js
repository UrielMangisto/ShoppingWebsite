// server/middleware/upload.middleware.js
import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const ok = ['.jpg','.jpeg','.png','.gif'].includes(path.extname(file.originalname).toLowerCase());
    if (!ok) return cb(new Error('Only image files are allowed'));
    cb(null, true);
  }
});
