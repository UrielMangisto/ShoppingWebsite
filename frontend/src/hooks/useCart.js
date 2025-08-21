import { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import cartService from '../services/cartService';

export const useCart = () => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const cartData = await cartService.getCart();
      setCart(cartData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addToCart = useCallback(async (product_id, quantity) => {
    try {
      setError(null);
      await cartService.addToCart(product_id, quantity);
      await fetchCart(); // Refresh cart after adding item
    } catch (err) {
      setError(err.message || 'Failed to add item to cart');
      throw err;
    }
  }, [fetchCart]);

  const updateCartItem = useCallback(async (id, quantity) => {
    try {
      setError(null);
      await cartService.updateCartItem(id, quantity);
      await fetchCart(); // Refresh cart after update
    } catch (err) {
      setError(err.message || 'Failed to update cart item');
      throw err;
    }
  }, [fetchCart]);

  const removeFromCart = useCallback(async (id) => {
    try {
      setError(null);
      await cartService.deleteCartItem(id);
      await fetchCart(); // Refresh cart after removal
    } catch (err) {
      setError(err.message || 'Failed to remove item from cart');
      throw err;
    }
  }, [fetchCart]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cart,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    refreshCart: fetchCart,
    totalItems: cart?.totalItems || 0,
    totalAmount: cart?.totalAmount || 0,
    items: cart?.items || []
  };
};

export default useCart;
