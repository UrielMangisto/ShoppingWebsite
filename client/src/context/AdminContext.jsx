import { createContext, useContext, useState } from 'react';
import { checkAdminAccess } from '../services/adminService';

export const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAccess = async () => {
    try {
      const hasAccess = await checkAdminAccess();
      setIsAdmin(hasAccess);
    } catch (error) {
      console.error('Error checking admin access:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Checking admin access...</div>;
  }

  return (
    <AdminContext.Provider value={{ isAdmin, checkAccess }}>
      {children}
    </AdminContext.Provider>
  );
}
