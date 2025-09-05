// server/index.js - Main server entry point for the e-commerce application
import express from 'express';
import cors from 'cors'; // Enable Cross-Origin Resource Sharing for frontend communication
import dotenv from 'dotenv'; // Load environment variables from .env file
import path from 'path';
import { fileURLToPath } from 'url'; // ES modules support for __dirname

// Database connections - hybrid approach with both MySQL and MongoDB
import { connectMongo } from './config/mongo.js'; // MongoDB for complex data structures
import connectDB from './config/db.js'; // MySQL for relational data (products, users, orders)
import { errorHandler } from './middleware/error.middleware.js'; // Global error handling middleware

// API Route imports - modular routing structure for better organization
import authRoutes from './routes/auth.routes.js'; // Authentication (login, register, JWT)
import userRoutes from './routes/users.routes.js'; // User profile management
import productRoutes from './routes/products.routes.js'; // Product CRUD and search
import categoryRoutes from './routes/categories.routes.js'; // Product categories
import cartRoutes from './routes/cart.routes.js'; // Shopping cart functionality
import orderRoutes from './routes/orders.routes.js'; // Order processing and history
import imageRoutes from './routes/images.routes.js'; // Image upload and management

dotenv.config(); // Load environment variables

// Initialize database connections - ensure both databases are ready before starting server
await connectDB(); // MySQL connection
await connectMongo(); // MongoDB connection

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // ES modules workaround for __dirname

// Middleware configuration
app.use(cors()); // Enable CORS for frontend-backend communication
app.use(express.json()); // Parse JSON request bodies

// API Routes configuration - RESTful API endpoints
app.use('/api/auth', authRoutes); // Authentication endpoints
app.use('/api/users', userRoutes); // User management endpoints
app.use('/api/products', productRoutes); // Product management endpoints
app.use('/api/categories', categoryRoutes); // Category management endpoints
app.use('/api/cart', cartRoutes); // Shopping cart endpoints
app.use('/api/orders', orderRoutes); // Order processing endpoints
app.use('/api/images', imageRoutes); // Image handling endpoints

// Global error handling middleware - must be last
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000; // Use environment port or default to 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
