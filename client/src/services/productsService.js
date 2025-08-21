import api from './api';
import authService from './authService';

export const productsService = {
  getAllProducts: async () => {
    return api.get('/products');
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

    return api.post('/products', formData, token);
  },

  updateProduct: async (id, productData) => {
    const token = authService.getToken();
    const formData = new FormData();

    const { name, description, price, stock, category_id, image } = productData;

    // Add fields that are present
    if (name) formData.append('name', name);
    if (description) formData.append('description', description);
    if (price) formData.append('price', price);
    if (stock) formData.append('stock', stock);
    if (category_id) formData.append('category_id', category_id);
    if (image) formData.append('image', image);

    return api.put(`/products/${id}`, formData, token);
  },

  deleteProduct: async (id) => {
    const token = authService.getToken();
    return api.delete(`/products/${id}`, token);
  },
};

export default productsService;
