// server/controllers/categories.controller.js
import { pool } from '../config/db.js';

// 📄 GET /api/categories
export const getAllCategories = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories');
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// ➕ POST /api/categories (admin only)
export const createCategory = async (req, res, next) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Category name is required' });

  try {
    const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
    res.status(201).json({ message: 'Category created', categoryId: result.insertId });
  } catch (err) {
    next(err);
  }
};

// ✏️ PUT /api/categories/:id (admin only)
export const updateCategory = async (req, res, next) => {
  const { name } = req.body;
  try {
    const [result] = await pool.query('UPDATE categories SET name = ? WHERE id = ?', [name, req.params.id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category updated' });
  } catch (err) {
    next(err);
  }
};

// ❌ DELETE /api/categories/:id (admin only)
export const deleteCategory = async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};
