import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { useAuth } from '../../../hooks/useAuth';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { 
      path: ROUTES.ADMIN.DASHBOARD, 
      label: 'Dashboard', 
      icon: '📊',
      description: 'Overview and statistics'
    },
    { 
      path: ROUTES.ADMIN.PRODUCTS, 
      label: 'Products', 
      icon: '📦',
      description: 'Manage products inventory'
    },
    { 
      path: ROUTES.ADMIN.CATEGORIES, 
      label: 'Categories', 
      icon: '🏷️',
      description: 'Manage product categories'
    },
    { 
      path: ROUTES.ADMIN.ORDERS, 
      label: 'Orders', 
      icon: '📝',
      description: 'View and manage orders'
    },
    { 
      path: ROUTES.ADMIN.USERS, 
      label: 'Users', 
      icon: '👥',
      description: 'Manage user accounts'
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.AUTH.LOGIN);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <aside 
      className={`bg-gray-800 text-white ${
        isCollapsed ? 'w-20' : 'w-64'
      } min-h-screen p-4 transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between mb-8">
        <div className={`${isCollapsed ? 'hidden' : 'text-xl font-bold'}`}>
          Admin Panel
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-700"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center p-2 rounded-lg ${
                  location.pathname === item.path
                    ? 'bg-blue-600'
                    : 'hover:bg-gray-700'
                } group relative`}
                title={isCollapsed ? item.label : ''}
              >
                <span className="mr-3">{item.icon}</span>
                {!isCollapsed && (
                  <span>{item.label}</span>
                )}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 py-1 px-2 bg-gray-900 text-sm rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-gray-400 text-xs">{item.description}</div>
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={`mt-auto pt-4 border-t border-gray-700 ${isCollapsed ? 'text-center' : ''}`}>
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-2 rounded-lg hover:bg-gray-700 text-red-400 hover:text-red-300"
        >
          <span className="mr-3">🚪</span>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
