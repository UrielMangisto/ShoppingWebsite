// server/models/cart.model.js
import { pool } from '../config/db.js';

export const findCartByUser = async (userId) => {
  const [rows] = await pool.query(`
    SELECT ci.id, ci.product_id, ci.quantity,
           p.name, p.price, p.image_id
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    WHERE ci.user_id = ?`, [userId]);
  return rows;
};

export const findCartItem = async (userId, productId) => {
  const [rows] = await pool.query(
    'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
    [userId, productId]
  );
  return rows[0];
};

export const insertCartItem = async (userId, productId, quantity) => {
  const [res] = await pool.query(
    'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
    [userId, productId, quantity]
  );
  return res.insertId;
};

export const increaseCartItem = async (userId, productId, quantity) => {
  const [res] = await pool.query(
    'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
    [quantity, userId, productId]
  );
  return res.affectedRows;
};

export const updateCartItemQty = async (id, userId, quantity) => {
  const [res] = await pool.query(
    'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
    [quantity, id, userId]
  );
  return res.affectedRows;
};

export const deleteCartItemById = async (id, userId) => {
  const [res] = await pool.query(
    'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return res.affectedRows;
};

export const clearCart = async (userId, conn = pool) => {
  await conn.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
};
