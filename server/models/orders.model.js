// server/models/orders.model.js
import { pool } from '../config/db.js';

export const createOrderRow = async (userId, orderData, conn) => {
  const { shipping, totalAmount } = orderData || {};
  
  if (shipping) {
    // Insert with shipping information
    const [res] = await conn.query(`
      INSERT INTO orders (
        user_id, total, shipping_name, shipping_email, 
        shipping_address, shipping_city, shipping_postal_code, shipping_country
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
      userId, 
      totalAmount || 0, 
      shipping.fullName || null, 
      shipping.email || null,
      shipping.address || null, 
      shipping.city || null, 
      shipping.postalCode || null, 
      shipping.country || null
    ]);
    return res.insertId;
  } else {
    // Fallback to simple insert for backward compatibility
    const [res] = await conn.query('INSERT INTO orders (user_id, total) VALUES (?, ?)', [userId, totalAmount || 0]);
    return res.insertId;
  }
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
  const [orders] = await pool.query('SELECT id, user_id, status, total, shipping_name, shipping_email, shipping_address, shipping_city, shipping_postal_code, shipping_country, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  
  // For each order, fetch its items
  for (const order of orders) {
    const [items] = await pool.query(`
      SELECT oi.quantity, oi.price, p.name, p.image_id, p.id as product_id
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = ?`, [order.id]);
    order.items = items;
  }
  
  return orders;
};

export const findOrderById = async (orderId) => {
  const [[order]] = await pool.query('SELECT id, user_id, status, total, shipping_name, shipping_email, shipping_address, shipping_city, shipping_postal_code, shipping_country, created_at FROM orders WHERE id = ?', [orderId]);
  return order;
};

export const findOrderItems = async (orderId) => {
  const [rows] = await pool.query(`
    SELECT oi.quantity, oi.price, p.name, p.image_id
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = ?`, [orderId]);
  return rows;
};

export const findAllOrdersWithUser = async () => {
  const [rows] = await pool.query(`
    SELECT o.id, o.status, o.total, o.created_at, u.name, u.email
    FROM orders o
    JOIN users u ON u.id = o.user_id
    ORDER BY o.created_at DESC`);
  return rows;
};
