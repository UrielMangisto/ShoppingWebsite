// server/controllers/cart.controller.js
import { pool } from '../config/db.js';

// 📄 GET /api/cart
export const getUserCart = async (req, res, next) => {
  try {
    const sql = `
      SELECT ci.id, p.name, p.price, p.image, ci.quantity
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `;
    const [rows] = await pool.query(sql, [req.user.id]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// ➕ POST /api/cart
export const addToCart = async (req, res, next) => {
  const { product_id, quantity } = req.body;
  if (!product_id || !quantity) return res.status(400).json({ message: 'Missing fields' });

  try {
    // בדיקה אם הפריט כבר בעגלה
    const [existing] = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [req.user.id, product_id]
    );

    if (existing.length > 0) {
      // עדכון כמות קיימת
      await pool.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
        [quantity, req.user.id, product_id]
      );
    } else {
      await pool.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [req.user.id, product_id, quantity]
      );
    }

    res.status(201).json({ message: 'Product added to cart' });
  } catch (err) {
    next(err);
  }
};

// ✏️ PUT /api/cart/:id
export const updateCartItem = async (req, res, next) => {
  const { quantity } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Cart item updated' });
  } catch (err) {
    next(err);
  }
};

// ❌ DELETE /api/cart/:id
export const deleteCartItem = async (req, res, next) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    next(err);
  }
};
