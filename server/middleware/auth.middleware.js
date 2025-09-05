// server/middleware/auth.middleware.js - Authentication middleware for protecting routes
import jwt from 'jsonwebtoken'; // JSON Web Token library for token verification

// Middleware to verify JWT token and authenticate users
export const requireAuth = (req, res, next) => {
  // Extract Authorization header (format: "Bearer <token>")
  const authHeader = req.headers.authorization || '';
  
  // Check if header follows Bearer token format
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'Missing or invalid token format. Expected: Bearer <token>' 
    });
  }
  
  // Extract the actual token (remove "Bearer " prefix)
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token signature and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user information to request object for use in subsequent middleware/routes
    req.user = decoded; // Contains: { id, email, name, role, iat, exp }
    
    next(); // Continue to next middleware or route handler
  } catch (error) {
    // Token is invalid, expired, or malformed
    res.status(403).json({ 
      message: 'Invalid or expired token',
      error: error.message 
    });
  }
};

// Middleware to check if authenticated user has admin privileges
// Note: This middleware MUST be used after requireAuth middleware
export const requireAdmin = (req, res, next) => {
  // Check if user exists (should be set by requireAuth middleware)
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Authentication required. Please login first.' 
    });
  }
  
  // Check if user has admin role
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Admin access required. Insufficient privileges.' 
    });
  }
  
  next(); // User is authenticated and has admin role
};
