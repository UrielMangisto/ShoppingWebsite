// server/controllers/orders.controller.js
import { pool } from '../config/db.js';
import {
  createOrderRow, getCartForOrder, insertOrderItem,
  updateProductStock, findOrdersByUser, findOrderById,
  findOrderItems, findAllOrdersWithUser
} from '../models/orders.model.js';
import { clearCart } from '../models/cart.model.js';

export const createOrder = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const cart = await getCartForOrder(req.user.id, conn);
    if (!cart.length) return res.status(400).json({ message: 'Cart is empty' });

    // Calculate total from cart items (server-side calculation for security)
    let cartTotal = 0;
    for (const item of cart) {
      const newStock = item.stock - item.quantity;
      if (newStock < 0) throw new Error(`Not enough stock for product ${item.product_id}`);
      cartTotal += item.price * item.quantity;
    }

    // Calculate additional costs
    const shippingCost = cartTotal >= 50 ? 0 : 5.99;
    const tax = cartTotal * 0.1; // 10% tax
    const finalTotal = cartTotal + shippingCost + tax;

    // Create order with calculated total and shipping info
    const orderData = {
      shipping: req.body.shipping,
      totalAmount: parseFloat(finalTotal.toFixed(2))
    };

    const orderId = await createOrderRow(req.user.id, orderData, conn);

    // Process cart items
    for (const item of cart) {
      const newStock = item.stock - item.quantity;
      await insertOrderItem(orderId, item, conn);
      await updateProductStock(item.product_id, newStock, conn);
    }

    await clearCart(req.user.id, conn);
    await conn.commit();
    res.status(201).json({ 
      message: 'Order created successfully', 
      orderId,
      total: finalTotal,
      breakdown: {
        subtotal: cartTotal,
        shipping: shippingCost,
        tax: tax,
        total: finalTotal
      }
    });
  } catch (e) {
    await conn.rollback();
    next(e);
  } finally {
    conn.release();
  }
};

export const getMyOrders = async (req, res, next) => {
  try { res.json(await findOrdersByUser(req.user.id)); } catch (e) { next(e); }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await findOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const items = await findOrderItems(req.params.id);
    res.json({ order, items });
  } catch (e) { next(e); }
};

export const getAllOrdersAdmin = async (req, res, next) => {
  try { res.json(await findAllOrdersWithUser()); } catch (e) { next(e); }
};
