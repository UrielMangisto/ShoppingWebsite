import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/common/Loading';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { register, error, clearError, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Validation rules
  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Terms agreement validation
    if (!agreedToTerms) {
      errors.terms = 'You must agree to the terms and conditions';
    }

    return errors;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear global error
    if (error) {
      clearError();
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Clear form errors
    setFormErrors({});
    
    const result = await register({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      role: 'user' // Default role
    });
    
    if (result.success) {
      navigate('/', { replace: true });
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.email.trim() &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword &&
      agreedToTerms
    );
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-form-wrapper">
          {/* Register Header */}
          <div className="register-header">
            <div className="register-logo">
              <span className="logo-icon">🛍️</span>
              <span className="logo-text">E-Store</span>
            </div>
            <h1 className="register-title">Create Account</h1>
            <p className="register-subtitle">
              Join us and start your shopping journey today
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="register-form">
            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <div className="input-wrapper">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${formErrors.name ? 'error' : ''}`}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  autoFocus
                />
                <span className="input-icon">👤</span>
              </div>
              {formErrors.name && (
                <span className="field-error">{formErrors.name}</span>
              )}
            </div>

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
                  className={`form-input ${formErrors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
                <span className="input-icon">📧</span>
              </div>
              {formErrors.email && (
                <span className="field-error">{formErrors.email}</span>
              )}
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
                  className={`form-input ${formErrors.password ? 'error' : ''}`}
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('password')}
                  className="password-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {formErrors.password && (
                <span className="field-error">{formErrors.password}</span>
              )}
              <div className="password-requirements">
                <p>Password must be at least 6 characters long</p>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <div className="input-wrapper">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input ${formErrors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                  className="password-toggle"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <span className="field-error">{formErrors.confirmPassword}</span>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                <span className="terms-text">
                  I agree to the{' '}
                  <Link to="/terms" className="terms-link">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="terms-link">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {formErrors.terms && (
                <span className="field-error">{formErrors.terms}</span>
              )}
            </div>

            {/* Global Error Message */}
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className="register-btn"
            >
              {isLoading ? (
                <>
                  <Loading size="small" color="white" />
                  Creating Account...
                </>
              ) : (
                <>
                  <span className="btn-icon">✨</span>
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="form-divider">
            <span>or</span>
          </div>

          {/* Social Registration (Future Enhancement) */}
          <div className="social-login">
            <button type="button" className="social-btn google-btn" disabled>
              <span className="social-icon">🔍</span>
              Sign up with Google
            </button>
            <button type="button" className="social-btn facebook-btn" disabled>
              <span className="social-icon">📘</span>
              Sign up with Facebook
            </button>
          </div>

          {/* Login Link */}
          <div className="login-prompt">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="login-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Register Image/Illustration */}
        <div className="register-image">
          <div className="register-illustration">
            <div className="illustration-content">
              <h2>Join Our Community</h2>
              <p>
                Get access to exclusive deals, track your orders, 
                and enjoy a personalized shopping experience.
              </p>
              <div className="illustration-benefits">
                <div className="benefit">
                  <span className="benefit-icon">🎁</span>
                  <div className="benefit-text">
                    <strong>Exclusive Offers</strong>
                    <span>Member-only discounts and deals</span>
                  </div>
                </div>
                <div className="benefit">
                  <span className="benefit-icon">📦</span>
                  <div className="benefit-text">
                    <strong>Order Tracking</strong>
                    <span>Real-time order updates</span>
                  </div>
                </div>
                <div className="benefit">
                  <span className="benefit-icon">💖</span>
                  <div className="benefit-text">
                    <strong>Wishlist</strong>
                    <span>Save your favorite items</span>
                  </div>
                </div>
                <div className="benefit">
                  <span className="benefit-icon">🔔</span>
                  <div className="benefit-text">
                    <strong>Notifications</strong>
                    <span>Stay updated on new arrivals</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;