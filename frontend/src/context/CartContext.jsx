import { createContext, useState, useCallback } from 'react';
import cartService from '../services/cartService';

export const CartContext = createContext({
  cart: null,
  setCart: () => {},
  loading: false,
  error: null,
  updateCart: async () => {},
});

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (err) {
      setError(err.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    cart,
    setCart,
    loading,
    error,
    updateCart,
    totalItems: cart?.totalItems || 0,
    totalAmount: cart?.totalAmount || 0,
    items: cart?.items || [],
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
