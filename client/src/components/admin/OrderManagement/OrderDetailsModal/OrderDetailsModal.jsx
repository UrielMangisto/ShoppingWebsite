import React from 'react';
import './OrderDetailsModal.css';

const OrderDetailsModal = ({ 
  order, 
  onClose, 
  formatDate, 
  formatCurrency 
}) => {
  if (!order) return null;

  return (
    <div className="modal-overlay">
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
                  <span className="status-badge completed">✅ Completed</span>
                </span>
              </div>
            </div>

            <div className="customer-info-section">
              <h4>Customer Information</h4>
              <div className="info-item">
                <span className="label">Customer ID:</span>
                <span className="value">{order.order.user_id}</span>
              </div>
              <div className="info-item">
                <span className="label">Email:</span>
                <span className="value">{order.order.user_email || 'N/A'}</span>
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
                          src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/images/${item.image_id}`} 
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
      </div>
    </div>
  );
};

export default OrderDetailsModal;
