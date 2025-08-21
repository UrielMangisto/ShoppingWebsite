import { useState, useEffect } from 'react';
import { useApi } from '../../../hooks/useApi';
import { adminService } from '../../../services/adminService';
import AdminUserForm from '../AdminUserForm/AdminUserForm';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { execute, loading, error } = useApi();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const { success, data } = await execute(adminService.getUsers);
    if (success) {
      setUsers(data);
    }
  };

  const handleCreateUser = async (userData) => {
    const { success, data } = await execute(() => 
      adminService.createUser(userData)
    );
    if (success) {
      setUsers([...users, data]);
      setShowForm(false);
    }
  };

  const handleUpdateUser = async (userData) => {
    const { success, data } = await execute(() => 
      adminService.updateUser(editingUser._id, userData)
    );
    if (success) {
      setUsers(users.map(user => 
        user._id === editingUser._id ? data : user
      ));
      setEditingUser(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const { success } = await execute(() => 
        adminService.deleteUser(userId)
      );
      if (success) {
        setUsers(users.filter(user => user._id !== userId));
      }
    }
  };

  return (
    <div className="user-management">
      <div className="management-header">
        <h2>Manage Users</h2>
        <button 
          className="add-user-btn"
          onClick={() => setShowForm(true)}
        >
          Add New User
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {(showForm || editingUser) && (
        <AdminUserForm
          user={editingUser}
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
          onCancel={() => {
            setEditingUser(null);
            setShowForm(false);
          }}
        />
      )}

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="action-buttons">
                  <button 
                    className="edit-btn"
                    onClick={() => setEditingUser(user)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;