import { useEffect } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar/AdminSidebar';
import CategoryManagement from '../../../components/admin/CategoryManagement/CategoryManagement';
import './AdminCategories.css';

const AdminCategories = () => {
  useEffect(() => {
    document.title = 'Admin - Categories Management';
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-categories">
        <CategoryManagement />
      </main>
    </div>
  );
};

export default AdminCategories;