import React from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/OrderService';
import './OrderCard.css';

const OrderCard = ({ order, onClick, showDetails = true, className = '' }) => {
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

  // Handle card click
  const handleClick = () => {
    if (onClick) {
      onClick(order);
    }
  };

  // Calculate order summary
  const itemCount = order.items?.length || 0;
  const totalItems = order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;

  return (
    <div 
      className={`order-card ${className} ${onClick ? 'clickable' : ''}`}
      onClick={onClick ? handleClick : undefined}
    >
      <div className="order-card-header">
        <div className="order-info">
          <h3 className="order-number">
            Order #{order.id}
          </h3>
          <p className="order-date">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>
        
        <div className="order-status">
          <span 
            className="status-badge"
            style={{ 
              color: getStatusColor(order.status),
              backgroundColor: `${getStatusColor(order.status)}20`
            }}
          >
            <span className="status-icon">
              {getStatusIcon(order.status)}
            </span>
            {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
          </span>
        </div>
      </div>

      <div className="order-card-body">
        <div className="order-summary">
          <div className="summary-item">
            <span className="summary-label">Total:</span>
            <span className="summary-value total-amount">
              {formatPrice(order.total || 0)}
            </span>
          </div>
          
          <div className="summary-item">
            <span className="summary-label">Items:</span>
            <span className="summary-value">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} ({itemCount} {itemCount === 1 ? 'product' : 'products'})
            </span>
          </div>

          {order.user && (
            <div className="summary-item">
              <span className="summary-label">Customer:</span>
              <span className="summary-value">
                {order.user.name}
              </span>
            </div>
          )}
        </div>

        {/* Order Items Preview */}
        {order.items && order.items.length > 0 && (
          <div className="order-items-preview">
            <div className="items-list">
              {order.items.slice(0, 3).map((item, index) => (
                <div key={index} className="item-preview">
                  <span className="item-name">{item.product_name}</span>
                  <span className="item-quantity">×{item.quantity}</span>
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="more-items">
                  +{order.items.length - 3} more {order.items.length - 3 === 1 ? 'item' : 'items'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showDetails && (
        <div className="order-card-footer">
          <div className="order-actions">
            <Link 
              to={`/orders/${order.id}`} 
              className="btn btn-outline btn-sm"
              onClick={(e) => e.stopPropagation()}
            >
              View Details
            </Link>
            
            {order.status === 'delivered' && (
              <button 
                className="btn btn-secondary btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add review functionality here
                  console.log('Review order:', order.id);
                }}
              >
                P Review
              </button>
            )}
            
            {(order.status === 'pending' || order.status === 'processing') && (
              <button 
                className="btn btn-danger btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Are you sure you want to cancel this order?')) {
                    // Add cancel functionality here
                    console.log('Cancel order:', order.id);
                  }
                }}
              >
                Cancel Order
              </button>
            )}
          </div>

          {/* Shipping Progress (if shipped) */}
          {order.status === 'shipped' && (
            <div className="shipping-progress">
              <div className="progress-indicator">
                <span className="progress-icon">=š</span>
                <span className="progress-text">Your order is on its way!</span>
              </div>
              {order.tracking_number && (
                <div className="tracking-info">
                  <span className="tracking-label">Tracking:</span>
                  <span className="tracking-number">{order.tracking_number}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Quick Status Indicators */}
      <div className="status-indicators">
        {order.status === 'pending' && (
          <div className="indicator pending">
            <span className="indicator-icon">ó</span>
            <span className="indicator-text">Awaiting confirmation</span>
          </div>
        )}
        
        {order.status === 'processing' && (
          <div className="indicator processing">
            <span className="indicator-icon">=æ</span>
            <span className="indicator-text">Being prepared</span>
          </div>
        )}
        
        {order.status === 'shipped' && (
          <div className="indicator shipped">
            <span className="indicator-icon">=š</span>
            <span className="indicator-text">In transit</span>
          </div>
        )}
        
        {order.status === 'delivered' && (
          <div className="indicator delivered">
            <span className="indicator-icon"></span>
            <span className="indicator-text">Delivered successfully</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;