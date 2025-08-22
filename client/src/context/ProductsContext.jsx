// src/context/ProductsContext.jsx
import React, { createContext, useContext, useReducer } from 'react';
import { productsService } from '../services/productsService';

const ProductsContext = createContext();

// Products state reducer
const productsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_PRODUCTS':
      return { 
        ...state, 
        products: action.payload,
        loading: false 
      };
    case 'SET_SINGLE_PRODUCT':
      return { 
        ...state, 
        currentProduct: action.payload,
        loading: false 
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload };
    case 'CLEAR_FILTERS':
      return { 
        ...state, 
        filters: {
          categories: [],
          minPrice: null,
          maxPrice: null,
          minRating: null,
          inStock: null
        }
      };
    default:
      return state;
  }
};

const initialState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  filters: {
    categories: [],
    minPrice: null,
    maxPrice: null,
    minRating: null,
    inStock: null
  },
  sortBy: 'name_asc'
};

export const ProductsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productsReducer, initialState);

  const fetchProducts = async (customFilters = null) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const filters = customFilters || state.filters;
      const params = {};
      
      // Add sorting
      if (state.sortBy) {
        params.sortBy = state.sortBy;
      }
      
      // Add filters
      if (filters.categories && filters.categories.length > 0) {
        params.category = filters.categories[0];
      }
      
      if (filters.minPrice !== null && filters.minPrice !== undefined) {
        params.minPrice = filters.minPrice;
      }
      
      if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
        params.maxPrice = filters.maxPrice;
      }
      
      if (filters.minRating !== null && filters.minRating !== undefined) {
        params.minRating = filters.minRating;
      }
      
      if (filters.inStock !== null && filters.inStock !== undefined) {
        params.inStock = filters.inStock;
      }
      
      const products = await productsService.getAllProducts(params);
      dispatch({ type: 'SET_PRODUCTS', payload: products });
      
      return products;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const fetchProduct = async (productId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const product = await productsService.getProduct(productId);
      dispatch({ type: 'SET_SINGLE_PRODUCT', payload: product });
      
      return product;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const searchProducts = async (searchTerm, customFilters = null) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const filters = customFilters || state.filters;
      const params = {};
      
      // Add search term
      if (searchTerm && searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      
      // Add sorting
      if (state.sortBy) {
        params.sortBy = state.sortBy;
      }
      
      // Add filters
      if (filters.categories && filters.categories.length > 0) {
        params.category = filters.categories[0];
      }
      
      if (filters.minPrice !== null && filters.minPrice !== undefined) {
        params.minPrice = filters.minPrice;
      }
      
      if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
        params.maxPrice = filters.maxPrice;
      }
      
      if (filters.minRating !== null && filters.minRating !== undefined) {
        params.minRating = filters.minRating;
      }
      
      if (filters.inStock !== null && filters.inStock !== undefined) {
        params.inStock = filters.inStock;
      }
      
      const products = await productsService.getAllProducts(params);
      dispatch({ type: 'SET_PRODUCTS', payload: products });
      
      return products;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const setFilters = (newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  };

  const setSortBy = (sortBy) => {
    dispatch({ type: 'SET_SORT', payload: sortBy });
  };

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    fetchProducts,
    fetchProduct,
    searchProducts,
    setFilters,
    setSortBy,
    clearFilters,
    clearError
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};