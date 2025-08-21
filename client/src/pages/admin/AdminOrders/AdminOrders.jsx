import { useEffect } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar/AdminSidebar';
import OrderManagement from '../../../components/admin/OrderManagement/OrderManagement';
import './AdminOrders.css';

const AdminOrders = () => {
  useEffect(() => {
    document.title = 'Admin - Orders Management';
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-orders">
        <OrderManagement />
      </main>
    </div>
  );
};

export default AdminOrders;