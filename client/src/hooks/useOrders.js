import { useState, useEffect } from 'react'
import * as orderService from '../services/OrderService'

export const useOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch user's orders
  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await orderService.getMyOrders()
      setOrders(result)
      return { success: true, data: result }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch orders'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Create order from cart
  const createOrder = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await orderService.createOrder()
      await fetchOrders() // Refresh orders list
      return { success: true, data: result }
    } catch (err) {
      const errorMessage = err.message || 'Failed to create order'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Clear error
  const clearError = () => {
    setError(null)
  }

  // Auto-fetch orders on mount
  useEffect(() => {
    fetchOrders()
  }, [])

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    clearError
  }
}

// Hook for single order details
export const useOrder = (orderId) => {
  const [order, setOrder] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchOrder = async () => {
    if (!orderId) return

    setLoading(true)
    setError(null)
    
    try {
      const result = await orderService.getOrder(orderId)
      setOrder(result.order)
      setItems(result.items || [])
      return { success: true, data: result }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch order'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  return {
    order,
    items,
    loading,
    error,
    refetch: fetchOrder
  }
}

// Hook for admin orders management
export const useAdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all orders (admin only)
  const fetchAllOrders = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await orderService.getAllOrders()
      setOrders(result)
      return { success: true, data: result }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch orders'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Clear error
  const clearError = () => {
    setError(null)
  }

  // Auto-fetch orders on mount
  useEffect(() => {
    fetchAllOrders()
  }, [])

  return {
    orders,
    loading,
    error,
    fetchAllOrders,
    clearError
  }
}