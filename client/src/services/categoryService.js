import { get, post, put, del } from './api';

export const categoryService = {
  // Get all categories
  getCategories: async () => {
    const response = await get('/categories');
    return response;
  },

  // Get single category by ID
  getCategoryById: async (categoryId) => {
    const response = await get(`/categories/${categoryId}`);
    return response;
  },

  // Create new category (admin only)
  createCategory: async (categoryData) => {
    const response = await post('/categories', categoryData);
    return response;
  },

  // Update category (admin only)
  updateCategory: async (categoryId, categoryData) => {
    const response = await put(`/categories/${categoryId}`, categoryData);
    return response;
  },

  // Delete category (admin only)
  deleteCategory: async (categoryId) => {
    const response = await del(`/categories/${categoryId}`);
    return response;
  },

  // Get categories with product count
  getCategoriesWithCount: async () => {
    // This would require a backend endpoint that returns categories with product counts
    // For now, we'll just return the categories
    const response = await categoryService.getCategories();
    return response;
  }
};