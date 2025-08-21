import { get, post } from './api.js'

// Create order from cart
export const createOrder = async () => {
  return await post('/orders')
}

// Get user's orders
export const getMyOrders = async () => {
  return await get('/orders')
}

// Get order details
export const getOrder = async (id) => {
  return await get(`/orders/${id}`)
}

// Get all orders (admin only)
export const getAllOrders = async () => {
  return await get('/orders/all/admin')
}

// Format order date
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  } catch {
    return 'Invalid date'
  }
}

// Format price
export const formatPrice = (price) => {
  if (price === undefined || price === null) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

// Get order status (simulated based on age)
export const getOrderStatus = (order) => {
  if (!order) return 'unknown'
  
  const now = new Date()
  const orderDate = new Date(order.created_at)
  const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24))

  if (daysDiff === 0) return 'processing'
  if (daysDiff <= 1) return 'confirmed'
  if (daysDiff <= 3) return 'shipped'
  if (daysDiff <= 7) return 'delivered'
  return 'completed'
}