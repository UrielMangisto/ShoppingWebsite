// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0, totalItems: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // טעינת עגלה בעת התחברות
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      // ניקוי עגלה בעת התנתקות
      setCart({ items: [], totalAmount: 0, totalItems: 0 });
    }
  }, [isAuthenticated]);

  // טעינת עגלת קניות מהשרת
  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Load cart error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // הוספת מוצר לעגלה
  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      setError(null);
      await cartService.addToCart(productId, quantity);
      await loadCart(); // רענון העגלה
      return { success: true };
    } catch (error) {
      console.error('Add to cart error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // עדכון כמות מוצר בעגלה
  const updateCartItem = async (itemId, quantity) => {
    try {
      setLoading(true);
      setError(null);
      await cartService.updateCartItem(itemId, quantity);
      await loadCart(); // רענון העגלה
      return { success: true };
    } catch (error) {
      console.error('Update cart item error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // הסרת מוצר מעגלה
  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      setError(null);
      await cartService.removeFromCart(itemId);
      await loadCart(); // רענון העגלה
      return { success: true };
    } catch (error) {
      console.error('Remove from cart error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // ניקוי עגלה (לאחר הזמנה)
  const clearCart = () => {
    setCart({ items: [], totalAmount: 0, totalItems: 0 });
  };

  // בדיקה אם מוצר קיים בעגלה
  const isInCart = (productId) => {
    return cart.items.some(item => item.productId === productId);
  };

  // קבלת כמות מוצר בעגלה
  const getItemQuantity = (productId) => {
    const item = cart.items.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    cart,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart,
    isInCart,
    getItemQuantity,
    // helper properties
    itemCount: cart.totalItems,
    totalAmount: cart.totalAmount,
    isEmpty: cart.items.length === 0
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};