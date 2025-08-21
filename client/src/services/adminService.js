import { get, post, put, del } from './api.js'
import { isAdmin } from './authService.js'

// Check admin access
const requireAdmin = () => {
  if (!isAdmin()) {
    throw new Error('Admin access required')
  }
}

// === USER MANAGEMENT ===
export const getAllUsers = async () => {
  requireAdmin()
  return await get('/users')
}

export const updateUser = async (id, userData) => {
  requireAdmin()
  return await put(`/users/${id}`, userData)
}

export const deleteUser = async (id) => {
  requireAdmin()
  return await del(`/users/${id}`)
}

// === ORDER MANAGEMENT ===
export const getAllOrders = async () => {
  requireAdmin()
  return await get('/orders/all/admin')
}

// === PRODUCT MANAGEMENT ===
export const getAllProducts = async () => {
  requireAdmin()
  return await get('/products')
}

export const createProduct = async (productData) => {
  requireAdmin()
  return await post('/products', productData)
}

export const updateProduct = async (id, productData) => {
  requireAdmin()
  return await put(`/products/${id}`, productData)
}

export const deleteProduct = async (id) => {
  requireAdmin()
  return await del(`/products/${id}`)
}

// === CATEGORY MANAGEMENT ===
export const getAllCategories = async () => {
  return await get('/categories')
}

export const createCategory = async (name) => {
  requireAdmin()
  return await post('/categories', { name })
}

export const updateCategory = async (id, name) => {
  requireAdmin()
  return await put(`/categories/${id}`, { name })
}

export const deleteCategory = async (id) => {
  requireAdmin()
  return await del(`/categories/${id}`)
}

// === DASHBOARD STATS ===
export const getDashboardStats = async () => {
  requireAdmin()
  
  const [users, orders, products, categories] = await Promise.all([
    getAllUsers(),
    getAllOrders(), 
    getAllProducts(),
    getAllCategories()
  ])

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_price || 0), 0)
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0

  return {
    totalUsers: users.length,
    totalOrders: orders.length,
    totalProducts: products.length,
    totalCategories: categories.length,
    totalRevenue,
    averageOrderValue
  }
}

// === UTILITY FUNCTIONS ===
export const formatPrice = (price) => {
  if (price === undefined || price === null) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateString))
  } catch {
    return 'Invalid date'
  }
}