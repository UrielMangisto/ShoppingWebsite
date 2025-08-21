// server/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
  const h = req.headers.authorization || '';
  
  if (!h.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token format' });
  }
  
  const token = h.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
