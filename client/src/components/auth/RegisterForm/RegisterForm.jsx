import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { validateRegisterForm } from '../../../utils/validation'
import Loading from '../../common/Loading/Loading'
import './RegisterForm.css'

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, error: authError, clearError } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    if (authError) {
      clearError()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    const validation = validateRegisterForm(
      formData.name,
      formData.email,
      formData.password,
      formData.confirmPassword
    )
    
    if (!validation.isValid) {
      setErrors(validation.errors)
      setIsSubmitting(false)
      return
    }

    // Clear previous errors
    setErrors({})
    clearError()

    // Attempt registration
    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      'user' // Default role
    )
    
    if (result.success) {
      // Redirect to home page after successful registration
      navigate('/')
    }
    
    setIsSubmitting(false)
  }

  return (
    <div className="register-form-container">
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-header">
          <h2 className="form-title">Create Account</h2>
          <p className="form-subtitle">Join our community today</p>
        </div>

        {/* Global error message */}
        {authError && (
          <div className="error-message global-error">
            {authError}
          </div>
        )}

        {/* Name field */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="Enter your full name"
            disabled={isSubmitting}
            autoComplete="name"
            required
          />
          {errors.name && (
            <span className="error-message">{errors.name}</span>
          )}
        </div>

        {/* Email field */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="Enter your email"
            disabled={isSubmitting}
            autoComplete="email"
            required
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        {/* Password field */}
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`form-input ${errors.password ? 'error' : ''}`}
            placeholder="Create a password"
            disabled={isSubmitting}
            autoComplete="new-password"
            required
          />
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}
        </div>

        {/* Confirm Password field */}
        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
            placeholder="Confirm your password"
            disabled={isSubmitting}
            autoComplete="new-password"
            required
          />
          {errors.confirmPassword && (
            <span className="error-message">{errors.confirmPassword}</span>
          )}
        </div>

        {/* Terms and conditions */}
        <div className="form-terms">
          <p className="terms-text">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="terms-link">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="terms-link">Privacy Policy</Link>
          </p>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loading size="small" message="" />
          ) : (
            'Create Account'
          )}
        </button>

        {/* Login link */}
        <div className="form-footer">
          <p className="signin-prompt">
            Already have an account?{' '}
            <Link to="/login" className="signin-link">
              Sign in here
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default RegisterForm