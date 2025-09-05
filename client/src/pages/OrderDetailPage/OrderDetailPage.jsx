// src/pages/OrderDetailPage/OrderDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import OrderStatus from '../../components/orders/OrderStatus';
import './OrderDetailPage.css';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId || !isAuthenticated) return;

      try {
        setLoading(true);
        setError(null);
        
        const orderData = await orderService.getOrder(orderId);
        setOrder(orderData.order);
        setOrderItems(orderData.items || []);
      } catch (err) {
        setError(err.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, isAuthenticated]);

  // Format date
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Calculate totals
  const calculateItemTotal = (price, quantity) => {
    return (parseFloat(price) * parseInt(quantity)).toFixed(2);
  };

  const calculateOrderTotal = () => {
    return orderItems.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * parseInt(item.quantity));
    }, 0).toFixed(2);
  };

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  if (loading) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h2>Failed to load order</h2>
            <p>{error}</p>
            <div className="error-actions">
              <button onClick={() => navigate('/profile')} className="back-btn">
                Back to Profile
              </button>
              <button onClick={() => window.location.reload()} className="retry-btn">
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <div className="not-found-state">
            <h2>Order not found</h2>
            <p>The order you're looking for doesn't exist or you don't have permission to view it.</p>
            <button onClick={() => navigate('/profile')} className="back-btn">
              Back to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <div className="container">
        {/* Header */}
        <div className="order-header">
          <button onClick={() => navigate('/profile')} className="back-button">
            ← Back to Profile
          </button>
          <div className="order-title">
            <h1>Order #{order.id}</h1>
            <p className="order-date">Placed on {formatDate(order.created_at)}</p>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="order-summary-card">
          <div className="summary-header">
            <h2>Order Summary</h2>
            <OrderStatus status={order.status} />
          </div>
          
          <div className="summary-details">
            <div className="detail-item">
              <span className="label">Order ID:</span>
              <span className="value">#{order.id}</span>
            </div>
            <div className="detail-item">
              <span className="label">Order Date:</span>
              <span className="value">{formatDate(order.created_at)}</span>
            </div>
            <div className="detail-item">
              <span className="label">Status:</span>
              <span className="value">
                <OrderStatus status={order.status} />
              </span>
            </div>
            <div className="detail-item">
              <span className="label">Total Amount:</span>
              <span className="value total-amount">${calculateOrderTotal()}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="order-items-card">
          <h2>Items Ordered ({orderItems.length})</h2>
          
          {orderItems.length === 0 ? (
            <div className="no-items">
              <p>No items found for this order.</p>
            </div>
          ) : (
            <div className="items-list">
              {orderItems.map((item, index) => (
                <div key={index} className="item-row">
                  <div className="item-image">
                    {item.image_id ? (
                      <img 
                        src={`http://localhost:5000/api/images/${item.image_id}`} 
                        alt={item.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="image-placeholder" style={{ display: item.image_id ? 'none' : 'flex' }}>
                      📦
                    </div>
                  </div>
                  
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <div className="item-info">
                      <span className="item-price">${parseFloat(item.price).toFixed(2)} each</span>
                      <span className="item-quantity">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  
                  <div className="item-total">
                    <span className="total-label">Total:</span>
                    <span className="total-value">${calculateItemTotal(item.price, item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Actions */}
        <div className="order-actions-card">
          <h2>Order Actions</h2>
          <div className="actions-list">
            {(order.status === 'pending' || order.status === 'processing') && (
              <>
                <button className="action-btn track-btn">
                  📍 Track Order
                </button>
                <button className="action-btn cancel-btn">
                  ❌ Cancel Order
                </button>
              </>
            )}
            
            <button className="action-btn contact-btn">
              💬 Contact Support
            </button>
            
            <button 
              onClick={() => window.print()} 
              className="action-btn print-btn"
            >
              🖨️ Print Order
            </button>
            
            {order.status === 'delivered' && (
              <button className="action-btn review-btn">
                ⭐ Leave Review
              </button>
            )}
          </div>
        </div>

        {/* Order Timeline */}
        <div className="order-timeline-card">
          <h2>Order Timeline</h2>
          <div className="timeline">
            <div className={`timeline-item ${order.status ? 'completed' : ''}`}>
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h4>Order Placed</h4>
                <p>{formatDate(order.created_at)}</p>
                <span className="timeline-desc">Your order has been received and is being processed.</span>
              </div>
            </div>
            
            <div className={`timeline-item ${order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'completed' : ''}`}>
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h4>Processing</h4>
                <p>{order.status === 'processing' ? 'In progress' : 'Pending'}</p>
                <span className="timeline-desc">We're preparing your items for shipment.</span>
              </div>
            </div>
            
            <div className={`timeline-item ${order.status === 'shipped' || order.status === 'delivered' ? 'completed' : ''}`}>
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h4>Shipped</h4>
                <p>{order.status === 'shipped' ? 'In transit' : 'Pending'}</p>
                <span className="timeline-desc">Your order is on its way to you.</span>
              </div>
            </div>
            
            <div className={`timeline-item ${order.status === 'delivered' ? 'completed' : ''}`}>
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h4>Delivered</h4>
                <p>{order.status === 'delivered' ? 'Completed' : 'Pending'}</p>
                <span className="timeline-desc">Your order has been delivered successfully.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;