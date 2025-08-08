// server/middleware/error.middleware.js
export const errorHandler = (err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal server error'
  });
};
