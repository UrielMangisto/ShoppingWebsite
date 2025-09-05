// server/config/mongo.js - MongoDB connection configuration
// MongoDB is used for storing image metadata and other document-based data
import mongoose from 'mongoose'; // MongoDB ODM (Object Document Mapper)
import dotenv from 'dotenv';
dotenv.config();

// Establish MongoDB connection
export async function connectMongo() {
  const uri = process.env.MONGO_URI; // MongoDB connection string from environment
  if (!uri) {
    console.error('❌ Missing MONGO_URI in .env file');
    process.exit(1);
  }
  try {
    // Connect to MongoDB with specific database name
    await mongoose.connect(uri, { 
      dbName: process.env.MONGO_DB || 'store_images' // Default to 'store_images' if not specified
    });
    console.log('✅ MongoDB connected successfully');
  } catch (e) {
    console.error('❌ MongoDB connection failed:', e.message);
    process.exit(1); // Exit if MongoDB connection fails
  }
}
