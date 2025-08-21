import { get, post, put, del } from './api.js'

// Get current cart
export const getCart = async () => {
  return await get('/cart')
}

// Add item to cart
export const addToCart = async (productId, quantity = 1) => {
  return await post('/cart', { product_id: productId, quantity })
}

// Update cart item quantity
export const updateCartItem = async (itemId, quantity) => {
  return await put(`/cart/${itemId}`, { quantity })
}

// Remove item from cart
export const removeCartItem = async (itemId) => {
  return await del(`/cart/${itemId}`)
}

// Calculate cart totals
export const calculateCartTotals = (cartData) => {
  const items = cartData.items || []
  
  const totalItems = items.reduce((total, item) => total + (item.quantity || 0), 0)
  const totalPrice = items.reduce((total, item) => {
    const price = item.productPrice || 0
    const quantity = item.quantity || 0
    return total + (price * quantity)
  }, 0)

  return {
    items,
    totalItems,
    totalPrice,
    formattedTotal: formatPrice(totalPrice)
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