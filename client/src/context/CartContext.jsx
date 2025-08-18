import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartService } from '../services/CartService';
import { useAuth } from './AuthContext';

// Initial state
const initialState = {
  items: [],
  isLoading: false,
  error: null,
  total: 0,
  totalItems: 0,
};

// Action types
const CART_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_CART: 'SET_CART',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  CALCULATE_TOTALS: 'CALCULATE_TOTALS',
};

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case CART_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    
    case CART_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    
    case CART_ACTIONS.SET_CART:
      return {
        ...state,
        items: action.payload,
        isLoading: false,
        error: null,
      };
    
    case CART_ACTIONS.ADD_ITEM: {
      const existingItem = state.items.find(item => item.product_id === action.payload.product_id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product_id === action.payload.product_id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }
    
    case CART_ACTIONS.UPDATE_ITEM:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    
    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    
    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        total: 0,
        totalItems: 0,
      };
    
    case CART_ACTIONS.CALCULATE_TOTALS: {
      const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        ...state,
        total,
        totalItems,
      };
    }
    
    default:
      return state;
  }
};

// Create context
const CartContext = createContext();

// Cart provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  // Calculate totals whenever items change
  useEffect(() => {
    dispatch({ type: CART_ACTIONS.CALCULATE_TOTALS });
  }, [state.items]);

  // Load cart when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCart();
    } else {
      // Clear cart when user logs out
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
    }
  }, [isAuthenticated, user]);

  // Load cart from server
  const loadCart = async () => {
    dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await cartService.getCart();
      dispatch({ type: CART_ACTIONS.SET_CART, payload: response.data });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to load cart';
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: errorMessage });
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Please login to add items to cart' });
      return { success: false, error: 'Please login to add items to cart' };
    }

    dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
    
    try {
      await cartService.addToCart({ product_id: productId, quantity });
      await loadCart(); // Reload cart to get updated data
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add item to cart';
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Update cart item quantity
  const updateCartItem = async (itemId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }

    dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
    
    try {
      await cartService.updateCartItem(itemId, { quantity });
      dispatch({ type: CART_ACTIONS.UPDATE_ITEM, payload: { id: itemId, quantity } });
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update cart item';
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
    
    try {
      await cartService.removeFromCart(itemId);
      dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: itemId });
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to remove item from cart';
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Clear entire cart
  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_ERROR });
  };

  // Get item count for a specific product
  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.product_id === productId);
    return item ? item.quantity : 0;
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    return state.items.some(item => item.product_id === productId);
  };

  // Context value
  const value = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    clearError,
    loadCart,
    getItemQuantity,
    isInCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;