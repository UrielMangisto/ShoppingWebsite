// server/models/products.model.js
import { pool } from '../config/db.js';

export const findAllProducts = async ({ limit, offset } = {}) => {
  if (limit != null && offset != null) {
    console.log('[Model] Executing SQL with LIMIT and OFFSET:', { limit, offset });
    const [rows] = await pool.query(`
      SELECT p.*, c.name AS category
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LIMIT ? OFFSET ?`, [limit, offset]);
    console.log('[Model] SQL Results:', rows);
    return rows;
  }
  console.log('[Model] Executing SQL without LIMIT and OFFSET');
  const [rows] = await pool.query(`
    SELECT p.*, c.name AS category
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id`);
  console.log('[Model] SQL Results:', rows);
  return rows;
};

export const findProductById = async (id) => {
  const [rows] = await pool.query(`
    SELECT p.*, c.name AS category
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?`, [id]);
  return rows[0];
};

export const createProductRow = async ({ name, description, price, stock = 0, category_id = null, image_id = null }) => {
  const [result] = await pool.query(
    `INSERT INTO products (name, description, price, stock, category_id, image_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, description, price, stock, category_id, image_id]
  );
  return result.insertId;
};

export const updateProductPartial = async (id, fields) => {
  const allowed = ['name','description','price','stock','category_id','image_id'];
  const set = [];
  const vals = [];
  for (const k of allowed) {
    if (fields[k] !== undefined) { set.push(`${k} = ?`); vals.push(fields[k]); }
  }
  if (!set.length) return 0;
  vals.push(id);
  const [res] = await pool.query(`UPDATE products SET ${set.join(', ')} WHERE id = ?`, vals);
  return res.affectedRows;
};

export const deleteProductById = async (id) => {
  const [res] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
  return res.affectedRows;
};
