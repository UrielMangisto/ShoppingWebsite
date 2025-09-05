// server/middleware/error.middleware.js - Global error handling middleware
// This middleware catches all errors thrown in the application and formats the response

export const errorHandler = (err, req, res, next) => {
  // Log the error for debugging (in production, use proper logging service)
  console.error('❌ Server Error:', {
    message: err.message,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Determine status code - use error's statusCode or default to 500
  const statusCode = err.statusCode || err.status || 500;
  
  // Send error response to client
  res.status(statusCode).json({ 
    message: err.message || 'Internal server error'
  });
};
