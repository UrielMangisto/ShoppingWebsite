import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { formatPrice, formatDate, formatTimeAgo } from '../utils/formatters';
import Loading, { CardSkeleton } from '../components/common/Loading';
import './Orders.css';

const Orders = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [isAuthenticated, navigate]);

  const loadOrders = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await orderService.getMyOrders();
        setOrders(response.data);
        resolve(response.data);
      } catch (err) {
        console.error('Error loading orders:', err);
        const errorMessage = err.response?.data?.message || 'Failed to load orders';
        setError(errorMessage);
        reject(err);
      } finally {
        setIsLoading(false);
      }
    });
  };

  const loadOrderDetails = async (orderId) => {
    return new Promise(async (resolve, reject) => {
      try {
        setLoadingDetails(true);
        setSelectedOrder(orderId);
        
        const response = await orderService.getOrderById(orderId);
        setOrderDetails(response.data);
        resolve(response.data);
      } catch (err) {
        console.error('Error loading order details:', err);
        const errorMessage = err.response?.data?.message || 'Failed to load order details';
        setError(errorMessage);
        reject(err);
      } finally {
        setLoadingDetails(false);
      }
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'warning',
      'processing': 'info',
      'shipped': 'primary',
      'delivered': 'success',
      'cancelled': 'error'
    };
    return colors[status?.toLowerCase()] || 'secondary';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': '⏳',
      'processing': '⚙️',
      'shipped': '🚚',
      'delivered': '✅',
      'cancelled': '❌'
    };
    return icons[status?.toLowerCase()] || '📦';
  };

  const getImageUrl = (imageName) => {
    if (!imageName) return '/placeholder-image.jpg';
    return productService.getImageUrl(imageName);
  };

  const calculateOrderTotal = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setOrderDetails(null);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="orders-loading">
            <Loading size="large" text="Loading your orders..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        {/* Page Header */}
        <div className="orders-header">
          <h1>My Orders</h1>
          <p className="orders-subtitle">
            Track and manage your orders
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="error-close">✕</button>
          </div>
        )}

        {/* Orders Content */}
        {orders.length === 0 ? (
          /* No Orders */
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <h2 className="no-orders-title">No orders yet</h2>
            <p className="no-orders-description">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <div className="no-orders-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                <span className="btn-icon">🛍️</span>
                Start Shopping
              </Link>
              <Link to="/" className="btn btn-outline btn-lg">
                <span className="btn-icon">🏠</span>
                Go Home
              </Link>
            </div>
          </div>
        ) : (
          /* Orders List */
          <div className="orders-content">
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <div className="order-number">
                        Order #{order.id}
                      </div>
                      <div className="order-date">
                        {formatDate(order.created_at, 'datetime')}
                      </div>
                    </div>
                    <div className="order-status">
                      <span className={`status-badge ${getStatusColor(order.status)}`}>
                        <span className="status-icon">
                          {getStatusIcon(order.status)}
                        </span>
                        {order.status || 'Pending'}
                      </span>
                    </div>
                  </div>

                  <div className="order-summary">
                    <div className="order-meta">
                      <span className="order-total">
                        Total: {formatPrice(order.total || 0)}
                      </span>
                      <span className="order-items-count">
                        {order.item_count || 0} items
                      </span>
                    </div>
                    <div className="order-time">
                      {formatTimeAgo(order.created_at)}
                    </div>
                  </div>

                  <div className="order-actions">
                    <button
                      onClick={() => loadOrderDetails(order.id)}
                      className="btn btn-outline btn-sm"
                      disabled={selectedOrder === order.id && loadingDetails}
                    >
                      {selectedOrder === order.id && loadingDetails ? (
                        <>
                          <Loading size="small" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <span className="btn-icon">👁️</span>
                          View Details
                        </>
                      )}
                    </button>
                    
                    {(order.status === 'delivered' || order.status === 'shipped') && (
                      <button className="btn btn-primary btn-sm">
                        <span className="btn-icon">🔄</span>
                        Reorder
                      </button>
                    )}
                    
                    {order.status === 'pending' && (
                      <button className="btn btn-error btn-sm">
                        <span className="btn-icon">❌</span>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && orderDetails && (
          <div className="order-details-overlay" onClick={closeOrderDetails}>
            <div className="order-details-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Order Details</h2>
                <button onClick={closeOrderDetails} className="modal-close">
                  ✕
                </button>
              </div>

              <div className="modal-content">
                {/* Order Info */}
                <div className="order-detail-section">
                  <h3>Order Information</h3>
                  <div className="order-detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Order Number:</span>
                      <span className="detail-value">#{orderDetails.order.id}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">
                        {formatDate(orderDetails.order.created_at, 'full')}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className={`status-badge ${getStatusColor(orderDetails.order.status)}`}>
                        <span className="status-icon">
                          {getStatusIcon(orderDetails.order.status)}
                        </span>
                        {orderDetails.order.status || 'Pending'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Total:</span>
                      <span className="detail-value total-amount">
                        {formatPrice(calculateOrderTotal(orderDetails.items))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="order-detail-section">
                  <h3>Items Ordered</h3>
                  <div className="order-items-list">
                    {orderDetails.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="order-item-image"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                        <div className="order-item-info">
                          <h4 className="order-item-name">{item.name}</h4>
                          <div className="order-item-details">
                            <span>Quantity: {item.quantity}</span>
                            <span>Price: {formatPrice(item.price)}</span>
                          </div>
                        </div>
                        <div className="order-item-total">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Total Breakdown */}
                <div className="order-detail-section">
                  <h3>Order Summary</h3>
                  <div className="order-totals">
                    <div className="total-row">
                      <span>Subtotal:</span>
                      <span>{formatPrice(calculateOrderTotal(orderDetails.items))}</span>
                    </div>
                    <div className="total-row">
                      <span>Shipping:</span>
                      <span>Free</span>
                    </div>
                    <div className="total-row">
                      <span>Tax:</span>
                      <span>{formatPrice(calculateOrderTotal(orderDetails.items) * 0.08)}</span>
                    </div>
                    <div className="total-divider"></div>
                    <div className="total-row final-total">
                      <span>Total:</span>
                      <span>{formatPrice(calculateOrderTotal(orderDetails.items) * 1.08)}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                {orderDetails.order.shipping_info && (
                  <div className="order-detail-section">
                    <h3>Shipping Information</h3>
                    <div className="shipping-info">
                      <p>{orderDetails.order.shipping_info}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button onClick={closeOrderDetails} className="btn btn-outline">
                  Close
                </button>
                <button className="btn btn-primary">
                  <span className="btn-icon">📧</span>
                  Email Receipt
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;