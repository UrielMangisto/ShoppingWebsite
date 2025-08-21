// src/pages/ProfilePage/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        setError(null);
        const userOrders = await orderService.getMyOrders();
        setOrders(Array.isArray(userOrders) ? userOrders : []);
      } catch (err) {
        setError(err.message || 'Failed to load orders');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

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

  // Calculate order total (if available)
  const calculateOrderTotal = (order) => {
    if (order.total) return order.total;
    if (order.items && Array.isArray(order.items)) {
      return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    return 0;
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Handle view order details
  const handleViewOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="not-authenticated">
            <h2>Please log in to view your profile</h2>
            <button onClick={() => navigate('/login')} className="login-btn">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="user-info">
            <div className="avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-details">
              <h1>Welcome, {user?.name || 'User'}</h1>
              <p className="user-email">{user?.email}</p>
              <p className="user-role">Role: {user?.role || 'user'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-tabs">
            <button 
              className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              My Orders ({orders.length})
            </button>
            <button 
              className={`tab ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              Account Settings
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'orders' && (
              <div className="orders-section">
                <div className="section-header">
                  <h2>My Orders</h2>
                  <p>View and track all your orders</p>
                </div>

                {loading ? (
                  <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading your orders...</p>
                  </div>
                ) : error ? (
                  <div className="error-state">
                    <div className="error-icon">⚠️</div>
                    <h3>Failed to load orders</h3>
                    <p>{error}</p>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="retry-btn"
                    >
                      Try Again
                    </button>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <h3>No orders yet</h3>
                    <p>Start shopping to see your orders here!</p>
                    <button 
                      onClick={() => navigate('/products')} 
                      className="shop-btn"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map((order) => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <div className="order-info">
                            <h3>Order #{order.id}</h3>
                            <p className="order-date">
                              Placed on {formatDate(order.created_at)}
                            </p>
                          </div>
                          <div className="order-status">
                            <span className={`status-badge ${order.status || 'pending'}`}>
                              {order.status || 'Pending'}
                            </span>
                          </div>
                        </div>

                        <div className="order-details">
                          <div className="order-total">
                            <span className="total-label">Total:</span>
                            <span className="total-amount">
                              ${calculateOrderTotal(order).toFixed(2)}
                            </span>
                          </div>
                          
                          {order.items && order.items.length > 0 && (
                            <div className="order-items-preview">
                              <p>{order.items.length} item(s)</p>
                            </div>
                          )}
                        </div>

                        <div className="order-actions">
                          <button 
                            onClick={() => handleViewOrder(order.id)}
                            className="view-order-btn"
                          >
                            View Details
                          </button>
                          {(order.status === 'pending' || order.status === 'processing') && (
                            <button className="track-order-btn">
                              Track Order
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'account' && (
              <div className="account-section">
                <div className="section-header">
                  <h2>Account Settings</h2>
                  <p>Manage your account information</p>
                </div>

                <div className="account-info">
                  <div className="info-group">
                    <label>Full Name</label>
                    <div className="info-value">{user?.name || 'Not provided'}</div>
                  </div>
                  
                  <div className="info-group">
                    <label>Email Address</label>
                    <div className="info-value">{user?.email || 'Not provided'}</div>
                  </div>
                  
                  <div className="info-group">
                    <label>Account Type</label>
                    <div className="info-value">
                      <span className={`role-badge ${user?.role}`}>
                        {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="info-group">
                    <label>Member Since</label>
                    <div className="info-value">
                      {user?.created_at ? formatDate(user.created_at) : 'Unknown'}
                    </div>
                  </div>
                </div>

                <div className="account-actions">
                  <button className="edit-profile-btn">
                    Edit Profile
                  </button>
                  <button className="change-password-btn">
                    Change Password
                  </button>
                  {user?.role === 'admin' && (
                    <button 
                      onClick={() => navigate('/admin')}
                      className="admin-panel-btn"
                    >
                      Admin Panel
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;