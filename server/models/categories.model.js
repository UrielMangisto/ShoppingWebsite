// server/models/categories.model.js
import { pool } from '../config/db.js';

export const findAllCategories = async () => {
  const [rows] = await pool.query('SELECT * FROM categories');
  return rows;
};

export const findCategoryById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
  return rows[0];
};

export const createCategoryRow = async (name) => {
  const [res] = await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
  return res.insertId;
};

export const updateCategoryRow = async (id, name) => {
  const [res] = await pool.query('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
  return res.affectedRows;
};

export const deleteCategoryRow = async (id) => {
  const [res] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
  return res.affectedRows;
};
