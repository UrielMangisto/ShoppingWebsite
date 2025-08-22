// src/pages/auth/ResetPasswordPage/ResetPasswordPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './ResetPasswordPage.css';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, isAuthenticated, loading, error, clearError } = useAuth();
  
  // Get token from URL params
  const token = searchParams.get('token');
  
  // Form states
  const [step, setStep] = useState(token ? 'reset' : 'request'); // 'request' or 'reset'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear auth errors when component mounts
  useEffect(() => {
    if (clearError) {
      clearError();
    }
  }, [clearError]);

  // Handle input changes
  const handleInputChange = (e) => {
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

    // Clear auth error when user modifies form
    if (error && clearError) {
      clearError();
    }
  };

  // Validate email for password reset request
  const validateEmailForm = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    return errors;
  };

  // Validate password reset form
  const validatePasswordForm = () => {
    const errors = {};

    // Password validation
    if (!formData.password) {
      errors.password = 'New password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  // Handle password reset request
  const handleRequestSubmit = async (e) => {
    e.preventDefault();

    const errors = validateEmailForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // This would typically call an API to send reset email
      // await resetPassword({ email: formData.email.trim() });
      
      // For demo purposes, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
    } catch (err) {
      console.error('Password reset request failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle password reset
  const handleResetSubmit = async (e) => {
    e.preventDefault();

    const errors = validatePasswordForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // This would typically call an API to reset password
      // await resetPassword({ 
      //   token, 
      //   password: formData.password 
      // });
      
      // For demo purposes, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
    } catch (err) {
      console.error('Password reset failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !isSubmitting) {
    return (
      <div className="reset-password-page">
        <div className="reset-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Success state for password reset request
  if (success && step === 'request') {
    return (
      <div className="reset-password-page">
        <div className="reset-container">
          <div className="reset-card success-card">
            <div className="reset-header success-header">
              <div className="success-icon">📧</div>
              <h1>Check Your Email</h1>
              <p>We've sent password reset instructions to {formData.email}</p>
            </div>
            <div className="reset-content">
              <div className="success-message">
                <p>If an account with that email exists, you'll receive a password reset link shortly.</p>
                <p>The link will expire in 1 hour for security reasons.</p>
              </div>
              <div className="reset-actions">
                <Link to="/login" className="btn btn-primary btn-full">
                  Back to Login
                </Link>
                <button 
                  onClick={() => {
                    setSuccess(false);
                    setFormData({ email: '', password: '', confirmPassword: '' });
                  }}
                  className="btn btn-secondary btn-full"
                >
                  Send Another Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state for password reset
  if (success && step === 'reset') {
    return (
      <div className="reset-password-page">
        <div className="reset-container">
          <div className="reset-card success-card">
            <div className="reset-header success-header">
              <div className="success-icon">✅</div>
              <h1>Password Updated</h1>
              <p>Your password has been successfully reset</p>
            </div>
            <div className="reset-content">
              <div className="success-message">
                <p>You can now sign in with your new password.</p>
              </div>
              <div className="reset-actions">
                <Link to="/login" className="btn btn-primary btn-full">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="reset-container">
        <div className="reset-card">
          <div className="reset-header">
            <h1>
              {step === 'request' ? 'Reset Password' : 'Set New Password'}
            </h1>
            <p>
              {step === 'request' 
                ? 'Enter your email address and we\'ll send you a link to reset your password'
                : 'Please enter your new password below'
              }
            </p>
          </div>

          <form 
            onSubmit={step === 'request' ? handleRequestSubmit : handleResetSubmit} 
            className="reset-form"
            noValidate
          >
            {/* Display auth error if present */}
            {error && (
              <div className="error-alert">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {step === 'request' ? (
              <div className="form-group">
                <label htmlFor="email">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={formErrors.email ? 'error' : ''}
                  placeholder="Enter your email address"
                  disabled={isSubmitting}
                  autoComplete="email"
                />
                {formErrors.email && (
                  <span className="error-message">{formErrors.email}</span>
                )}
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="password">
                    New Password <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={formErrors.password ? 'error' : ''}
                    placeholder="Enter your new password"
                    disabled={isSubmitting}
                    autoComplete="new-password"
                  />
                  {formErrors.password && (
                    <span className="error-message">{formErrors.password}</span>
                  )}
                  <div className="password-requirements">
                    <small>
                      Password must contain at least 6 characters with uppercase, lowercase, and number
                    </small>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    Confirm New Password <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={formErrors.confirmPassword ? 'error' : ''}
                    placeholder="Confirm your new password"
                    disabled={isSubmitting}
                    autoComplete="new-password"
                  />
                  {formErrors.confirmPassword && (
                    <span className="error-message">{formErrors.confirmPassword}</span>
                  )}
                </div>
              </>
            )}

            <button
              type="submit"
              className="reset-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="button-spinner"></div>
                  {step === 'request' ? 'Sending Email...' : 'Updating Password...'}
                </>
              ) : (
                step === 'request' ? 'Send Reset Email' : 'Update Password'
              )}
            </button>
          </form>

          <div className="reset-footer">
            <p>
              Remember your password?{' '}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
            {step === 'request' && (
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="auth-link">
                  Sign up here
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;