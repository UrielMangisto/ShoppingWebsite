import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './AdminSetup.css';

const AdminSetup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [success, setSuccess] = useState(false);
  const { register, loading, error } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      // Register with admin role
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'admin'  // This will create an admin user
      });
      setSuccess(true);
    } catch (err) {
      // Error handled by context
    }
  };

  if (success) {
    return (
      <div className="admin-setup-page">
        <div className="container">
          <div className="success-container">
            <h2>✅ Admin Account Created Successfully!</h2>
            <p>You can now login with your admin credentials.</p>
            <a href="/login" className="btn btn-primary">Go to Login</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-setup-page">
      <div className="container">
        <div className="setup-container">
          <div className="setup-header">
            <h1>Admin Account Setup</h1>
            <p>Create your administrator account</p>
          </div>

          <form onSubmit={handleSubmit} className="setup-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter full name"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter admin email"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm password"
                className="form-input"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Creating Admin...' : 'Create Admin Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;