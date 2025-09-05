import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { productsService } from '../../../services/productsService';
import { usersService } from '../../../services/usersService';
import { orderService } from '../../../services/orderService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin (but only after auth loading is complete)
    if (!authLoading && (!isAuthenticated || user?.role !== 'admin')) {
      navigate('/login');
      return;
    }

    if (!authLoading && isAuthenticated && user?.role === 'admin') {
      fetchDashboardStats();
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      const [products, users, orders] = await Promise.all([
        productsService.getAllProducts(),
        usersService.getAllUsers(),
        orderService.getAllOrdersAdmin()
      ]);

      setStats({
        totalProducts: products.length,
        totalUsers: users.length,
        totalOrders: orders.length
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="admin-dashboard">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Checking access...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="admin-dashboard">
        <div className="container">
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>You need admin privileges to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.name}!</p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-content">
                  <h3>{stats.totalProducts}</h3>
                  <p>Total Products</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3>{stats.totalUsers}</h3>
                  <p>Total Users</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🛍️</div>
                <div className="stat-content">
                  <h3>{stats.totalOrders}</h3>
                  <p>Total Orders</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="actions-grid">
                <button 
                  className="action-card"
                  onClick={() => navigate('/admin/products')}
                >
                  <div className="action-icon">📦</div>
                  <h3>Manage Products</h3>
                  <p>Add, edit, or delete products</p>
                </button>

                <button 
                  className="action-card"
                  onClick={() => navigate('/admin/users')}
                >
                  <div className="action-icon">👥</div>
                  <h3>Manage Users</h3>
                  <p>View and manage user accounts</p>
                </button>

                <button 
                  className="action-card"
                  onClick={() => navigate('/admin/orders')}
                >
                  <div className="action-icon">🛍️</div>
                  <h3>Manage Orders</h3>
                  <p>View and process orders</p>
                </button>

                <button 
                  className="action-card"
                  onClick={() => navigate('/admin/categories')}
                >
                  <div className="action-icon">🏷️</div>
                  <h3>Manage Categories</h3>
                  <p>Add and organize categories</p>
                </button>

                <button 
                  className="action-card"
                  onClick={() => navigate('/admin/setup')}
                >
                  <div className="action-icon">🔧</div>
                  <h3>Admin Setup</h3>
                  <p>Create new admin accounts</p>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;