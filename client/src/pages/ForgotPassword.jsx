import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // TODO: Replace with your actual API call
      // const response = await forgotPasswordAPI(email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('If an account with that email exists, we\'ve sent you a password reset link.');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <div className="page-header">
          <h1 className="page-title">Forgot Password</h1>
          <p className="page-subtitle">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="fade-in">
          {error && (
            <div className="error-container">
              <p className="error-message">{error}</p>
            </div>
          )}

          {message && (
            <div className="success-container">
              <p className="success-message">{message}</p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="btn btn-primary btn-full"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div className="form-footer">
            <p>
              Remember your password?{' '}
              <Link to="/login" className="link">
                Sign in
              </Link>
            </p>
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="link">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;