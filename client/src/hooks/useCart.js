import { useState } from 'react'
import { useCart as useCartContext } from '../context/CartContext'

export const useCart = () => {
  const cartContext = useCartContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await cartContext.addToCart(productId, quantity)
      if (result.success) {
        return { success: true }
      } else {
        setError(result.error)
        return { success: false, error: result.error }
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to add item to cart'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Update cart item quantity
  const updateCartItem = async (itemId, quantity) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await cartContext.updateCartItem(itemId, quantity)
      if (result.success) {
        return { success: true }
      } else {
        setError(result.error)
        return { success: false, error: result.error }
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to update cart item'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await cartContext.removeFromCart(itemId)
      if (result.success) {
        return { success: true }
      } else {
        setError(result.error)
        return { success: false, error: result.error }
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to remove item from cart'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Increase item quantity by 1
  const increaseQuantity = async (itemId) => {
    const item = cartContext.items.find(item => item.id === itemId)
    if (item) {
      return await updateCartItem(itemId, item.quantity + 1)
    }
    return { success: false, error: 'Item not found' }
  }

  // Decrease item quantity by 1 (or remove if quantity becomes 0)
  const decreaseQuantity = async (itemId) => {
    const item = cartContext.items.find(item => item.id === itemId)
    if (item) {
      if (item.quantity <= 1) {
        return await removeFromCart(itemId)
      } else {
        return await updateCartItem(itemId, item.quantity - 1)
      }
    }
    return { success: false, error: 'Item not found' }
  }

  // Clear error
  const clearError = () => {
    setError(null)
    cartContext.clearError()
  }

  // Get item quantity for a specific product
  const getItemQuantity = (productId) => {
    return cartContext.getItemQuantity(productId)
  }

  // Check if product is in cart
  const isInCart = (productId) => {
    return cartContext.isInCart(productId)
  }

  return {
    // State from context
    items: cartContext.items,
    totalItems: cartContext.totalItems,
    totalPrice: cartContext.totalPrice,
    
    // Loading and error state
    loading: loading || cartContext.isLoading,
    error: error || cartContext.error,
    
    // Actions
    addToCart,
    updateCartItem,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearError,
    
    // Utilities
    getItemQuantity,
    isInCart,
    
    // Direct context access
    loadCart: cartContext.loadCart,
    clearCart: cartContext.clearCart
  }
}