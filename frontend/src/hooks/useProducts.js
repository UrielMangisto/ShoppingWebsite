import { useState, useCallback } from 'react';
import productsService from '../services/productsService';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getProducts = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsService.getAllProducts(filters);
      setProducts(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProduct = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsService.getProduct(id);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchProducts = useCallback(async (query, categoryId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsService.search(query, categoryId);
      setProducts(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to search products');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (productData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsService.createProduct(productData);
      await getProducts(); // Refresh products list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getProducts]);

  const updateProduct = useCallback(async (id, productData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsService.updateProduct(id, productData);
      await getProducts(); // Refresh products list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getProducts]);

  const deleteProduct = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await productsService.deleteProduct(id);
      await getProducts(); // Refresh products list
    } catch (err) {
      setError(err.message || 'Failed to delete product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getProducts]);

  return {
    products,
    loading,
    error,
    getProducts,
    getProduct,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

export default useProducts;
