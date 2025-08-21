// src/pages/admin/UserManagement/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useApi } from '../../../hooks/useApi';
import { usersService } from '../../../services/usersService';
import './UserManagement.css';

const UserManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const { loading: apiLoading, execute } = useApi();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchUsers();
    }
  }, [isAuthenticated, user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const userData = await usersService.getAllUsers();
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = (userToEdit) => {
    setEditingUser({
      id: userToEdit.id,
      name: userToEdit.name,
      email: userToEdit.email,
      role: userToEdit.role
    });
    setShowEditForm(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await execute(() => usersService.updateUser(editingUser.id, {
        name: editingUser.name,
        email: editingUser.email
      }));
      
      alert('User updated successfully!');
      setShowEditForm(false);
      setEditingUser(null);
      await fetchUsers();
    } catch (error) {
      alert(`Error updating user: ${error.message}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await execute(() => usersService.deleteUser(userId));
      alert('User deleted successfully!');
      setDeleteConfirm(null);
      await fetchUsers();
    } catch (error) {
      alert(`Error deleting user: ${error.message}`);
    }
  };

  const confirmDelete = (userToDelete) => {
    setDeleteConfirm(userToDelete);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUserStats = () => {
    const totalUsers = users.length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    const regularUsers = users.filter(u => u.role === 'user').length;
    
    return { totalUsers, adminUsers, regularUsers };
  };

  const stats = getUserStats();

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>Admin privileges required.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <h1>User Management</h1>
            <p>Manage user accounts and permissions</p>
          </div>
        </div>

        {/* User Stats */}
        <div className="user-stats">
          <div className="stat-card">
            <div className="stat-number">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.adminUsers}</div>
            <div className="stat-label">Administrators</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.regularUsers}</div>
            <div className="stat-label">Regular Users</div>
          </div>
        </div>

        <div className="management-controls">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div className="user-name-cell">
                          <strong>{u.name}</strong>
                          <span>ID: {u.id}</span>
                        </div>
                      </td>
                      <td className="email-cell">{u.email}</td>
                      <td>
                        <span className={`role-badge ${u.role}`}>
                          {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                        </span>
                      </td>
                      <td>{u.created_at ? formatDate(u.created_at) : 'N/A'}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleEditUser(u)}
                            disabled={u.id === user?.id}
                            title={u.id === user?.id ? "Can't edit yourself" : "Edit user"}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => confirmDelete(u)}
                            disabled={u.id === user?.id || u.role === 'admin'}
                            title={
                              u.id === user?.id ? "Can't delete yourself" :
                              u.role === 'admin' ? "Can't delete admin users" : "Delete user"
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">
                      {searchTerm ? 'No users match your search.' : 'No users found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditForm && editingUser && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Edit User</h3>
              </div>
              <form onSubmit={handleUpdateUser}>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="edit-name">Name</label>
                    <input
                      type="text"
                      id="edit-name"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit-email">Email</label>
                    <input
                      type="email"
                      id="edit-email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <div className="role-display">
                      <span className={`role-badge ${editingUser.role}`}>
                        {editingUser.role === 'admin' ? '👑 Admin' : '👤 User'}
                      </span>
                      <small>Role changes require database access</small>
                    </div>
                  </div>
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingUser(null);
                    }}
                    disabled={apiLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={apiLoading}
                  >
                    {apiLoading ? 'Updating...' : 'Update User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Confirm Delete</h3>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete user "<strong>{deleteConfirm.name}</strong>"?</p>
                <p>Email: {deleteConfirm.email}</p>
                <p>This action cannot be undone.</p>
              </div>
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteConfirm(null)}
                  disabled={apiLoading}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteUser(deleteConfirm.id)}
                  disabled={apiLoading}
                >
                  {apiLoading ? 'Deleting...' : 'Delete User'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;