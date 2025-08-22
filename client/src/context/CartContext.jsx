// src/context/CartContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

// Cart state reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CART':
      return { 
        ...state, 
        items: action.payload.items || [],
        totalAmount: action.payload.totalAmount || 0,
        totalItems: action.payload.totalItems || 0,
        loading: false 
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'CLEAR_CART':
      return { 
        items: [], 
        totalAmount: 0, 
        totalItems: 0, 
        loading: false, 
        error: null 
      };
    default:
      return state;
  }
};

const initialState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
  loading: false,
  error: null
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const cartData = await cartService.getCart();
      
      // Transform cart data to match our component expectations
      const transformedData = {
        items: cartData.items?.map(item => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          product: {
            name: item.product.name,
            price: item.product.price,
            imageUrl: item.product.imageUrl
          },
          subtotal: item.subtotal
        })) || [],
        totalAmount: cartData.totalAmount || 0,
        totalItems: cartData.totalItems || 0
      };
      
      dispatch({ type: 'SET_CART', payload: transformedData });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      dispatch({ type: 'CLEAR_ERROR' });
      
      await cartService.addToCart(productId, quantity);
      await fetchCart(); // Refresh cart after adding
      
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      dispatch({ type: 'CLEAR_ERROR' });
      
      await cartService.updateCartItem(itemId, quantity);
      await fetchCart(); // Refresh cart after updating
      
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      dispatch({ type: 'CLEAR_ERROR' });
      
      await cartService.deleteCartItem(itemId);
      await fetchCart(); // Refresh cart after removing
      
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    clearError,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};