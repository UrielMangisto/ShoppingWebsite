import { get, post, put } from './api';

export const orderService = {
  // Create new order
  createOrder: async (orderData = {}) => {
    // Since your backend creates order from cart items,
    // we might not need to send order data
    const response = await post('/orders', orderData);
    return response;
  },

  // Get user's orders
  getMyOrders: async () => {
    const response = await get('/orders');
    return response;
  },

  // Get single order by ID
  getOrderById: async (orderId) => {
    const response = await get(`/orders/${orderId}`);
    return response;
  },

  // Get all orders (admin only)
  getAllOrders: async () => {
    const response = await get('/orders/all/admin');
    return response;
  },

  // Update order status (admin only) - if you add this feature
  updateOrderStatus: async (orderId, status) => {
    const response = await put(`/orders/${orderId}/status`, { status });
    return response;
  },

  // Cancel order (if you add this feature)
  cancelOrder: async (orderId) => {
    const response = await put(`/orders/${orderId}/cancel`);
    return response;
  },

  // Get order statistics (admin only) - if you add this feature
  getOrderStats: async () => {
    const response = await get('/orders/stats');
    return response;
  },

  // Get order by status (admin only)
  getOrdersByStatus: async (status) => {
    const response = await get(`/orders?status=${status}`);
    return response;
  },

  // Calculate order total
  calculateOrderTotal: (orderItems) => {
    if (!orderItems || !Array.isArray(orderItems)) return 0;
    
    return orderItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  },

  // Format order date
  formatOrderDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Get order status color for UI
  getOrderStatusColor: (status) => {
    const statusColors = {
      'pending': 'orange',
      'processing': 'blue',
      'shipped': 'purple',
      'delivered': 'green',
      'cancelled': 'red',
      'refunded': 'gray'
    };
    
    return statusColors[status?.toLowerCase()] || 'gray';
  }
};