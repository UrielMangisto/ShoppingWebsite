import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const AdminContext = createContext({
  isAdmin: false,
  dashboardStats: null,
  setDashboardStats: () => {},
});

export const AdminProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [dashboardStats, setDashboardStats] = useState(null);
  const isAdmin = user?.role === 'admin';

  const value = {
    isAdmin,
    dashboardStats,
    setDashboardStats,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
