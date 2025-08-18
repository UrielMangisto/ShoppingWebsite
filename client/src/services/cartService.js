import { get, post, put, del } from './api';

export const cartService = {
  // Get user's cart
  getCart: async () => {
    const response = await get('/cart');
    return response;
  },

  // Add item to cart
  addToCart: async (cartData) => {
    const response = await post('/cart', cartData);
    return response;
  },

  // Update cart item quantity
  updateCartItem: async (itemId, updateData) => {
    const response = await put(`/cart/${itemId}`, updateData);
    return response;
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    const response = await del(`/cart/${itemId}`);
    return response;
  },

  // Clear entire cart (usually called after order creation)
  clearCart: async () => {
    // Since your backend clears cart after order creation,
    // this might not be needed as a separate endpoint
    // But we can implement it for completeness
    const cart = await cartService.getCart();
    const promises = cart.data.map(item => 
      cartService.removeFromCart(item.id)
    );
    await Promise.all(promises);
  },

  // Get cart summary (totals)
  getCartSummary: async () => {
    const response = await cartService.getCart();
    const items = response.data;
    
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return {
      items,
      totalItems,
      totalPrice,
      itemCount: items.length
    };
  }
};