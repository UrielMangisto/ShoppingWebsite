// server/controllers/users.controller.js
import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

// GET /api/users (admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role FROM users');
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// GET /api/users/:id
export const getUserById = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/:id
export const updateUser = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  try {
    let hashed = null;
    if (password) {
      hashed = await bcrypt.hash(password, 10);
    }

    const sql = `
      UPDATE users SET 
      name = COALESCE(?, name),
      email = COALESCE(?, email),
      ${hashed ? 'password = ?,' : ''}
      role = COALESCE(?, role)
      WHERE id = ?
    `;
    const values = [name, email];
    if (hashed) values.push(hashed);
    values.push(role, req.params.id);

    const [result] = await pool.query(sql, values);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User updated' });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};
