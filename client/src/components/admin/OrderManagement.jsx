import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/OrderService';
import Loading from '../common/Loading';
import './OrderManagement.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateFrom: '',
    dateTo: ''
  });

  const orderStatuses = [
    { value: 'pending', label: 'Pending', color: '#f59e0b' },
    { value: 'processing', label: 'Processing', color: '#3b82f6' },
    { value: 'shipped', label: 'Shipped', color: '#8b5cf6' },
    { value: 'delivered', label: 'Delivered', color: '#10b981' },
    { value: 'cancelled', label: 'Cancelled', color: '#ef4444' }
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, filters]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await orderService.getAllOrders();
      setOrders(response.data || []);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // Filter by search (order ID or customer name)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(order =>
        order.id.toString().includes(searchTerm) ||
        (order.user?.name || '').toLowerCase().includes(searchTerm) ||
        (order.user?.email || '').toLowerCase().includes(searchTerm)
      );
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter(order =>
        new Date(order.created_at) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(order =>
        new Date(order.created_at) <= new Date(filters.dateTo)
      );
    }

    // Sort by most recent first
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setFilteredOrders(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change this order status to "${newStatus}"?`)) {
      return;
    }

    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setSuccess('Order status updated successfully');
      
      // Update local state
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      // Update selected order if it's the same
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      setError(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleCloseOrderDetail = () => {
    setSelectedOrder(null);
    setShowOrderDetail(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const statusObj = orderStatuses.find(s => s.value === status);
    return statusObj?.color || '#6b7280';
  };

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    };
  };

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (isLoading) {
    return <Loading size="large" text="Loading orders..." />;
  }

  const stats = getOrderStats();

  return (
    <div className="order-management">
      <div className="order-header">
        <h1 className="order-title">Order Management</h1>
        <button onClick={loadOrders} className="btn btn-outline">
          = Refresh
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Order Stats */}
      <div className="order-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card processing">
          <div className="stat-number">{stats.processing}</div>
          <div className="stat-label">Processing</div>
        </div>
        <div className="stat-card shipped">
          <div className="stat-number">{stats.shipped}</div>
          <div className="stat-label">Shipped</div>
        </div>
        <div className="stat-card delivered">
          <div className="stat-number">{stats.delivered}</div>
          <div className="stat-label">Delivered</div>
        </div>
      </div>

      {/* Filters */}
      <div className="order-filters">
        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All Orders</option>
            {orderStatuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Search</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Order ID, customer name, email..."
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">From Date</label>
          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">To Date</label>
          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
            className="filter-input"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="orders-list">
        {filteredOrders.length > 0 ? (
          <div className="orders-table">
            <div className="table-header">
              <div className="header-cell">Order ID</div>
              <div className="header-cell">Customer</div>
              <div className="header-cell">Date</div>
              <div className="header-cell">Status</div>
              <div className="header-cell">Total</div>
              <div className="header-cell">Actions</div>
            </div>

            <div className="table-body">
              {filteredOrders.map((order) => (
                <div key={order.id} className="table-row">
                  <div className="table-cell order-id">
                    <strong>#{order.id}</strong>
                  </div>
                  <div className="table-cell customer">
                    <div className="customer-info">
                      <div className="customer-name">
                        {order.user?.name || 'Unknown Customer'}
                      </div>
                      <div className="customer-email">
                        {order.user?.email}
                      </div>
                    </div>
                  </div>
                  <div className="table-cell date">
                    {formatDate(order.created_at)}
                  </div>
                  <div className="table-cell status">
                    <div className="status-container">
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="status-select"
                        style={{ color: getStatusColor(order.status) }}
                      >
                        {orderStatuses.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="table-cell total">
                    <strong>{formatCurrency(order.total || 0)}</strong>
                  </div>
                  <div className="table-cell actions">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="btn btn-outline btn-sm"
                    >
                      =A View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">=æ</div>
            <h3>No Orders Found</h3>
            <p>
              {filters.status !== 'all' || filters.search || filters.dateFrom || filters.dateTo
                ? 'No orders match your current filters.'
                : 'No orders have been placed yet.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content order-detail-modal">
            <div className="modal-header">
              <h2>Order Details - #{selectedOrder.id}</h2>
              <button onClick={handleCloseOrderDetail} className="btn-close"></button>
            </div>

            <div className="modal-body">
              <div className="order-detail-grid">
                <div className="detail-section">
                  <h3>Order Information</h3>
                  <div className="detail-item">
                    <span className="detail-label">Order ID:</span>
                    <span className="detail-value">#{selectedOrder.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{formatDate(selectedOrder.created_at)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value" style={{ color: getStatusColor(selectedOrder.status) }}>
                      {selectedOrder.status || 'pending'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Total:</span>
                    <span className="detail-value">{formatCurrency(selectedOrder.total || 0)}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Customer Information</h3>
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{selectedOrder.user?.name || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedOrder.user?.email || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="detail-section order-items">
                  <h3>Order Items</h3>
                  <div className="items-list">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="item-row">
                        <div className="item-info">
                          <span className="item-name">{item.product_name}</span>
                          <span className="item-quantity">Qty: {item.quantity}</span>
                        </div>
                        <div className="item-price">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={handleCloseOrderDetail} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;