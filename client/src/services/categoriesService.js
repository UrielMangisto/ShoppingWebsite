import { get, post, put, del } from './api.js'

// Get all categories
export const getCategories = async () => {
  return await get('/categories')
}

// Get single category
export const getCategory = async (id) => {
  return await get(`/categories/${id}`)
}

// Create category (admin only)
export const createCategory = async (name) => {
  return await post('/categories', { name })
}

// Update category (admin only)
export const updateCategory = async (id, name) => {
  return await put(`/categories/${id}`, { name })
}

// Delete category (admin only)
export const deleteCategory = async (id) => {
  return await del(`/categories/${id}`)
}

// Format category name
export const formatCategoryName = (name) => {
  if (!name || typeof name !== 'string') return 'Unknown Category'
  
  return name
    .trim()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Generate URL slug
export const generateSlug = (name) => {
  if (!name || typeof name !== 'string') return 'unknown-category'
  
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}