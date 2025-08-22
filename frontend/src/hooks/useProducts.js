// src/hooks/useProducts.js
import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';

export const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  // טעינת מוצרים
  const loadProducts = useCallback(async (customFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const finalFilters = { ...filters, ...customFilters };
      const data = await productService.getAllProducts(finalFilters);
      setProducts(data);
    } catch (error) {
      console.error('Load products error:', error);
      setError(error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // עדכון פילטרים
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // איפוס פילטרים
  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  // טעינה ראשונית
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    filters,
    loadProducts,
    updateFilters,
    resetFilters,
    refetch: loadProducts
  };
};

export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // טעינת מוצר בודד
  const loadProduct = useCallback(async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProductById(productId);
      setProduct(data);
    } catch (error) {
      console.error('Load product error:', error);
      setError(error.message);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  // טעינת ביקורות
  const loadReviews = useCallback(async () => {
    if (!productId) return;
    
    try {
      setReviewsLoading(true);
      const data = await productService.getProductReviews(productId);
      setReviews(data);
    } catch (error) {
      console.error('Load reviews error:', error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }, [productId]);

  // הוספת ביקורת
  const addReview = async (reviewData) => {
    try {
      await productService.addProductReview(productId, reviewData);
      await loadReviews(); // רענון ביקורות
      return { success: true };
    } catch (error) {
      console.error('Add review error:', error);
      return { success: false, error: error.message };
    }
  };

  // עדכון ביקורת
  const updateReview = async (reviewId, reviewData) => {
    try {
      await productService.updateProductReview(productId, reviewId, reviewData);
      await loadReviews(); // רענון ביקורות
      return { success: true };
    } catch (error) {
      console.error('Update review error:', error);
      return { success: false, error: error.message };
    }
  };

  // מחיקת ביקורת
  const deleteReview = async (reviewId) => {
    try {
      await productService.deleteProductReview(productId, reviewId);
      await loadReviews(); // רענון ביקורות
      return { success: true };
    } catch (error) {
      console.error('Delete review error:', error);
      return { success: false, error: error.message };
    }
  };

  // טעינה ראשונית
  useEffect(() => {
    loadProduct();
    loadReviews();
  }, [loadProduct, loadReviews]);

  return {
    product,
    loading,
    error,
    reviews,
    reviewsLoading,
    loadProduct,
    loadReviews,
    addReview,
    updateReview,
    deleteReview,
    refetch: loadProduct
  };
};