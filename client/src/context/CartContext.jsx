import { createContext, useContext, useState } from 'react';
import { addToCart, removeFromCart, updateCartItem, getCart } from '../services/cartService';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    setLoading(true);
    try {
      const cartData = await getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const updatedCart = await addToCart(productId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    setLoading(true);
    try {
      const updatedCart = await removeFromCart(productId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error removing item from cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (productId, quantity) => {
    setLoading(true);
    try {
      const updatedCart = await updateCartItem(productId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating cart item:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addItem, removeItem, updateItem, loadCart }}>
      {children}
    </CartContext.Provider>
  );
}
