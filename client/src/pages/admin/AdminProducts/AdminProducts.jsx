import { useEffect } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar/AdminSidebar';
import ProductManagement from '../../../components/admin/ProductManagement/ProductManagement';
import './AdminProducts.css';

const AdminProducts = () => {
  useEffect(() => {
    document.title = 'Admin - Products Management';
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-products">
        <ProductManagement />
      </main>
    </div>
  );
};

export default AdminProducts;