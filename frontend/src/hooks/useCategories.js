import { useState, useCallback } from 'react';
import categoriesService from '../services/categoriesService';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriesService.getCategories();
      setCategories(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCategory = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriesService.getCategory(id);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch category');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (name) => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoriesService.createCategory(name);
      await getCategories(); // Refresh categories list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create category');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCategories]);

  const updateCategory = useCallback(async (id, name) => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoriesService.updateCategory(id, name);
      await getCategories(); // Refresh categories list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update category');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCategories]);

  const deleteCategory = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await categoriesService.deleteCategory(id);
      await getCategories(); // Refresh categories list
    } catch (err) {
      setError(err.message || 'Failed to delete category');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCategories]);

  return {
    categories,
    loading,
    error,
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

export default useCategories;
