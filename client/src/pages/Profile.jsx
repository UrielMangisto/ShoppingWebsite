import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { orderService } from '../services/orderService';
import { validateName, validateEmail, validateSimplePassword, validatePasswordConfirmation } from '../utils/validation';
import { formatErrorMessage, formatDate, formatPrice } from '../utils/formatters';
import Loading from '../components/common/Loading';
import './Profile.css';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [profileErrors, setProfileErrors] = useState({});

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (activeTab === 'orders') {
      loadRecentOrders();
    }
  }, [activeTab]);

  const loadRecentOrders = async () => {
    return new Promise(async (resolve, reject) => {
      setLoadingOrders(true);
      try {
        const response = await orderService.getMyOrders();
        setRecentOrders(response.data.slice(0, 5)); // Show last 5 orders
        resolve(response.data);
      } catch (err) {
        console.error('Error loading orders:', err);
        reject(err);
      } finally {
        setLoadingOrders(false);
      }
    });
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user types
    if (profileErrors[name]) {
      setProfileErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user types
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const validateProfile = () => {
    return new Promise((resolve) => {
      const errors = {};
      
      const nameValidation = validateName(profileData.name);
      if (!nameValidation.isValid) {
        errors.name = nameValidation.message;
      }
      
      const emailValidation = validateEmail(profileData.email);
      if (!emailValidation.isValid) {
        errors.email = emailValidation.message;
      }
      
      resolve(errors);
    });
  };

  const validatePasswordForm = () => {
    return new Promise((resolve) => {
      const errors = {};
      
      if (!passwordData.currentPassword) {
        errors.currentPassword = 'Current password is required';
      }
      
      const newPasswordValidation = validateSimplePassword(passwordData.newPassword);
      if (!newPasswordValidation.isValid) {
        errors.newPassword = newPasswordValidation.message;
      }
      
      const confirmPasswordValidation = validatePasswordConfirmation(
        passwordData.newPassword,
        passwordData.confirmPassword
      );
      if (!confirmPasswordValidation.isValid) {
        errors.confirmPassword = confirmPasswordValidation.message;
      }
      
      resolve(errors);
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    return new Promise(async (resolve, reject) => {
      const errors = await validateProfile();
      if (Object.keys(errors).length > 0) {
        setProfileErrors(errors);
        reject(new Error('Validation failed'));
        return;
      }

      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      try {
        await userService.updateProfile(profileData);
        updateUser(profileData);
        setSuccess('Profile updated successfully!');
        resolve();
      } catch (err) {
        const errorMessage = formatErrorMessage(err);
        setError(errorMessage);
        reject(err);
      } finally {
        setIsLoading(false);
      }
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    return new Promise(async (resolve, reject) => {
      const errors = await validatePasswordForm();
      if (Object.keys(errors).length > 0) {
        setPasswordErrors(errors);
        reject(new Error('Validation failed'));
        return;
      }

      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      try {
        await userService.changePassword(
          passwordData.currentPassword,
          passwordData.newPassword
        );
        setSuccess('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        resolve();
      } catch (err) {
        const errorMessage = formatErrorMessage(err);
        setError(errorMessage);
        reject(err);
      } finally {
        setIsLoading(false);
      }
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-info">
            <div className="profile-avatar">
              <span className="avatar-text">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="profile-details">
              <h1>Welcome, {user?.name}!</h1>
              <p className="profile-email">{user?.email}</p>
              <p className="profile-role">
                {user?.role === 'admin' ? '👑 Administrator' : '👤 Customer'}
              </p>
            </div>
          </div>
          <div className="profile-actions">
            <button onClick={handleLogout} className="btn btn-outline">
              <span className="btn-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="success-message">
            <span className="success-icon">✅</span>
            {success}
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <div className="profile-content">
          {/* Navigation Tabs */}
          <div className="profile-nav">
            <button
              onClick={() => setActiveTab('profile')}
              className={`nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
            >
              👤 Profile Settings
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`nav-tab ${activeTab === 'password' ? 'active' : ''}`}
            >
              🔐 Change Password
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
            >
              📦 Recent Orders
            </button>
            {user?.role === 'admin' && (
              <Link to="/admin" className="nav-tab admin-tab">
                ⚙️ Admin Panel
              </Link>
            )}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Profile Settings Tab */}
            {activeTab === 'profile' && (
              <div className="tab-panel">
                <h2>Profile Settings</h2>
                <p>Update your personal information below.</p>
                
                <form onSubmit={handleProfileSubmit} className="profile-form">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className={profileErrors.name ? 'error' : ''}
                      placeholder="Enter your full name"
                    />
                    {profileErrors.name && (
                      <span className="field-error">{profileErrors.name}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className={profileErrors.email ? 'error' : ''}
                      placeholder="Enter your email address"
                    />
                    {profileErrors.email && (
                      <span className="field-error">{profileErrors.email}</span>
                    )}
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-primary"
                    >
                      {isLoading ? (
                        <>
                          <Loading size="small" color="white" />
                          Updating...
                        </>
                      ) : (
                        'Update Profile'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Change Password Tab */}
            {activeTab === 'password' && (
              <div className="tab-panel">
                <h2>Change Password</h2>
                <p>Choose a strong password to keep your account secure.</p>
                
                <form onSubmit={handlePasswordSubmit} className="password-form">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <div className="password-input-wrapper">
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className={passwordErrors.currentPassword ? 'error' : ''}
                        placeholder="Enter your current password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="password-toggle"
                      >
                        {showPasswords.current ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <span className="field-error">{passwordErrors.currentPassword}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <div className="password-input-wrapper">
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className={passwordErrors.newPassword ? 'error' : ''}
                        placeholder="Enter your new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="password-toggle"
                      >
                        {showPasswords.new ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <span className="field-error">{passwordErrors.newPassword}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <div className="password-input-wrapper">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className={passwordErrors.confirmPassword ? 'error' : ''}
                        placeholder="Confirm your new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="password-toggle"
                      >
                        {showPasswords.confirm ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <span className="field-error">{passwordErrors.confirmPassword}</span>
                    )}
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-primary"
                    >
                      {isLoading ? (
                        <>
                          <Loading size="small" color="white" />
                          Changing...
                        </>
                      ) : (
                        'Change Password'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Recent Orders Tab */}
            {activeTab === 'orders' && (
              <div className="tab-panel">
                <div className="orders-header">
                  <h2>Recent Orders</h2>
                  <Link to="/orders" className="btn btn-outline">
                    View All Orders
                  </Link>
                </div>
                
                {loadingOrders ? (
                  <div className="loading-container">
                    <Loading size="large" text="Loading your orders..." />
                  </div>
                ) : recentOrders.length > 0 ? (
                  <div className="orders-list">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="order-card">
                        <div className="order-info">
                          <div className="order-id">
                            Order #{order.id}
                          </div>
                          <div className="order-date">
                            {formatDate(order.created_at)}
                          </div>
                        </div>
                        <div className="order-status">
                          <span className="status-badge pending">
                            Completed
                          </span>
                        </div>
                        <div className="order-actions">
                          <Link 
                            to={`/orders/${order.id}`} 
                            className="btn btn-outline btn-sm"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-orders">
                    <div className="empty-icon">📦</div>
                    <h3>No orders yet</h3>
                    <p>When you place your first order, it will appear here.</p>
                    <Link to="/products" className="btn btn-primary">
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Account Statistics */}
        <div className="account-stats">
          <h3>Account Overview</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <span className="stat-number">{recentOrders.length}</span>
                <span className="stat-label">Total Orders</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-info">
                <span className="stat-number">
                  {user?.created_at ? formatDate(user.created_at, 'short') : 'Member'}
                </span>
                <span className="stat-label">Member Since</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <span className="stat-number">{user?.role === 'admin' ? 'Admin' : 'Customer'}</span>
                <span className="stat-label">Account Type</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;