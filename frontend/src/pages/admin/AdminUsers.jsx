import { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import './AdminUsers.css';

const AdminUsers = () => {
  const { users, fetchUsers, updateUserRole, deleteUser } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        await fetchUsers();
      } catch (err) {
        setError(err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [fetchUsers]);

  const handleSelect = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (event) => {
    setSelectedUsers(
      event.target.checked
        ? filteredUsers.map(user => user._id)
        : []
    );
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
    } catch (err) {
      setError(err.message || 'Failed to update user role');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        setSelectedUsers(prev => prev.filter(id => id !== userId));
      } catch (err) {
        setError(err.message || 'Failed to delete user');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
      try {
        await Promise.all(selectedUsers.map(id => deleteUser(id)));
        setSelectedUsers([]);
      } catch (err) {
        setError(err.message || 'Failed to delete users');
      }
    }
  };

  const filteredUsers = filterRole === 'all'
    ? users
    : users.filter(user => user.role === filterRole);

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-users">
      <header className="users-header">
        <h1>Users Management</h1>
        <div className="header-actions">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="role-filter"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
          
          {selectedUsers.length > 0 && (
            <button 
              className="bulk-delete-button"
              onClick={handleBulkDelete}
            >
              Delete Selected ({selectedUsers.length})
            </button>
          )}
        </div>
      </header>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    filteredUsers.length > 0 &&
                    selectedUsers.length === filteredUsers.length
                  }
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleSelect(user._id)}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className={`role-select ${user.role}`}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</td>
                <td className="actions-cell">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="delete-button"
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

export default AdminUsers;
