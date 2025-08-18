import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/common/Loading';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, clearError, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Get redirect path from location state
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
    
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Redirect to intended page or home
      navigate(from, { replace: true });
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-wrapper">
          {/* Login Header */}
          <div className="login-header">
            <div className="login-logo">
              <span className="logo-icon">🛍️</span>
              <span className="logo-text">E-Store</span>
            </div>
            <h1 className="login-title">Welcome Back!</h1>
            <p className="login-subtitle">
              Sign in to your account to continue shopping
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-wrapper">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                  autoFocus
                />
                <span className="input-icon">📧</span>
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Options Row */}
            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                Remember me
              </label>
              
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !formData.email || !formData.password}
              className="login-btn"
            >
              {isLoading ? (
                <>
                  <Loading size="small" color="white" />
                  Signing in...
                </>
              ) : (
                <>
                  <span className="btn-icon">🚪</span>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="form-divider">
            <span>or</span>
          </div>

          {/* Social Login (Future Enhancement) */}
          <div className="social-login">
            <button type="button" className="social-btn google-btn" disabled>
              <span className="social-icon">🔍</span>
              Continue with Google
            </button>
            <button type="button" className="social-btn facebook-btn" disabled>
              <span className="social-icon">📘</span>
              Continue with Facebook
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="signup-prompt">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="signup-link">
                Create one here
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="demo-credentials">
            <h4>Demo Credentials:</h4>
            <div className="demo-accounts">
              <div className="demo-account">
                <strong>Admin:</strong> admin@example.com / admin123
              </div>
              <div className="demo-account">
                <strong>User:</strong> user@example.com / user123
              </div>
            </div>
          </div>
        </div>

        {/* Login Image/Illustration */}
        <div className="login-image">
          <div className="login-illustration">
            <div className="illustration-content">
              <h2>Shop with Confidence</h2>
              <p>
                Discover thousands of products from trusted sellers. 
                Secure payments, fast shipping, and easy returns.
              </p>
              <div className="illustration-features">
                <div className="feature">
                  <span className="feature-icon">🔒</span>
                  Secure & Safe
                </div>
                <div className="feature">
                  <span className="feature-icon">🚚</span>
                  Fast Delivery
                </div>
                <div className="feature">
                  <span className="feature-icon">💰</span>
                  Best Prices
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;