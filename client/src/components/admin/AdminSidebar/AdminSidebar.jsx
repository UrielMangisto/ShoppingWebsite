import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="admin-sidebar">
      <h2>Admin Dashboard</h2>
      <nav>
        <NavLink to="/admin/products" className="nav-item">
          <i className="fas fa-box"></i> Products
        </NavLink>
        <NavLink to="/admin/categories" className="nav-item">
          <i className="fas fa-tags"></i> Categories
        </NavLink>
        <NavLink to="/admin/orders" className="nav-item">
          <i className="fas fa-shopping-cart"></i> Orders
        </NavLink>
        <NavLink to="/admin/users" className="nav-item">
          <i className="fas fa-users"></i> Users
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;