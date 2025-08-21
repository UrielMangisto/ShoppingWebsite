// server/controllers/cart.controller.js
import {
  findCartByUser, findCartItem, insertCartItem,
  increaseCartItem, updateCartItemQty, deleteCartItemById
} from '../models/cart.model.js';

// Helper function to transform cart data for response
const transformCartForResponse = (cartItems) => {
  if (!Array.isArray(cartItems)) return { items: [], totalAmount: 0, totalItems: 0 };
  
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  
  const items = cartItems.map(item => ({
    id: item.id,
    productId: item.product_id,
    quantity: item.quantity,
    product: {
      name: item.name,
      price: parseFloat(item.price),
      imageUrl: item.image_id ? `${baseUrl}/api/images/${item.image_id}` : null
    },
    subtotal: parseFloat(item.price) * item.quantity
  }));
  
  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return {
    items,
    totalAmount,
    totalItems
  };
};

export const getCart = async (req, res, next) => {
  try {
    const cartItems = await findCartByUser(req.user.id);
    const cart = transformCartForResponse(cartItems);
    res.json(cart);
  } catch (e) {
    next(e);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { product_id, quantity } = req.body;
    if (!product_id || !quantity) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    const exists = await findCartItem(req.user.id, product_id);
    if (exists) {
      await increaseCartItem(req.user.id, product_id, quantity);
    } else {
      await insertCartItem(req.user.id, product_id, quantity);
    }
    res.status(201).json({ message: 'Product added to cart' });
  } catch (e) {
    next(e);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const n = await updateCartItemQty(req.params.id, req.user.id, quantity);
    if (!n) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Cart item updated' });
  } catch (e) { next(e); }
};

export const deleteCartItem = async (req, res, next) => {
  try {
    const n = await deleteCartItemById(req.params.id, req.user.id);
    if (!n) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item removed from cart' });
  } catch (e) { next(e); }
};
