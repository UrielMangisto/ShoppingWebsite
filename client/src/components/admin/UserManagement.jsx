import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import Loading from '../common/Loading';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [filters, setFilters] = useState({
    role: 'all',
    search: '',
    status: 'all'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, filters]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userService.getAllUsers();
      setUsers(response.data || []);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Filter by role
    if (filters.role !== 'all') {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    // Filter by status
    if (filters.status !== 'all') {
      if (filters.status === 'active') {
        filtered = filtered.filter(user => !user.is_deleted);
      } else if (filters.status === 'inactive') {
        filtered = filtered.filter(user => user.is_deleted);
      }
    }

    // Filter by search (name or email)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }

    // Sort by most recent first
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setFilteredUsers(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteUser = async (userId) => {
    const user = users.find(u => u.id === userId);
    if (!window.confirm(`Are you sure you want to delete "${user.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await userService.deleteUser(userId);
      setSuccess('User deleted successfully');
      await loadUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  const handleCloseUserDetail = () => {
    setSelectedUser(null);
    setShowUserDetail(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserStats = () => {
    return {
      total: users.length,
      admin: users.filter(u => u.role === 'admin').length,
      user: users.filter(u => u.role === 'user').length,
      active: users.filter(u => !u.is_deleted).length,
      inactive: users.filter(u => u.is_deleted).length
    };
  };

  const getRoleBadgeClass = (role) => {
    return role === 'admin' ? 'role-badge admin' : 'role-badge user';
  };

  const getStatusBadgeClass = (user) => {
    return user.is_deleted ? 'status-badge inactive' : 'status-badge active';
  };

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (isLoading) {
    return <Loading size="large" text="Loading users..." />;
  }

  const stats = getUserStats();

  return (
    <div className="user-management">
      <div className="user-header">
        <h1 className="user-title">User Management</h1>
        <button onClick={loadUsers} className="btn btn-outline">
          = Refresh
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* User Stats */}
      <div className="user-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card admin">
          <div className="stat-number">{stats.admin}</div>
          <div className="stat-label">Administrators</div>
        </div>
        <div className="stat-card user">
          <div className="stat-number">{stats.user}</div>
          <div className="stat-label">Regular Users</div>
        </div>
        <div className="stat-card active">
          <div className="stat-number">{stats.active}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card inactive">
          <div className="stat-number">{stats.inactive}</div>
          <div className="stat-label">Inactive</div>
        </div>
      </div>

      {/* Filters */}
      <div className="user-filters">
        <div className="filter-group">
          <label className="filter-label">Role</label>
          <select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrators</option>
            <option value="user">Regular Users</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All Users</option>
            <option value="active">Active Users</option>
            <option value="inactive">Inactive Users</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Search</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Name or email..."
            className="filter-input"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="users-list">
        {filteredUsers.length > 0 ? (
          <div className="users-table">
            <div className="table-header">
              <div className="header-cell">User</div>
              <div className="header-cell">Email</div>
              <div className="header-cell">Role</div>
              <div className="header-cell">Status</div>
              <div className="header-cell">Joined</div>
              <div className="header-cell">Actions</div>
            </div>

            <div className="table-body">
              {filteredUsers.map((user) => (
                <div key={user.id} className="table-row">
                  <div className="table-cell user-info">
                    <div className="user-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-details">
                      <div className="user-name">{user.name}</div>
                      <div className="user-id">ID: {user.id}</div>
                    </div>
                  </div>
                  <div className="table-cell email">
                    {user.email}
                  </div>
                  <div className="table-cell role">
                    <span className={getRoleBadgeClass(user.role)}>
                      {user.role === 'admin' ? '=Q Admin' : '=d User'}
                    </span>
                  </div>
                  <div className="table-cell status">
                    <span className={getStatusBadgeClass(user)}>
                      {user.is_deleted ? 'L Inactive' : ' Active'}
                    </span>
                  </div>
                  <div className="table-cell date">
                    {formatDate(user.created_at)}
                  </div>
                  <div className="table-cell actions">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="btn btn-outline btn-sm"
                    >
                      =A View
                    </button>
                    {!user.is_deleted && user.role !== 'admin' && (
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="btn btn-danger btn-sm"
                      >
                        =Ñ Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">=e</div>
            <h3>No Users Found</h3>
            <p>
              {filters.role !== 'all' || filters.search || filters.status !== 'all'
                ? 'No users match your current filters.'
                : 'No users have registered yet.'
              }
            </p>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {showUserDetail && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content user-detail-modal">
            <div className="modal-header">
              <h2>User Details - {selectedUser.name}</h2>
              <button onClick={handleCloseUserDetail} className="btn-close"></button>
            </div>

            <div className="modal-body">
              <div className="user-detail-grid">
                <div className="detail-section">
                  <h3>Personal Information</h3>
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{selectedUser.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedUser.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">User ID:</span>
                    <span className="detail-value">{selectedUser.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Role:</span>
                    <span className={`detail-value ${getRoleBadgeClass(selectedUser.role)}`}>
                      {selectedUser.role === 'admin' ? 'Administrator' : 'Regular User'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className={`detail-value ${getStatusBadgeClass(selectedUser)}`}>
                      {selectedUser.is_deleted ? 'Inactive' : 'Active'}
                    </span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Account Information</h3>
                  <div className="detail-item">
                    <span className="detail-label">Joined:</span>
                    <span className="detail-value">{formatDate(selectedUser.created_at)}</span>
                  </div>
                  {selectedUser.updated_at && (
                    <div className="detail-item">
                      <span className="detail-label">Last Updated:</span>
                      <span className="detail-value">{formatDate(selectedUser.updated_at)}</span>
                    </div>
                  )}
                  {selectedUser.phone && (
                    <div className="detail-item">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{selectedUser.phone}</span>
                    </div>
                  )}
                  {selectedUser.address && (
                    <div className="detail-item">
                      <span className="detail-label">Address:</span>
                      <span className="detail-value">{selectedUser.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Stats (if available) */}
              <div className="detail-section activity-stats">
                <h3>Activity Summary</h3>
                <div className="stats-grid">
                  <div className="activity-stat">
                    <div className="stat-icon">=æ</div>
                    <div className="stat-info">
                      <div className="stat-number">-</div>
                      <div className="stat-text">Orders</div>
                    </div>
                  </div>
                  <div className="activity-stat">
                    <div className="stat-icon">=°</div>
                    <div className="stat-info">
                      <div className="stat-number">-</div>
                      <div className="stat-text">Total Spent</div>
                    </div>
                  </div>
                  <div className="activity-stat">
                    <div className="stat-icon">P</div>
                    <div className="stat-info">
                      <div className="stat-number">-</div>
                      <div className="stat-text">Reviews</div>
                    </div>
                  </div>
                </div>
                <p className="activity-note">
                  Note: Activity statistics are not yet implemented in this version.
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={handleCloseUserDetail} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;