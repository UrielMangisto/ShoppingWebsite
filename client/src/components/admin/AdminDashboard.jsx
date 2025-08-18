import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/OrderService';
import { userService } from '../../services/userService';
import { productService } from '../../services/productService';
import Loading from '../common/Loading';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState('month'); // week, month, year

  useEffect(() => {
    loadDashboardData();
  }, [timeFilter]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load dashboard statistics
      const [ordersResponse, usersResponse, productsResponse] = await Promise.all([
        orderService.getAllOrders().catch(() => ({ data: [] })),
        userService.getAllUsers().catch(() => ({ data: [] })),
        productService.getProducts().catch(() => ({ data: [] }))
      ]);

      const orders = ordersResponse.data || [];
      const users = usersResponse.data || [];
      const products = productsResponse.data || [];

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const recentOrders = orders
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

      // Calculate top products (mock data for now)
      const topProducts = products.slice(0, 5).map(product => ({
        ...product,
        salesCount: Math.floor(Math.random() * 100) + 1
      }));

      setStats({
        totalOrders: orders.length,
        totalUsers: users.length,
        totalProducts: products.length,
        totalRevenue,
        recentOrders,
        topProducts
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
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
      day: 'numeric'
    });
  };

  const getOrderStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      processing: '#3b82f6',
      shipped: '#8b5cf6',
      delivered: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status?.toLowerCase()] || '#6b7280';
  };

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={loadDashboardData} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">Overview of your store performance</p>
        </div>
        <div className="header-actions">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="time-filter-select"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <Loading size="large" text="Loading dashboard..." />
      ) : (
        <div className="dashboard-content">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card revenue">
              <div className="stat-icon">=°</div>
              <div className="stat-content">
                <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
                <div className="stat-label">Total Revenue</div>
              </div>
            </div>

            <div className="stat-card orders">
              <div className="stat-icon">=æ</div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalOrders}</div>
                <div className="stat-label">Total Orders</div>
              </div>
            </div>

            <div className="stat-card users">
              <div className="stat-icon">=e</div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalUsers}</div>
                <div className="stat-label">Total Users</div>
              </div>
            </div>

            <div className="stat-card products">
              <div className="stat-icon">=Ë</div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalProducts}</div>
                <div className="stat-label">Total Products</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-section">
            <h2 className="section-title">Quick Actions</h2>
            <div className="quick-actions-grid">
              <Link to="/admin/products/new" className="action-card">
                <div className="action-icon">•</div>
                <div className="action-content">
                  <h3>Add Product</h3>
                  <p>Create a new product listing</p>
                </div>
              </Link>

              <Link to="/admin/categories" className="action-card">
                <div className="action-icon">=Â</div>
                <div className="action-content">
                  <h3>Manage Categories</h3>
                  <p>Organize product categories</p>
                </div>
              </Link>

              <Link to="/admin/orders" className="action-card">
                <div className="action-icon">=æ</div>
                <div className="action-content">
                  <h3>View Orders</h3>
                  <p>Process pending orders</p>
                </div>
              </Link>

              <Link to="/admin/users" className="action-card">
                <div className="action-icon">=e</div>
                <div className="action-content">
                  <h3>Manage Users</h3>
                  <p>View and manage user accounts</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-sections">
            {/* Recent Orders */}
            <div className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">Recent Orders</h2>
                <Link to="/admin/orders" className="section-link">
                  View All ’
                </Link>
              </div>
              <div className="recent-orders">
                {stats.recentOrders.length > 0 ? (
                  <div className="orders-list">
                    {stats.recentOrders.map((order) => (
                      <div key={order.id} className="order-item">
                        <div className="order-info">
                          <div className="order-id">Order #{order.id}</div>
                          <div className="order-customer">{order.user?.name || 'Customer'}</div>
                          <div className="order-date">{formatDate(order.created_at)}</div>
                        </div>
                        <div className="order-details">
                          <div className="order-total">{formatCurrency(order.total || 0)}</div>
                          <div 
                            className="order-status"
                            style={{ color: getOrderStatusColor(order.status) }}
                          >
                            {order.status || 'pending'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No recent orders</p>
                  </div>
                )}
              </div>
            </div>

            {/* Top Products */}
            <div className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">Top Products</h2>
                <Link to="/admin/products" className="section-link">
                  View All ’
                </Link>
              </div>
              <div className="top-products">
                {stats.topProducts.length > 0 ? (
                  <div className="products-list">
                    {stats.topProducts.map((product) => (
                      <div key={product.id} className="product-item">
                        <div className="product-info">
                          <div className="product-name">{product.name}</div>
                          <div className="product-price">{formatCurrency(product.price)}</div>
                        </div>
                        <div className="product-stats">
                          <div className="product-sales">{product.salesCount} sold</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No product data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;