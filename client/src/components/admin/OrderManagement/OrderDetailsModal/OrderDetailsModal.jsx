import React from 'react';
import OrderStatus from '../../../orders/OrderStatus';
import './OrderDetailsModal.css';

const OrderDetailsModal = ({ 
  order, 
  onClose, 
  formatDate, 
  formatCurrency 
}) => {
  if (!order) return null;

  // Handle clicking on overlay (background) to close modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key to close modal
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal order-details-modal">
        <div className="modal-header">
          <h3>Order Details - #{order.order.id}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="order-info-grid">
            <div className="order-info-section">
              <h4>Order Information</h4>
              <div className="info-item">
                <span className="label">Order ID:</span>
                <span className="value">#{order.order.id}</span>
              </div>
              <div className="info-item">
                <span className="label">Order Date:</span>
                <span className="value">{formatDate(order.order.created_at)}</span>
              </div>
              <div className="info-item">
                <span className="label">Status:</span>
                <span className="value">
                  <OrderStatus status={order.order.status} />
                </span>
              </div>
            </div>

            <div className="customer-info-section">
              <h4>Customer Information</h4>
              <div className="info-item">
                <span className="label">Customer ID:</span>
                <span className="value">{order.order.user_id}</span>
              </div>
            </div>
          </div>

          <div className="order-items-section">
            <h4>Order Items</h4>
            <div className="order-items">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-image">
                      {item.image_id ? (
                        <img 
                          src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/images/${item.image_id}`} 
                          alt={item.name} 
                        />
                      ) : (
                        <div className="no-image">📷</div>
                      )}
                    </div>
                    <div className="item-details">
                      <h5>{item.name}</h5>
                      <div className="item-price-qty">
                        <span>Price: {formatCurrency(item.price)}</span>
                        <span>Quantity: {item.quantity}</span>
                        <span className="item-total">
                          Total: {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-items">No items found for this order.</p>
              )}
            </div>
          </div>

          {order.items && order.items.length > 0 && (
            <div className="order-total-section">
              <div className="total-calculation">
                <div className="total-row">
                  <span>Order Total:</span>
                  <span className="total-amount">
                    {formatCurrency(
                      order.items.reduce((sum, item) => 
                        sum + (item.price * item.quantity), 0
                      )
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <div className="modal-actions">
            <button className="btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
          <div className="modal-hint">
            <small>Press ESC or click outside to close</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
