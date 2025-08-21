// server/models/users.model.js
import { pool } from '../config/db.js';

export const findAllUsers = async () => {
  const [rows] = await pool.query('SELECT id, name, email, role FROM users');
  return rows;
};

export const findUserById = async (id) => {
  const [rows] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [id]);
  return rows[0] || null;
};

export const findUserByEmailRaw = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

export const createUser = async ({ name, email, password, role }) => {
  // Allow role parameter, default to 'user' if not provided
  const userRole = role || 'user';
  const [res] = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, password, userRole]
  );
  return res.insertId;
};

// Admin-only function to create another admin
export const createAdminUser = async ({ name, email, password }) => {
  const [res] = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, password, 'admin']
  );
  return res.insertId;
};

// Admin-only function to promote user to admin
export const promoteUserToAdmin = async (userId) => {
  const [res] = await pool.query(
    'UPDATE users SET role = ? WHERE id = ?',
    ['admin', userId]
  );
  return res.affectedRows;
};

export const updateUserById = async (id, userData) => {
  // Whitelist allowed fields for security
  const allowedFields = ['name', 'email'];
  const fields = [], values = [];
  
  for (const [key, value] of Object.entries(userData)) {
    if (allowedFields.includes(key)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }
  
  if (fields.length === 0) return 0; // No valid fields to update
  
  values.push(id);
  const [res] = await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
  return res.affectedRows;
};

export const updateUserPassword = async (id, password) => {
  const [res] = await pool.query('UPDATE users SET password = ? WHERE id = ?', [password, id]);
  return res.affectedRows;
};

export const deleteUserById = async (id) => {
  const [res] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return res.affectedRows;
};
