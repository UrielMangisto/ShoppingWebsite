// server/config/mongo.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export async function connectMongo() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ Missing MONGO_URI in .env');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, { dbName: process.env.MONGO_DB || 'store_images' });
    console.log('✅ MongoDB connected');
  } catch (e) {
    console.error('❌ MongoDB connection failed:', e.message);
    process.exit(1);
  }
}
