// src/pages/admin/OrderManagement/OrderManagement.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useApi } from '../../../hooks/useApi';
import { orderService } from '../../../services/orderService';
import './OrderManagement.css';

const OrderManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const { loading: apiLoading, execute } = useApi();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const orderData = await orderService.getAllOrdersAdmin();
      setOrders(Array.isArray(orderData) ? orderData : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const orderDetails = await execute(() => orderService.getOrder(orderId));
      setSelectedOrder(orderDetails);
      setShowOrderDetails(true);
    } catch (error) {
      alert(`Error fetching order details: ${error.message}`);
    }
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter(order =>
    order.id.toString().includes(searchTerm) ||
    order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getOrderStats = () => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => {
      // Calculate order total (this would normally come from the backend)
      return sum + (order.total_amount || 0);
    }, 0);
    const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    return { totalOrders, totalRevenue, averageOrder };
  };

  const stats = getOrderStats();

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>Admin privileges required.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <h1>Order Management</h1>
            <p>Monitor and manage customer orders</p>
          </div>
        </div>

        {/* Order Stats */}
        <div className="order-stats">
          <div className="stat-card">
            <div className="stat-number">{stats.totalOrders}</div>
            <div className="stat-label">Total Orders</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{formatCurrency(stats.totalRevenue)}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{formatCurrency(stats.averageOrder)}</div>
            <div className="stat-label">Average Order</div>
          </div>
        </div>

        <div className="management-controls">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search orders by ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : (
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="order-id-cell">#{order.id}</td>
                      <td>
                        <div className="customer-cell">
                          <strong>{order.name}</strong>
                        </div>
                      </td>
                      <td className="email-cell">{order.email}</td>
                      <td>{formatDate(order.created_at)}</td>
                      <td>
                        <span className="status-badge completed">
                          ✅ Completed
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => fetchOrderDetails(order.id)}
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      {searchTerm ? 'No orders match your search.' : 'No orders found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="modal-overlay">
            <div className="modal order-details-modal">
              <div className="modal-header">
                <h3>Order Details - #{selectedOrder.order.id}</h3>
                <button 
                  className="close-btn"
                  onClick={() => {
                    setShowOrderDetails(false);
                    setSelectedOrder(null);
                  }}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body">
                <div className="order-info-grid">
                  <div className="order-info-section">
                    <h4>Order Information</h4>
                    <div className="info-item">
                      <span className="label">Order ID:</span>
                      <span className="value">#{selectedOrder.order.id}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Order Date:</span>
                      <span className="value">{formatDate(selectedOrder.order.created_at)}</span>
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
                      <span className="value">{selectedOrder.order.user_id}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Email:</span>
                      <span className="value">{selectedOrder.order.user_email || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="order-items-section">
                  <h4>Order Items</h4>
                  <div className="order-items">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item, index) => (
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

                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <div className="order-total-section">
                    <div className="total-calculation">
                      <div className="total-row">
                        <span>Order Total:</span>
                        <span className="total-amount">
                          {formatCurrency(
                            selectedOrder.items.reduce((sum, item) => 
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
        )}
      </div>
    </div>
  );
};

export default OrderManagement;