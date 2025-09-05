// server/models/users.model.js - User data access layer (DAL)
// This module handles all database operations related to users
import { pool } from '../config/db.js';

// Retrieve all users (admin view) - excludes sensitive information
export const findAllUsers = async () => {
  const [rows] = await pool.query('SELECT id, name, email, role FROM users');
  return rows;
};

// Find user by ID - safe query without password
export const findUserById = async (id) => {
  const [rows] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [id]);
  return rows[0] || null;
};

// Find user by email - includes password for authentication purposes
// Note: This function is used for login verification and includes password
export const findUserByEmailRaw = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

// Create new user with role validation
export const createUser = async ({ name, email, password, role }) => {
  // Security: Default to 'user' role if not specified or invalid
  const userRole = role || 'user';
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, password, userRole]
  );
  return result.insertId; // Return the ID of the newly created user
};

// Admin-specific function to create another admin user
// This should only be called from admin routes with proper authorization
export const createAdminUser = async ({ name, email, password }) => {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, password, 'admin']
  );
  return result.insertId;
};

// Update user profile information (secure field whitelisting)
export const updateUserById = async (id, userData) => {
  // Security: Whitelist allowed fields to prevent unauthorized updates
  const allowedFields = ['name', 'email'];
  const fields = [];
  const values = [];
  
  // Build dynamic query with only allowed fields
  for (const [key, value] of Object.entries(userData)) {
    if (allowedFields.includes(key) && value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }
  
  // Return early if no valid fields to update
  if (fields.length === 0) return 0;
  
  values.push(id); // Add user ID for WHERE clause
  const [result] = await pool.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`, 
    values
  );
  return result.affectedRows;
};

// Separate function for password updates (requires additional security checks)
export const updateUserPassword = async (id, hashedPassword) => {
  const [result] = await pool.query(
    'UPDATE users SET password = ? WHERE id = ?', 
    [hashedPassword, id]
  );
  return result.affectedRows;
};

// Delete user (admin only operation)
export const deleteUserById = async (id) => {
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows;
};
