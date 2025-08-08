// server/controllers/order.controller.js
import { pool } from '../config/db.js';

// 📥 POST /api/orders
export const createOrder = async (req, res, next) => {
  const userId = req.user.id;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // get cart items of the user
    const [cartItems] = await conn.query(
      `SELECT ci.product_id, ci.quantity, p.price, p.stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`, [userId]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // create order
    const [orderResult] = await conn.query(
      `INSERT INTO orders (user_id) VALUES (?)`,
      [userId]
    );
    const orderId = orderResult.insertId;

    // for each item in cart – add to order, update stock
    for (const item of cartItems) {
      const newStock = item.stock - item.quantity;
      if (newStock < 0) {
        throw new Error(`Not enough stock for product ${item.product_id}`);
      }

      await conn.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, item.price]
      );

      await conn.query(
        `UPDATE products SET stock = ? WHERE id = ?`,
        [newStock, item.product_id]
      );
    }

    // clear cart
    await conn.query(`DELETE FROM cart_items WHERE user_id = ?`, [userId]);

    await conn.commit();
    res.status(201).json({ message: 'Order created successfully', orderId });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};

// 📄 GET /api/orders - all orders for user
export const getMyOrders = async (req, res, next) => {
  try {
    const [orders] = await pool.query(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// 📄 GET /api/orders/:id - get order by id
export const getOrderById = async (req, res, next) => {
  const orderId = req.params.id;
  try {
    const [[order]] = await pool.query(
      `SELECT * FROM orders WHERE id = ?`, [orderId]
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const [items] = await pool.query(
      `SELECT oi.quantity, oi.price, p.name, p.image
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`, [orderId]
    );

    res.json({ order, items });
  } catch (err) {
    next(err);
  }
};

// 📄 GET /api/orders/all – all orders (admin only)
export const getAllOrders = async (req, res, next) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.id, o.created_at, u.name, u.email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );
    res.json(orders);
  } catch (err) {
    next(err);
  }
};
