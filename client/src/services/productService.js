import { get, post, put, del, createFormData } from './api';

export const productService = {
  // Get all products with optional filters
  getProducts: async (filters = {}) => {
    const params = new URLSearchParams();
    
    // Add filters to query parameters
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    
    const queryString = params.toString();
    const url = queryString ? `/products?${queryString}` : '/products';
    
    const response = await get(url);
    return response;
  },

  // Get single product by ID
  getProductById: async (productId) => {
    const response = await get(`/products/${productId}`);
    return response;
  },

  // Create new product (admin only)
  createProduct: async (productData) => {
    const formData = createFormData(productData);
    const response = await post('/products', formData, true); // true = isFormData
    return response;
  },

  // Update product (admin only)
  updateProduct: async (productId, productData) => {
    const formData = createFormData(productData);
    const response = await put(`/products/${productId}`, formData, true); // true = isFormData
    return response;
  },

  // Delete product (admin only)
  deleteProduct: async (productId) => {
    const response = await del(`/products/${productId}`);
    return response;
  },

  // Search products
  searchProducts: async (query) => {
    const response = await get(`/products?search=${encodeURIComponent(query)}`);
    return response;
  },

  // Get products by category
  getProductsByCategory: async (categoryId) => {
    const response = await get(`/products?category=${categoryId}`);
    return response;
  },

  // Get featured products (you might want to add this to backend)
  getFeaturedProducts: async () => {
    // For now, just get all products and take first 8
    const response = await get('/products?limit=8');
    return response;
  },

  // Get related products (products in same category)
  getRelatedProducts: async (productId, categoryId) => {
    const response = await get(`/products?category=${categoryId}&exclude=${productId}&limit=4`);
    return response;
  },

  // Check product availability
  checkAvailability: async (productId, quantity = 1) => {
    const response = await productService.getProductById(productId);
    const product = response.data;
    
    return {
      available: product.stock >= quantity,
      stock: product.stock,
      requested: quantity
    };
  },

  // Get product image URL
  getImageUrl: (imageName) => {
    if (!imageName) return '/placeholder-image.jpg';
    const baseUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
    return `${baseUrl}/uploads/${imageName}`;
  }
};