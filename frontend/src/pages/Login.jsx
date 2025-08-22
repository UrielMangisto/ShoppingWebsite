// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateLoginForm } from '../utils/validation';
import { Spinner } from '../components/common/Loading';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // מיקום לחזרה אליו לאחר התחברות
  const redirectTo = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // ניקוי שגיאה של השדה הנוכחי
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ולידציה
    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // ניקוי שגיאות
    setErrors({});

    // התחברות
    const result = await login(formData);
    
    if (result.success) {
      // הצלחה - ניווט
      navigate(redirectTo, { replace: true });
    } else {
      // שגיאה
      setErrors({
        general: result.error || 'שגיאה בהתחברות'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            התחברות לחשבון
          </h2>
          <p className="mt-2 text-gray-600">
            או{' '}
            <Link 
              to="/register" 
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              צור חשבון חדש
            </Link>
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* General Error */}
          {errors.general && (
            <div className="alert alert-error">
              <p className="alert-title">שגיאה בהתחברות</p>
              <p>{errors.general}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label required">
                כתובת אימייל
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="הכנס את כתובת האימייל שלך"
              />
              {errors.email && (
                <div className="form-error">
                  {errors.email.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label required">
                סיסמה
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="הכנס את הסיסמה שלך"
                />
                <button
                  type="button"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <div className="form-error">
                  {errors.password.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="form-checkbox">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="text-sm text-gray-700">
                זכור אותי
              </label>
            </div>

            <Link
              to="/forgot-password"
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              שכחת סיסמה?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-full btn-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner size="small" />
                מתחבר...
              </span>
            ) : (
              'התחבר'
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">או</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              disabled
            >
              <span className="ml-2">📧</span>
              התחבר עם Google
            </button>
            
            <button
              type="button"
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              disabled
            >
              <span className="ml-2">📘</span>
              התחבר עם Facebook
            </button>
          </div>

          {/* Demo Account Info */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-primary-800 mb-2">
              חשבונות לדוגמה:
            </h3>
            <div className="text-xs text-primary-700 space-y-1">
              <p><strong>משתמש רגיל:</strong> alice@example.com / password123</p>
              <p><strong>מנהל:</strong> admin@example.com / admin123</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;