// src/pages/Profile.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import { validateProfileForm, validateResetPasswordForm } from '../utils/validation';
import { getInitials } from '../utils/helpers';
import Loading from '../components/common/Loading';

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  // Profile Form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  // Password Form
  const [passwordForm, setPasswordForm] = useState({
    email: user?.email || '',
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // ניקוי שגיאות
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // ניקוי שגיאות
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    // ולידציה
    const validation = validateProfileForm(profileForm);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess('');

    try {
      await userService.updateUser(user.id, profileForm);
      
      // עדכון המידע המקומי (בהנחה שיש לנו פונקציה לכך)
      // updateUserData(profileForm);
      
      setSuccess('הפרופיל עודכן בהצלחה!');
    } catch (error) {
      setErrors({ general: error.message || 'שגיאה בעדכון הפרופיל' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // ולידציה
    const validation = validateResetPasswordForm(passwordForm);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess('');

    try {
      await authService.resetPassword({
        email: passwordForm.email,
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });
      
      setSuccess('הסיסמה שונתה בהצלחה!');
      setPasswordForm({
        email: user?.email || '',
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    } catch (error) {
      setErrors({ general: error.message || 'שגיאה בשינוי סיסמה' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את החשבון? פעולה זו בלתי הפיכה!')) {
      return;
    }

    if (!window.confirm('זוהי הזדמנות אחרונה לבטל. האם אתה בטוח לחלוטין?')) {
      return;
    }

    setLoading(true);
    
    try {
      await userService.deleteUser(user.id);
      alert('החשבון נמחק בהצלחה');
      logout();
    } catch (error) {
      alert('שגיאה במחיקת החשבון: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: '👤 פרטים אישיים', count: null },
    { id: 'password', label: '🔒 שינוי סיסמה', count: null },
    { id: 'privacy', label: '🛡️ פרטיות ואבטחה', count: null }
  ];

  return (
    <div className="container py-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xl">
              {getInitials(user?.name)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                שלום, {user?.name}
              </h1>
              <p className="text-gray-600">{user?.email}</p>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                user?.role === 'admin' 
                  ? 'bg-warning-100 text-warning-800' 
                  : 'bg-primary-100 text-primary-800'
              }`}>
                {user?.role === 'admin' ? '👑 מנהל' : '👤 משתמש'}
              </span>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="alert alert-success mb-6">
            <p>{success}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="tabs">
            <div className="tabs-list border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setErrors({});
                    setSuccess('');
                  }}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                >
                  {tab.label}
                  {tab.count && (
                    <span className="mr-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    עדכון פרטים אישיים
                  </h2>

                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    {errors.general && (
                      <div className="alert alert-error">
                        <p>{errors.general}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-group">
                        <label htmlFor="name" className="form-label required">
                          שם מלא
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={profileForm.name}
                          onChange={handleProfileChange}
                          className={`form-input ${errors.name ? 'error' : ''}`}
                          required
                        />
                        {errors.name && (
                          <div className="form-error">
                            {errors.name.map((error, index) => (
                              <p key={index}>{error}</p>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="email" className="form-label required">
                          כתובת אימייל
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={profileForm.email}
                          onChange={handleProfileChange}
                          className={`form-input ${errors.email ? 'error' : ''}`}
                          required
                        />
                        {errors.email && (
                          <div className="form-error">
                            {errors.email.map((error, index) => (
                              <p key={index}>{error}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileForm({
                            name: user?.name || '',
                            email: user?.email || ''
                          });
                          setErrors({});
                        }}
                        className="btn btn-outline"
                      >
                        ביטול
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                      >
                        {loading ? 'שומר...' : 'שמור שינויים'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    שינוי סיסמה
                  </h2>

                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    {errors.general && (
                      <div className="alert alert-error">
                        <p>{errors.general}</p>
                      </div>
                    )}

                    <div className="form-group">
                      <label htmlFor="oldPassword" className="form-label required">
                        סיסמה נוכחית
                      </label>
                      <input
                        id="oldPassword"
                        name="oldPassword"
                        type="password"
                        value={passwordForm.oldPassword}
                        onChange={handlePasswordChange}
                        className={`form-input ${errors.oldPassword ? 'error' : ''}`}
                        required
                      />
                      {errors.oldPassword && (
                        <div className="form-error">
                          {errors.oldPassword.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-group">
                        <label htmlFor="newPassword" className="form-label required">
                          סיסמה חדשה
                        </label>
                        <input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          className={`form-input ${errors.newPassword ? 'error' : ''}`}
                          required
                        />
                        {errors.newPassword && (
                          <div className="form-error">
                            {errors.newPassword.map((error, index) => (
                              <p key={index}>{error}</p>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="confirmNewPassword" className="form-label required">
                          אישור סיסמה חדשה
                        </label>
                        <input
                          id="confirmNewPassword"
                          name="confirmNewPassword"
                          type="password"
                          value={passwordForm.confirmNewPassword}
                          onChange={handlePasswordChange}
                          className={`form-input ${errors.confirmNewPassword ? 'error' : ''}`}
                          required
                        />
                        {errors.confirmNewPassword && (
                          <div className="form-error">
                            {errors.confirmNewPassword.map((error, index) => (
                              <p key={index}>{error}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                      <h4 className="font-medium text-primary-800 mb-2">
                        דרישות לסיסמה חדשה:
                      </h4>
                      <ul className="text-sm text-primary-700 space-y-1">
                        <li>• לפחות 8 תווים</li>
                        <li>• אות גדולה ואות קטנה באנגלית</li>
                        <li>• לפחות ספרה אחת</li>
                        <li>• מומלץ להוסיף תו מיוחד</li>
                      </ul>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setPasswordForm({
                            email: user?.email || '',
                            oldPassword: '',
                            newPassword: '',
                            confirmNewPassword: ''
                          });
                          setErrors({});
                        }}
                        className="btn btn-outline"
                      >
                        ביטול
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                      >
                        {loading ? 'משנה סיסמה...' : 'שנה סיסמה'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    פרטיות ואבטחה
                  </h2>

                  <div className="space-y-6">
                    {/* Account Info */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">
                        מידע על החשבון
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">תאריך הצטרפות:</span>
                          <span>זמין בקרוב</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">התחברות אחרונה:</span>
                          <span>זמין בקרוב</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">סטטוס חשבון:</span>
                          <span className="text-success-600">פעיל</span>
                        </div>
                      </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">
                        הגדרות פרטיות
                      </h3>

                      <div className="space-y-3">
                        <label className="form-checkbox">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="form-checkbox-input"
                          />
                          <span className="text-sm">
                            קבל עדכונים על מוצרים חדשים ומבצעים
                          </span>
                        </label>

                        <label className="form-checkbox">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="form-checkbox-input"
                          />
                          <span className="text-sm">
                            קבל התראות על סטטוס הזמנות
                          </span>
                        </label>

                        <label className="form-checkbox">
                          <input
                            type="checkbox"
                            className="form-checkbox-input"
                          />
                          <span className="text-sm">
                            הרשה גישה לנתונים סטטיסטיים (אנונימיים)
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Data Export */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="font-medium text-gray-900 mb-3">
                        ניהול נתונים
                      </h3>
                      <div className="space-y-3">
                        <button className="btn btn-outline">
                          📥 הורד את הנתונים שלי
                        </button>
                        <p className="text-sm text-gray-600">
                          הורד עותק של כל הנתונים האישיים שלך
                        </p>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="border-t border-gray-200 pt-6">
                      <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                        <h3 className="font-medium text-error-800 mb-3">
                          ⚠️ אזור מסוכן
                        </h3>
                        <p className="text-sm text-error-700 mb-4">
                          פעולות אלו בלתי הפיכות ועלולות לגרום לאובדן נתונים
                        </p>
                        <button
                          onClick={handleDeleteAccount}
                          disabled={loading}
                          className="btn btn-error"
                        >
                          {loading ? 'מוחק חשבון...' : '🗑️ מחק חשבון לצמיתות'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">📦 ההזמנות שלי</h3>
            <p className="text-sm text-gray-600 mb-3">
              צפה ועקוב אחר ההזמנות שלך
            </p>
            <a href="/orders" className="btn btn-outline btn-sm">
              צפה בהזמנות
            </a>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">🛒 עגלת קניות</h3>
            <p className="text-sm text-gray-600 mb-3">
              המשך עם הרכישות שהתחלת
            </p>
            <a href="/cart" className="btn btn-outline btn-sm">
              לעגלה
            </a>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">💬 שירות לקוחות</h3>
            <p className="text-sm text-gray-600 mb-3">
              נזדמן שאלה? אנחנו כאן לעזור
            </p>
            <a href="/contact" className="btn btn-outline btn-sm">
              צור קשר
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;