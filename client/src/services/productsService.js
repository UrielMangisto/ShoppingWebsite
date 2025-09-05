// src/services/productsService.js - FIXED VERSION
import api from './api.js';
import authService from './authService.js';

export const productsService = {
  getAllProducts: async (params = {}) => {
    // Build query string from parameters
    const queryParams = new URLSearchParams();
    
    // Add each parameter if it exists
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    
    // Build the endpoint URL
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    
    return api.get(endpoint);
  },

  getProduct: async (id) => {
    return api.get(`/products/${id}`);
  },

  // Admin operations
  createProduct: async (productData) => {
    const token = authService.getToken();
    const formData = new FormData();

    const { name, description, price, stock, category_id, image } = productData;

    // Add required fields
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('category_id', category_id);

    // Add image if provided
    if (image) {
      formData.append('image', image);
    }

    return api.upload('/products', formData, token);
  },

  updateProduct: async (id, productData) => {    
    const token = authService.getToken();
    
    const formData = new FormData();

    const { name, description, price, stock, category_id, image } = productData;

    // Add fields that are present - exactly like the backend expects
    if (name !== undefined && name !== null) {
      formData.append('name', name);
    }
    if (description !== undefined && description !== null) {
      formData.append('description', description);
    }
    if (price !== undefined && price !== null) {
      formData.append('price', price);
    }
    if (stock !== undefined && stock !== null) {
      formData.append('stock', stock);
    }
    if (category_id !== undefined && category_id !== null) {
      formData.append('category_id', category_id);
    }
    
    // Only add image if it's a File object (new image selected)
    if (image && image instanceof File) {
      formData.append('image', image);
    }
    
    try {
      const result = await api.uploadPut(`/products/${id}`, formData, token);
      return result;
    } catch (error) {
      throw error;
    }
  },

  deleteProduct: async (id) => {
    const token = authService.getToken();
    return api.delete(`/products/${id}`, token);
  },
};

export default productsService;