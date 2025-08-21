import { useState } from 'react'
import { Link } from 'react-router-dom'
import { validateEmail, validatePassword } from '../../../utils/validation'
import { post } from '../../../services/api'
import Loading from '../../common/Loading/Loading'
import './ResetPasswordForm.css'

const ResetPasswordForm = () => {
  const [step, setStep] = useState(1) // 1: Enter email, 2: Success message
  const [formData, setFormData] = useState({
    email: '',
    newPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

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
    if (serverError) {
      setServerError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setServerError('')

    // Validate email
    const emailValidation = validateEmail(formData.email)
    if (!emailValidation.isValid) {
      setErrors({ email: emailValidation.error })
      setIsSubmitting(false)
      return
    }

    // Validate password
    const passwordValidation = validatePassword(formData.newPassword)
    if (!passwordValidation.isValid) {
      setErrors({ newPassword: passwordValidation.error })
      setIsSubmitting(false)
      return
    }

    // Clear previous errors
    setErrors({})

    try {
      // Call the reset password API
      await post('/auth/reset-password', {
        email: formData.email,
        newPassword: formData.newPassword
      })

      // Show success message
      setStep(2)
    } catch (error) {
      setServerError(error.message || 'Failed to reset password. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Step 1: Reset password form
  if (step === 1) {
    return (
      <div className="reset-password-form-container">
        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-header">
            <h2 className="form-title">Reset Password</h2>
            <p className="form-subtitle">
              Enter your email and new password to reset your account
            </p>
          </div>

          {/* Global error message */}
          {serverError && (
            <div className="error-message global-error">
              {serverError}
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
              placeholder="Enter your email address"
              disabled={isSubmitting}
              autoComplete="email"
              required
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          {/* New Password field */}
          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`form-input ${errors.newPassword ? 'error' : ''}`}
              placeholder="Enter your new password"
              disabled={isSubmitting}
              autoComplete="new-password"
              required
            />
            {errors.newPassword && (
              <span className="error-message">{errors.newPassword}</span>
            )}
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
              'Reset Password'
            )}
          </button>

          {/* Back to login link */}
          <div className="form-footer">
            <p className="back-prompt">
              Remember your password?{' '}
              <Link to="/login" className="back-link">
                Back to login
              </Link>
            </p>
          </div>
        </form>
      </div>
    )
  }

  // Step 2: Success message
  return (
    <div className="reset-password-form-container">
      <div className="reset-password-success">
        <div className="success-header">
          <div className="success-icon">✅</div>
          <h2 className="success-title">Password Reset Successfully</h2>
          <p className="success-subtitle">
            Your password has been updated successfully.
          </p>
        </div>

        <div className="success-content">
          <p className="success-message">
            You can now log in with your new password.
          </p>
        </div>

        <div className="success-actions">
          <Link to="/login" className="login-button">
            Go to Login
          </Link>
          <Link to="/" className="home-button">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordForm