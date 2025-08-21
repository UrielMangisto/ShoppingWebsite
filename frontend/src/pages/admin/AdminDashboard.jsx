import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { stats, fetchStats } = useAdmin();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const cards = [
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      link: '/admin/orders',
      color: 'blue'
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      link: '/admin/products',
      color: 'green'
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      link: '/admin/users',
      color: 'purple'
    },
    {
      title: 'Total Categories',
      value: stats?.totalCategories || 0,
      link: '/admin/categories',
      color: 'yellow'
    }
  ];

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </header>

      <div className="stats-grid">
        {cards.map((card) => (
          <Link to={card.link} key={card.title} className={`stat-card ${card.color}`}>
            <div className="stat-content">
              <h3 className="stat-title">{card.title}</h3>
              <p className="stat-value">{card.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="dashboard-sections">
        <section className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {stats?.recentOrders?.map((order) => (
              <div key={order._id} className="activity-item">
                <div className="activity-icon order-icon" />
                <div className="activity-details">
                  <p className="activity-title">New order #{order.orderNumber}</p>
                  <p className="activity-meta">${order.total} • {order.status}</p>
                </div>
                <Link to={`/admin/orders/${order._id}`} className="activity-action">
                  View
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/products/new" className="action-card">
              <div className="action-icon product-icon" />
              <span>Add Product</span>
            </Link>
            <Link to="/admin/categories/new" className="action-card">
              <div className="action-icon category-icon" />
              <span>Add Category</span>
            </Link>
            <Link to="/admin/users/new" className="action-card">
              <div className="action-icon user-icon" />
              <span>Add User</span>
            </Link>
            <Link to="/admin/orders" className="action-card">
              <div className="action-icon orders-icon" />
              <span>View Orders</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
