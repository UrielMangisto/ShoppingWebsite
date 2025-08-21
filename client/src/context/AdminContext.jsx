import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useAuth } from './AuthContext'

// Types d'actions pour le reducer
const ADMIN_ACTIONS = {
  // Users
  LOAD_USERS_START: 'LOAD_USERS_START',
  LOAD_USERS_SUCCESS: 'LOAD_USERS_SUCCESS',
  LOAD_USERS_ERROR: 'LOAD_USERS_ERROR',
  
  // Orders
  LOAD_ORDERS_START: 'LOAD_ORDERS_START',
  LOAD_ORDERS_SUCCESS: 'LOAD_ORDERS_SUCCESS',
  LOAD_ORDERS_ERROR: 'LOAD_ORDERS_ERROR',
  
  // Products
  LOAD_PRODUCTS_START: 'LOAD_PRODUCTS_START',
  LOAD_PRODUCTS_SUCCESS: 'LOAD_PRODUCTS_SUCCESS',
  LOAD_PRODUCTS_ERROR: 'LOAD_PRODUCTS_ERROR',
  
  // Categories
  LOAD_CATEGORIES_START: 'LOAD_CATEGORIES_START',
  LOAD_CATEGORIES_SUCCESS: 'LOAD_CATEGORIES_SUCCESS',
  LOAD_CATEGORIES_ERROR: 'LOAD_CATEGORIES_ERROR',
  
  // Actions CRUD
  CREATE_SUCCESS: 'CREATE_SUCCESS',
  UPDATE_SUCCESS: 'UPDATE_SUCCESS',
  DELETE_SUCCESS: 'DELETE_SUCCESS',
  ACTION_ERROR: 'ACTION_ERROR',
  
  // Stats Dashboard
  LOAD_STATS_START: 'LOAD_STATS_START',
  LOAD_STATS_SUCCESS: 'LOAD_STATS_SUCCESS',
  LOAD_STATS_ERROR: 'LOAD_STATS_ERROR',
  
  CLEAR_ERROR: 'CLEAR_ERROR'
}

// État initial
const initialState = {
  // Data
  users: [],
  orders: [],
  products: [],
  categories: [],
  stats: {
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  },
  
  // Loading states
  loadingUsers: false,
  loadingOrders: false,
  loadingProducts: false,
  loadingCategories: false,
  loadingStats: false,
  
  // Errors
  error: null,
  
  // UI state
  selectedSection: 'dashboard' // dashboard, users, orders, products, categories
}

// Reducer pour gérer les états admin
function adminReducer(state, action) {
  switch (action.type) {
    // Users
    case ADMIN_ACTIONS.LOAD_USERS_START:
      return { ...state, loadingUsers: true, error: null }
    case ADMIN_ACTIONS.LOAD_USERS_SUCCESS:
      return { ...state, users: action.payload, loadingUsers: false }
    case ADMIN_ACTIONS.LOAD_USERS_ERROR:
      return { ...state, loadingUsers: false, error: action.payload }

    // Orders
    case ADMIN_ACTIONS.LOAD_ORDERS_START:
      return { ...state, loadingOrders: true, error: null }
    case ADMIN_ACTIONS.LOAD_ORDERS_SUCCESS:
      return { ...state, orders: action.payload, loadingOrders: false }
    case ADMIN_ACTIONS.LOAD_ORDERS_ERROR:
      return { ...state, loadingOrders: false, error: action.payload }

    // Products
    case ADMIN_ACTIONS.LOAD_PRODUCTS_START:
      return { ...state, loadingProducts: true, error: null }
    case ADMIN_ACTIONS.LOAD_PRODUCTS_SUCCESS:
      return { ...state, products: action.payload, loadingProducts: false }
    case ADMIN_ACTIONS.LOAD_PRODUCTS_ERROR:
      return { ...state, loadingProducts: false, error: action.payload }

    // Categories
    case ADMIN_ACTIONS.LOAD_CATEGORIES_START:
      return { ...state, loadingCategories: true, error: null }
    case ADMIN_ACTIONS.LOAD_CATEGORIES_SUCCESS:
      return { ...state, categories: action.payload, loadingCategories: false }
    case ADMIN_ACTIONS.LOAD_CATEGORIES_ERROR:
      return { ...state, loadingCategories: false, error: action.payload }

    // Stats
    case ADMIN_ACTIONS.LOAD_STATS_START:
      return { ...state, loadingStats: true, error: null }
    case ADMIN_ACTIONS.LOAD_STATS_SUCCESS:
      return { ...state, stats: action.payload, loadingStats: false }
    case ADMIN_ACTIONS.LOAD_STATS_ERROR:
      return { ...state, loadingStats: false, error: action.payload }

    // CRUD Actions
    case ADMIN_ACTIONS.CREATE_SUCCESS:
    case ADMIN_ACTIONS.UPDATE_SUCCESS:
    case ADMIN_ACTIONS.DELETE_SUCCESS:
      return { ...state, error: null }
    
    case ADMIN_ACTIONS.ACTION_ERROR:
      return { ...state, error: action.payload }

    case ADMIN_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null }

    default:
      return state
  }
}

// Création du Context
const AdminContext = createContext()

