import { useState, useEffect } from 'react';
import { useApi } from '../../../hooks/useApi';
import { adminService } from '../../../services/adminService';
import AdminSidebar from '../../../components/admin/AdminSidebar/AdminSidebar';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    recentOrders: []
  });
  const { execute, loading, error } = useApi();

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    const { success, data } = await execute(adminService.getDashboardStats);
    if (success) {
      setStats(data);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-dashboard">
        <h1>Dashboard</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div>Loading dashboard data...</div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Orders</h3>
                <p>{stats.totalOrders}</p>
              </div>
              <div className="stat-card">
                <h3>Total Users</h3>
                <p>{stats.totalUsers}</p>
              </div>
              <div className="stat-card">
                <h3>Total Products</h3>
                <p>{stats.totalProducts}</p>
              </div>
            </div>

            <div className="recent-orders">
              <h2>Recent Orders</h2>
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map(order => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.user.name}</td>
                      <td>${order.total.toFixed(2)}</td>
                      <td>{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;