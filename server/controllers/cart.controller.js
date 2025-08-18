// server/controllers/cart.controller.js
import {
  findCartByUser, findCartItem, insertCartItem,
  increaseCartItem, updateCartItemQty, deleteCartItemById
} from '../models/cart.model.js';
import CartDTO from '../dtos/cart.dto.js';

export const getCart = async (req, res, next) => {
  try {
    const cartItems = await findCartByUser(req.user.id);
    const cart = new CartDTO(cartItems);
    res.json(cart);
  } catch (e) {
    next(e);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { product_id, quantity } = req.body;
    if (!product_id || !quantity) return res.status(400).json({ message: 'Missing fields' });
    const exists = await findCartItem(req.user.id, product_id);
    if (exists) await increaseCartItem(req.user.id, product_id, quantity);
    else await insertCartItem(req.user.id, product_id, quantity);
    res.status(201).json({ message: 'Product added to cart' });
  } catch (e) { next(e); }
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
