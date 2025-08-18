import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/OrderService';
import Loading from '../common/Loading';
import './OrderDetails.css';

const OrderDetails = ({ orderId, onClose, className = '' }) => {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await orderService.getOrderById(orderId);
      setOrder(response.data);
    } catch (err) {
      console.error('Error loading order:', err);
      setError(err.response?.data?.message || 'Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    return orderService.formatOrderDate(dateString);
  };

  // Get status color
  const getStatusColor = (status) => {
    return orderService.getOrderStatusColor(status);
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      pending: 'ó',
      processing: '=æ',
      shipped: '=š',
      delivered: '',
      cancelled: 'L',
      refunded: '=°'
    };
    return icons[status?.toLowerCase()] || '=Ë';
  };

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
  };

  if (isLoading) {
    return <Loading size="large" text="Loading order details..." />;
  }

  if (error) {
    return (
      <div className="order-details-error">
        <div className="error-content">
          <h3>Error Loading Order</h3>
          <p>{error}</p>
          <button onClick={loadOrder} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-error">
        <div className="error-content">
          <h3>Order Not Found</h3>
          <p>The requested order could not be found.</p>
        </div>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <div className={`order-details ${className}`}>
      {onClose && (
        <div className="order-details-header">
          <button onClick={onClose} className="close-btn" aria-label="Close">
            
          </button>
        </div>
      )}

      <div className="order-details-content">
        {/* Order Header */}
        <div className="order-header">
          <div className="order-title-section">
            <h2 className="order-title">Order Details</h2>
            <div className="order-meta">
              <span className="order-number">Order #{order.id}</span>
              <span className="order-date">Placed on {formatDate(order.created_at)}</span>
            </div>
          </div>
          
          <div className="order-status-section">
            <div 
              className="status-badge large"
              style={{ 
                color: getStatusColor(order.status),
                backgroundColor: `${getStatusColor(order.status)}20`
              }}
            >
              <span className="status-icon">
                {getStatusIcon(order.status)}
              </span>
              <span className="status-text">
                {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Order Progress */}
        <div className="order-progress">
          <div className="progress-steps">
            <div className={`step ${['pending', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
              <div className="step-circle">=Ë</div>
              <div className="step-label">Order Placed</div>
            </div>
            <div className={`step ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
              <div className="step-circle">=æ</div>
              <div className="step-label">Processing</div>
            </div>
            <div className={`step ${['shipped', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
              <div className="step-circle">=š</div>
              <div className="step-label">Shipped</div>
            </div>
            <div className={`step ${order.status === 'delivered' ? 'completed' : ''}`}>
              <div className="step-circle"></div>
              <div className="step-label">Delivered</div>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        {order.status === 'shipped' && order.tracking_number && (
          <div className="shipping-info">
            <h3>Shipping Information</h3>
            <div className="shipping-details">
              <div className="shipping-item">
                <span className="label">Tracking Number:</span>
                <span className="value tracking-number">{order.tracking_number}</span>
              </div>
              <div className="shipping-item">
                <span className="label">Carrier:</span>
                <span className="value">{order.carrier || 'Standard Shipping'}</span>
              </div>
              <div className="shipping-item">
                <span className="label">Estimated Delivery:</span>
                <span className="value">
                  {order.estimated_delivery || 'Within 3-5 business days'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="order-items-section">
          <h3>Order Items</h3>
          <div className="order-items">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-image">
                    <div className="placeholder-image">=æ</div>
                  </div>
                  
                  <div className="item-details">
                    <h4 className="item-name">
                      <Link to={`/products/${item.product_id}`}>
                        {item.product_name}
                      </Link>
                    </h4>
                    <div className="item-meta">
                      <span className="item-price">
                        {formatPrice(item.price)} each
                      </span>
                      <span className="item-quantity">
                        Quantity: {item.quantity}
                      </span>
                    </div>
                  </div>
                  
                  <div className="item-total">
                    <span className="total-price">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-items">
                <p>No items found for this order.</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-details">
            <div className="summary-line">
              <span className="label">Subtotal:</span>
              <span className="value">{formatPrice(totals.subtotal)}</span>
            </div>
            
            <div className="summary-line">
              <span className="label">Shipping:</span>
              <span className="value">
                {totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping)}
              </span>
            </div>
            
            <div className="summary-line">
              <span className="label">Tax:</span>
              <span className="value">{formatPrice(totals.tax)}</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-line total">
              <span className="label">Total:</span>
              <span className="value">{formatPrice(order.total || totals.total)}</span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        {order.user && (
          <div className="customer-info">
            <h3>Customer Information</h3>
            <div className="customer-details">
              <div className="customer-item">
                <span className="label">Name:</span>
                <span className="value">{order.user.name}</span>
              </div>
              <div className="customer-item">
                <span className="label">Email:</span>
                <span className="value">{order.user.email}</span>
              </div>
              {order.shipping_address && (
                <div className="customer-item">
                  <span className="label">Shipping Address:</span>
                  <span className="value">{order.shipping_address}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Order Actions */}
        <div className="order-actions">
          {order.status === 'delivered' && (
            <>
              <button className="btn btn-primary">
                P Leave a Review
              </button>
              <button className="btn btn-secondary">
                =Ä Download Invoice
              </button>
            </>
          )}
          
          {(order.status === 'pending' || order.status === 'processing') && (
            <button 
              className="btn btn-danger"
              onClick={() => {
                if (window.confirm('Are you sure you want to cancel this order?')) {
                  // Add cancel functionality here
                  console.log('Cancel order:', order.id);
                }
              }}
            >
              Cancel Order
            </button>
          )}
          
          <button className="btn btn-outline">
            =ç Contact Support
          </button>
        </div>

        {/* Additional Information */}
        <div className="additional-info">
          <div className="info-section">
            <h4>Need Help?</h4>
            <ul>
              <li>=ç Email us at support@e-store.com</li>
              <li>=Þ Call us at 1-800-ESTORE</li>
              <li>=¬ Live chat available 24/7</li>
            </ul>
          </div>
          
          <div className="info-section">
            <h4>Return Policy</h4>
            <p>
              Items can be returned within 30 days of delivery. 
              Visit our returns page for more information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;