// server/controllers/products.controller.js
import { pool } from '../config/db.js';

// 📄 GET /api/products
export const getAllProducts = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.name AS category
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// 📄 GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.name AS category
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [req.params.id]);

    if (!rows.length) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// ➕ POST /api/products
export const createProduct = async (req, res, next) => {
  const { name, description, price, stock, category_id } = req.body;
  const image = req.file?.filename || null;

  try {
    const [result] = await pool.query(`
      INSERT INTO products (name, description, price, stock, image, category_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [name, description, price, stock || 0, image, category_id]);

    res.status(201).json({ message: 'Product created', productId: result.insertId });
  } catch (err) {
    next(err);
  }
};

// ✏️ PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  const { name, description, price, stock, category_id } = req.body;
  const image = req.file?.filename;

  try {
    const fields = [];
    const values = [];

    if (name) {
      fields.push('name = ?');
      values.push(name);
    }
    if (description) {
      fields.push('description = ?');
      values.push(description);
    }
    if (price) {
      fields.push('price = ?');
      values.push(price);
    }
    if (stock) {
      fields.push('stock = ?');
      values.push(stock);
    }
    if (category_id) {
      fields.push('category_id = ?');
      values.push(category_id);
    }
    if (image) {
      fields.push('image = ?');
      values.push(image);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields provided for update' });
    }

    const sql = `
      UPDATE products
      SET ${fields.join(', ')}
      WHERE id = ?
    `;

    values.push(req.params.id);

    const [result] = await pool.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    next(err);
  }
};


// ❌ DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};
