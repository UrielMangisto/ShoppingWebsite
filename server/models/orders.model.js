// server/models/orders.model.js
import { pool } from '../config/db.js';

export const createOrderRow = async (userId, conn) => {
  const [res] = await conn.query('INSERT INTO orders (user_id) VALUES (?)', [userId]);
  return res.insertId;
};

export const getCartForOrder = async (userId, conn) => {
  const [rows] = await conn.query(`
    SELECT ci.product_id, ci.quantity, p.price, p.stock
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    WHERE ci.user_id = ?`, [userId]);
  return rows;
};

export const insertOrderItem = async (orderId, { product_id, quantity, price }, conn) => {
  await conn.query(
    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
    [orderId, product_id, quantity, price]
  );
};

export const updateProductStock = async (productId, newStock, conn) => {
  await conn.query('UPDATE products SET stock = ? WHERE id = ?', [newStock, productId]);
};

export const findOrdersByUser = async (userId) => {
  const [rows] = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  return rows;
};

export const findOrderById = async (orderId) => {
  const [[order]] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
  return order;
};

export const findOrderItems = async (orderId) => {
  const [rows] = await pool.query(`
    SELECT oi.quantity, oi.price, p.name, p.image
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = ?`, [orderId]);
  return rows;
};

export const findAllOrdersWithUser = async () => {
  const [rows] = await pool.query(`
    SELECT o.id, o.created_at, u.name, u.email
    FROM orders o
    JOIN users u ON u.id = o.user_id
    ORDER BY o.created_at DESC`);
  return rows;
};
