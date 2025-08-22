// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateRegisterForm, validateField } from '../utils/validation';
import { getPasswordStrength } from '../utils/helpers';
import { Spinner } from '../components/common/Loading';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', checks: {} });

  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // בדיקת חוזק סיסמה
    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value));
    }

    // ניקוי שגיאה של השדה הנוכחי
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // ולידציה של השדה בעת איבוד פוקוס
    if (value.trim()) {
      let fieldValidation;
      
      switch (name) {
        case 'name':
          fieldValidation = validateField(value, {
            required: true,
            minLength: 2,
            maxLength: 100
          });
          break;
        case 'email':
          fieldValidation = validateField(value, {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            patternMessage: 'כתובת אימייל לא תקינה'
          });
          break;
        case 'password':
          fieldValidation = validateField(value, {
            required: true,
            minLength: 8
          });
          break;
        case 'confirmPassword':
          fieldValidation = validateField(value, {
            required: true,
            custom: (val) => val !== formData.password ? 'הסיסמאות אינן תואמות' : null
          });
          break;
        default:
          return;
      }

      if (!fieldValidation.isValid) {
        setErrors(prev => ({
          ...prev,
          [name]: fieldValidation.errors
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ולידציה מלאה
    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // ניקוי שגיאות
    setErrors({});

    // רישום
    const result = await register({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password
    });
    
    if (result.success) {
      // הצלחה - ניווט לדף הבית
      navigate('/', { replace: true });
    } else {
      // שגיאה
      setErrors({
        general: result.error || 'שגיאה ברישום'
      });
    }
  };

  const getPasswordStrengthColor = (score) => {
    switch (score) {
      case 0:
      case 1:
        return 'bg-error-500';
      case 2:
        return 'bg-warning-500';
      case 3:
        return 'bg-warning-400';
      case 4:
        return 'bg-success-500';
      case 5:
        return 'bg-success-600';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            יצירת חשבון חדש
          </h2>
          <p className="mt-2 text-gray-600">
            כבר יש לך חשבון?{' '}
            <Link 
              to="/login" 
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              התחבר כאן
            </Link>
          </p>
        </div>

        {/* Register Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* General Error */}
          {errors.general && (
            <div className="alert alert-error">
              <p className="alert-title">שגיאה ברישום</p>
              <p>{errors.general}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name" className="form-label required">
                שם מלא
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="הכנס את השם המלא שלך"
              />
              {errors.name && (
                <div className="form-error">
                  {errors.name.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </div>

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
                onBlur={handleBlur}
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="בחר סיסמה חזקה"
                />
                <button
                  type="button"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${getPasswordStrengthColor(passwordStrength.score)}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">
                      {passwordStrength.label}
                    </span>
                  </div>
                  
                  {/* Password Requirements */}
                  <div className="text-xs space-y-1">
                    <div className={`flex items-center gap-1 ${passwordStrength.checks.length ? 'text-success-600' : 'text-gray-400'}`}>
                      <span>{passwordStrength.checks.length ? '✓' : '○'}</span>
                      <span>לפחות 8 תווים</span>
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.checks.lowercase ? 'text-success-600' : 'text-gray-400'}`}>
                      <span>{passwordStrength.checks.lowercase ? '✓' : '○'}</span>
                      <span>אות קטנה באנגלית</span>
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.checks.uppercase ? 'text-success-600' : 'text-gray-400'}`}>
                      <span>{passwordStrength.checks.uppercase ? '✓' : '○'}</span>
                      <span>אות גדולה באנגלית</span>
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.checks.numbers ? 'text-success-600' : 'text-gray-400'}`}>
                      <span>{passwordStrength.checks.numbers ? '✓' : '○'}</span>
                      <span>לפחות ספרה אחת</span>
                    </div>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <div className="form-error mt-2">
                  {errors.password.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label required">
                אישור סיסמה
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="הכנס שוב את הסיסמה"
                />
                <button
                  type="button"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="mt-1">
                  {formData.password === formData.confirmPassword ? (
                    <div className="flex items-center gap-1 text-success-600 text-xs">
                      <span>✓</span>
                      <span>הסיסמאות תואמות</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-error-600 text-xs">
                      <span>✗</span>
                      <span>הסיסמאות אינן תואמות</span>
                    </div>
                  )}
                </div>
              )}
              
              {errors.confirmPassword && (
                <div className="form-error">
                  {errors.confirmPassword.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Terms and Privacy */}
          <div className="form-checkbox">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              אני מסכים ל
              <Link to="/terms" className="text-primary-600 hover:underline mx-1">
                תנאי השימוש
              </Link>
              ול
              <Link to="/privacy" className="text-primary-600 hover:underline mx-1">
                מדיניות הפרטיות
              </Link>
            </label>
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
                נרשם...
              </span>
            ) : (
              'צור חשבון'
            )}
          </button>

          {/* Benefits */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-primary-800 mb-2">
              היתרונות של הרשמה:
            </h3>
            <ul className="text-xs text-primary-700 space-y-1">
              <li>✓ מעקב אחר הזמנות</li>
              <li>✓ שמירת עגלת קניות</li>
              <li>✓ מבצעים והנחות בלעדיות</li>
              <li>✓ משלוח מהיר יותר</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;