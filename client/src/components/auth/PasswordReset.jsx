import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { validateEmail, validateSimplePassword, validatePasswordConfirmation } from '../../utils/validation';
import { ButtonSpinner } from '../common/Loading';
import './PasswordReset.css';

const PasswordReset = ({ mode = 'request' }) => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Determine if this is a reset request or password reset with token
  const isResetRequest = mode === 'request' || !token;
  const isPasswordReset = mode === 'reset' && token;

  useEffect(() => {
    // Clear any previous messages when component mounts
    setError(null);
    setSuccess(null);
  }, []);

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
      setError(null);
    }
  };

  // Validate form based on mode
  const validateForm = () => {
    const errors = {};

    if (isResetRequest) {
      // Only validate email for reset request
      const emailValidation = validateEmail(formData.email);
      if (!emailValidation.isValid) {
        errors.email = emailValidation.message;
      }
    } else if (isPasswordReset) {
      // Validate password and confirmation for password reset
      const passwordValidation = validateSimplePassword(formData.password);
      if (!passwordValidation.isValid) {
        errors.password = passwordValidation.message;
      }

      const confirmValidation = validatePasswordConfirmation(formData.password, formData.confirmPassword);
      if (!confirmValidation.isValid) {
        errors.confirmPassword = confirmValidation.message;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle password reset request
  const handleResetRequest = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await authService.requestPasswordReset(formData.email);
      
      setSuccess(
        'Password reset instructions have been sent to your email address. Please check your inbox and follow the instructions to reset your password.'
      );
      
      // Clear form
      setFormData({ email: '', password: '', confirmPassword: '' });
    } catch (err) {
      console.error('Error requesting password reset:', err);
      setError(err.response?.data?.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset with token
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await authService.resetPassword(token, formData.password);
      
      setSuccess('Your password has been successfully reset. You can now sign in with your new password.');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Error resetting password:', err);
      setError(err.response?.data?.message || 'Failed to reset password. The reset link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = isResetRequest ? handleResetRequest : handlePasswordReset;

  // Handle "Enter" key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="password-reset-container">
      <div className="password-reset-form">
        <div className="form-header">
          <div className="reset-icon">
            {isResetRequest ? '=' : '='}
          </div>
          <h2 className="form-title">
            {isResetRequest ? 'Reset Your Password' : 'Create New Password'}
          </h2>
          <p className="form-subtitle">
            {isResetRequest 
              ? 'Enter your email address and we\'ll send you a link to reset your password.'
              : 'Enter your new password below.'
            }
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="reset-form" noValidate>
          {isResetRequest ? (
            // Email input for reset request
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
                <span className="input-icon">=Á</span>
              </div>
              {formErrors.email && (
                <span className="form-error">{formErrors.email}</span>
              )}
            </div>
          ) : (
            // Password inputs for password reset
            <>
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  New Password *
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
                    placeholder="Enter your new password"
                    required
                    disabled={isLoading}
                    autoComplete="new-password"
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
                <div className="password-help">
                  <small>Password must be at least 6 characters long</small>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm New Password *
                </label>
                <div className="input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className={`form-input ${formErrors.confirmPassword ? 'error' : ''}`}
                    placeholder="Confirm your new password"
                    required
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="password-toggle"
                    tabIndex={-1}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? '=A' : '=H'}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <span className="form-error">{formErrors.confirmPassword}</span>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isLoading || (isResetRequest ? !formData.email : !formData.password || !formData.confirmPassword)}
          >
            {isLoading ? (
              <>
                <ButtonSpinner size="small" />
                {isResetRequest ? 'Sending...' : 'Resetting...'}
              </>
            ) : (
              isResetRequest ? 'Send Reset Link' : 'Reset Password'
            )}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="form-footer">
          <Link to="/login" className="back-link">
            ê Back to Sign In
          </Link>
        </div>

        {/* Additional Info */}
        {isResetRequest && (
          <div className="reset-info">
            <h4>Having trouble?</h4>
            <ul className="info-list">
              <li>Make sure you entered the correct email address</li>
              <li>Check your spam/junk folder</li>
              <li>The reset link will expire in 1 hour</li>
              <li>Contact support if you continue having issues</li>
            </ul>
          </div>
        )}

        {isPasswordReset && (
          <div className="reset-info">
            <div className="security-tips">
              <h4>Password Security Tips:</h4>
              <ul className="tips-list">
                <li>Use a combination of letters, numbers, and symbols</li>
                <li>Make it at least 8 characters long</li>
                <li>Don't use personal information</li>
                <li>Don't reuse passwords from other accounts</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordReset;