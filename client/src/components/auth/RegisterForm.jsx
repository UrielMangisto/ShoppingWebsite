import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  validateEmail, 
  validateSimplePassword, 
  validatePasswordConfirmation,
  validateName 
} from '../../utils/validation';
import { ButtonSpinner } from '../common/Loading';
import './RegisterForm.css';

const RegisterForm = ({ onSuccess, className = '' }) => {
  const navigate = useNavigate();
  const { register, error, clearError, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

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

    // Validate name
    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
      errors.name = nameValidation.message;
    }

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

    // Validate password confirmation
    const confirmValidation = validatePasswordConfirmation(formData.password, formData.confirmPassword);
    if (!confirmValidation.isValid) {
      errors.confirmPassword = confirmValidation.message;
    }

    // Validate terms acceptance
    if (!acceptTerms) {
      errors.terms = 'You must accept the Terms of Service and Privacy Policy';
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

    const userData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password
    };

    const result = await register(userData);
    
    if (result.success) {
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirect to home page
        navigate('/', { replace: true });
      }
    }
  };

  // Handle "Enter" key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return formData.name.trim() &&
           formData.email.trim() &&
           formData.password &&
           formData.confirmPassword &&
           acceptTerms;
  };

  return (
    <div className={`register-form-container ${className}`}>
      <form onSubmit={handleSubmit} className="register-form" noValidate>
        <div className="form-header">
          <h2 className="form-title">Create Account</h2>
          <p className="form-subtitle">Join us today and start shopping!</p>
        </div>

        {/* Global Error Message */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Name Field */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Full Name *
          </label>
          <div className="input-wrapper">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className={`form-input ${formErrors.name ? 'error' : ''}`}
              placeholder="Enter your full name"
              required
              disabled={isLoading}
              autoComplete="name"
            />
            <span className="input-icon">=d</span>
          </div>
          {formErrors.name && (
            <span className="form-error">{formErrors.name}</span>
          )}
        </div>

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
              placeholder="Create a password"
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

        {/* Confirm Password Field */}
        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password *
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
              placeholder="Confirm your password"
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

        {/* Terms and Conditions */}
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              disabled={isLoading}
              className="checkbox-input"
              required
            />
            <span className="checkbox-custom"></span>
            <span className="checkbox-text">
              I agree to the{' '}
              <Link to="/terms" className="terms-link" target="_blank">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="terms-link" target="_blank">
                Privacy Policy
              </Link>
            </span>
          </label>
          {formErrors.terms && (
            <span className="form-error">{formErrors.terms}</span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={isLoading || !isFormValid()}
        >
          {isLoading ? (
            <>
              <ButtonSpinner size="small" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        {/* Divider */}
        <div className="form-divider">
          <span>or</span>
        </div>

        {/* Sign In Link */}
        <div className="form-footer">
          <p>
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="auth-link"
              tabIndex={isLoading ? -1 : 0}
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Additional Info */}
        <div className="register-benefits">
          <h4>Why join us?</h4>
          <ul className="benefits-list">
            <li>=š Free shipping on orders over $50</li>
            <li>= Secure and encrypted checkout</li>
            <li>=æ Easy returns within 30 days</li>
            <li>P Exclusive member discounts</li>
            <li>=ç First to know about new products</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;