// server/models/users.model.js
import { pool } from '../config/db.js';

export const findAllUsers = async () => {
  const [rows] = await pool.query('SELECT id, name, email, role FROM users');
  return rows;
};

export const findUserById = async (id) => {
  const [rows] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [id]);
  return rows[0];
};

export const findUserByEmailRaw = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

export const createUser = async ({ name, email, password, role = 'user' }) => {
  const [res] = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, password, role]
  );
  return res.insertId;
};

export const updateUserById = async (id, userData) => {
  const fields = [], values = [];
  for (const [key, value] of Object.entries(userData)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }
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