// Provider component
export function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(adminReducer, initialState)
  const { isAdmin, token } = useAuth()

  // Helper function pour les appels API
  const apiCall = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur API')
    }

    return response.json()
  }

  // USERS MANAGEMENT
  const loadUsers = async () => {
    if (!isAdmin()) return

    dispatch({ type: ADMIN_ACTIONS.LOAD_USERS_START })
    try {
      const data = await apiCall('/api/users')
      dispatch({ type: ADMIN_ACTIONS.LOAD_USERS_SUCCESS, payload: data })
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.LOAD_USERS_ERROR, payload: error.message })
    }
  }

  const updateUser = async (userId, userData) => {
    if (!isAdmin()) return

    try {
      await apiCall(`/api/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
      })
      dispatch({ type: ADMIN_ACTIONS.UPDATE_SUCCESS })
      await loadUsers() // Recharger la liste
      return { success: true }
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.ACTION_ERROR, payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const deleteUser = async (userId) => {
    if (!isAdmin()) return

    try {
      await apiCall(`/api/users/${userId}`, { method: 'DELETE' })
      dispatch({ type: ADMIN_ACTIONS.DELETE_SUCCESS })
      await loadUsers() // Recharger la liste
      return { success: true }
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.ACTION_ERROR, payload: error.message })
      return { success: false, error: error.message }
    }
  }

  // ORDERS MANAGEMENT
  const loadOrders = async () => {
    if (!isAdmin()) return

    dispatch({ type: ADMIN_ACTIONS.LOAD_ORDERS_START })
    try {
      const data = await apiCall('/api/orders/all/admin')
      dispatch({ type: ADMIN_ACTIONS.LOAD_ORDERS_SUCCESS, payload: data })
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.LOAD_ORDERS_ERROR, payload: error.message })
    }
  }

  // PRODUCTS MANAGEMENT
  const loadProducts = async () => {
    if (!isAdmin()) return

    dispatch({ type: ADMIN_ACTIONS.LOAD_PRODUCTS_START })
    try {
      const data = await apiCall('/api/products')
      dispatch({ type: ADMIN_ACTIONS.LOAD_PRODUCTS_SUCCESS, payload: data })
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.LOAD_PRODUCTS_ERROR, payload: error.message })
    }
  }

  const createProduct = async (productData) => {
    if (!isAdmin()) return

    try {
      await apiCall('/api/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      })
      dispatch({ type: ADMIN_ACTIONS.CREATE_SUCCESS })
      await loadProducts() // Recharger la liste
      return { success: true }
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.ACTION_ERROR, payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const updateProduct = async (productId, productData) => {
    if (!isAdmin()) return

    try {
      await apiCall(`/api/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
      })
      dispatch({ type: ADMIN_ACTIONS.UPDATE_SUCCESS })
      await loadProducts() // Recharger la liste
      return { success: true }
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.ACTION_ERROR, payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const deleteProduct = async (productId) => {
    if (!isAdmin()) return

    try {
      await apiCall(`/api/products/${productId}`, { method: 'DELETE' })
      dispatch({ type: ADMIN_ACTIONS.DELETE_SUCCESS })
      await loadProducts() // Recharger la liste
      return { success: true }
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.ACTION_ERROR, payload: error.message })
      return { success: false, error: error.message }
    }
  }

  // CATEGORIES MANAGEMENT
  const loadCategories = async () => {
    dispatch({ type: ADMIN_ACTIONS.LOAD_CATEGORIES_START })
    try {
      const data = await apiCall('/api/categories')
      dispatch({ type: ADMIN_ACTIONS.LOAD_CATEGORIES_SUCCESS, payload: data })
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.LOAD_CATEGORIES_ERROR, payload: error.message })
    }
  }

  const createCategory = async (categoryData) => {
    if (!isAdmin()) return

    try {
      await apiCall('/api/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData)
      })
      dispatch({ type: ADMIN_ACTIONS.CREATE_SUCCESS })
      await loadCategories() // Recharger la liste
      return { success: true }
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.ACTION_ERROR, payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const updateCategory = async (categoryId, categoryData) => {
    if (!isAdmin()) return

    try {
      await apiCall(`/api/categories/${categoryId}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData)
      })
      dispatch({ type: ADMIN_ACTIONS.UPDATE_SUCCESS })
      await loadCategories() // Recharger la liste
      return { success: true }
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.ACTION_ERROR, payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const deleteCategory = async (categoryId) => {
    if (!isAdmin()) return

    try {
      await apiCall(`/api/categories/${categoryId}`, { method: 'DELETE' })
      dispatch({ type: ADMIN_ACTIONS.DELETE_SUCCESS })
      await loadCategories() // Recharger la liste
      return { success: true }
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.ACTION_ERROR, payload: error.message })
      return { success: false, error: error.message }
    }
  }

  // DASHBOARD STATS
  const loadStats = async () => {
    if (!isAdmin()) return

    dispatch({ type: ADMIN_ACTIONS.LOAD_STATS_START })
    try {
      // Charger les stats en parallèle
      const [users, orders, products] = await Promise.all([
        apiCall('/api/users'),
        apiCall('/api/orders/all/admin'),
        apiCall('/api/products')
      ])

      const stats = {
        totalUsers: users.length,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalRevenue: orders.reduce((sum, order) => sum + (order.total_price || 0), 0)
      }

      dispatch({ type: ADMIN_ACTIONS.LOAD_STATS_SUCCESS, payload: stats })
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.LOAD_STATS_ERROR, payload: error.message })
    }
  }

  // Clear error
  const clearError = () => {
    dispatch({ type: ADMIN_ACTIONS.CLEAR_ERROR })
  }

  // Valeurs du context
  const value = {
    ...state,
    // Users
    loadUsers,
    updateUser,
    deleteUser,
    // Orders
    loadOrders,
    // Products
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    // Categories
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    // Stats
    loadStats,
    // Utils
    clearError
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

// Hook personnalisé pour utiliser le context
export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

export default AdminContext