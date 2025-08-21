import { useEffect } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar/AdminSidebar';
import UserManagement from '../../../components/admin/UserManagement/UserManagement';
import './AdminUsers.css';

const AdminUsers = () => {
  useEffect(() => {
    document.title = 'Admin - Users Management';
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-users">
        <UserManagement />
      </main>
    </div>
  );
};

export default AdminUsers;