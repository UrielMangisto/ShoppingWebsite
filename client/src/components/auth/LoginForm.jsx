import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validateSimplePassword } from '../../utils/validation';
import { ButtonSpinner } from '../common/Loading';
import './LoginForm.css';

const LoginForm = ({ onSuccess, className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, clearError, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear global error when user starts typing
    if (error) {
      clearError();
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.message;
    }

    // Validate password
    const passwordValidation = validateSimplePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirect to intended page or home
        navigate(from, { replace: true });
      }
    }
  };

  // Handle "Enter" key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className={`login-form-container ${className}`}>
      <form onSubmit={handleSubmit} className="login-form" noValidate>
        <div className="form-header">
          <h2 className="form-title">Sign In</h2>
          <p className="form-subtitle">Welcome back! Please sign in to your account.</p>
        </div>

        {/* Global Error Message */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address *
          </label>
          <div className="input-wrapper">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className={`form-input ${formErrors.email ? 'error' : ''}`}
              placeholder="Enter your email address"
              required
              disabled={isLoading}
              autoComplete="email"
            />
            <span className="input-icon">=ç</span>
          </div>
          {formErrors.email && (
            <span className="form-error">{formErrors.email}</span>
          )}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password *
          </label>
          <div className="input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className={`form-input ${formErrors.password ? 'error' : ''}`}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
              tabIndex={-1}
              disabled={isLoading}
            >
              {showPassword ? '=A' : '=H'}
            </button>
          </div>
          {formErrors.password && (
            <span className="form-error">{formErrors.password}</span>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="form-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="checkbox-input"
            />
            <span className="checkbox-custom"></span>
            Remember me
          </label>

          <Link 
            to="/forgot-password" 
            className="forgot-password-link"
            tabIndex={isLoading ? -1 : 0}
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={isLoading || !formData.email || !formData.password}
        >
          {isLoading ? (
            <>
              <ButtonSpinner size="small" />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        {/* Divider */}
        <div className="form-divider">
          <span>or</span>
        </div>

        {/* Sign Up Link */}
        <div className="form-footer">
          <p>
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="auth-link"
              tabIndex={isLoading ? -1 : 0}
            >
              Sign up here
            </Link>
          </p>
        </div>

        {/* Demo Accounts (for development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="demo-accounts">
            <p className="demo-title">Demo Accounts:</p>
            <div className="demo-buttons">
              <button
                type="button"
                onClick={() => setFormData({ email: 'admin@demo.com', password: 'admin123' })}
                className="btn btn-outline btn-sm"
                disabled={isLoading}
              >
                Admin Demo
              </button>
              <button
                type="button"
                onClick={() => setFormData({ email: 'user@demo.com', password: 'user123' })}
                className="btn btn-outline btn-sm"
                disabled={isLoading}
              >
                User Demo
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginForm;