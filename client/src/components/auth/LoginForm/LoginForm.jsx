import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { validateLoginForm } from '../../../utils/validation'
import Loading from '../../common/Loading/Loading'
import './LoginForm.css'

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login, error: authError, clearError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Get the intended destination (where user was trying to go)
  const from = location.state?.from?.pathname || '/'

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
    const validation = validateLoginForm(formData.email, formData.password)
    if (!validation.isValid) {
      setErrors(validation.errors)
      setIsSubmitting(false)
      return
    }

    // Clear previous errors
    setErrors({})
    clearError()

    // Attempt login
    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      // Redirect to intended page or home
      navigate(from, { replace: true })
    }
    
    setIsSubmitting(false)
  }

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-header">
          <h2 className="form-title">Welcome Back</h2>
          <p className="form-subtitle">Sign in to your account</p>
        </div>

        {/* Global error message */}
        {authError && (
          <div className="error-message global-error">
            {authError}
          </div>
        )}

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
            placeholder="Enter your password"
            disabled={isSubmitting}
            autoComplete="current-password"
            required
          />
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}
        </div>

        {/* Forgot password link */}
        <div className="form-options">
          <Link to="/reset-password" className="forgot-password-link">
            Forgot your password?
          </Link>
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
            'Sign In'
          )}
        </button>

        {/* Register link */}
        <div className="form-footer">
          <p className="signup-prompt">
            Don't have an account?{' '}
            <Link to="/register" className="signup-link">
              Create one here
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default LoginForm