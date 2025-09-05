// server/config/db.js - MySQL database connection configuration
import mysql from 'mysql2/promise'; // Promise-based MySQL driver for async/await support
import dotenv from 'dotenv';
dotenv.config();

// Create connection pool for efficient database connections
// Pool manages multiple connections and reuses them for better performance
export const pool = mysql.createPool({
  host: process.env.DB_HOST, // Database server hostname
  user: process.env.DB_USER, // Database username
  password: process.env.DB_PASSWORD, // Database password
  database: process.env.DB_NAME, // Database name
  waitForConnections: true, // Queue requests when no connections available
  connectionLimit: 10 // Maximum number of simultaneous connections
});

// Test database connection and establish initial connection
const connectDB = async () => {
  try {
    // Get a connection from the pool to test connectivity
    const conn = await pool.getConnection();
    await conn.ping(); // Verify connection is alive
    console.log('✅ MySQL connected successfully');
    conn.release(); // Return connection to pool
  } catch (e) {
    console.error('❌ MySQL connection failed:', e.message);
    process.exit(1); // Exit application if database connection fails
  }
};

export default connectDB;
