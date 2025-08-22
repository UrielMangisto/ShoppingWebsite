// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from './Loading';

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  requireAdmin = false,
  redirectTo = '/login',
  fallback = null
}) => {
  const { isAuthenticated, loading, isAdmin, user } = useAuth();
  const location = useLocation();

  // מצב טעינה
  if (loading) {
    return fallback || <Loading fullScreen text="מאמת הרשאות..." />;
  }

  // בדיקה אם נדרש אימות והמשתמש לא מחובר
  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // בדיקה אם נדרשות הרשאות אדמין והמשתמש אינו אדמין
  if (requireAdmin && !isAdmin()) {
    return (
      <div className="container py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            גישה נדחתה
          </h2>
          <p className="text-gray-600 mb-6">
            אין לך הרשאות לצפות בדף זה. דף זה מיועד למנהלי המערכת בלבד.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => window.history.back()}
              className="btn btn-outline btn-full"
            >
              ← חזור לדף הקודם
            </button>
            <Navigate to="/" replace />
          </div>
        </div>
      </div>
    );
  }

  // בדיקה אם המשתמש מחובר ומנסה לגשת לדפי התחברות/רישום
  if (isAuthenticated && !requireAuth && 
      (location.pathname === '/login' || location.pathname === '/register')) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// רכיב מיוחד למשתמשים לא מחוברים
export const GuestOnlyRoute = ({ children, redirectTo = '/' }) => {
  return (
    <ProtectedRoute 
      requireAuth={false}
      redirectTo={redirectTo}
    >
      {children}
    </ProtectedRoute>
  );
};

// רכיב מיוחד לאדמינים
export const AdminOnlyRoute = ({ children, fallback = null }) => {
  return (
    <ProtectedRoute 
      requireAuth={true}
      requireAdmin={true}
      fallback={fallback}
    >
      {children}
    </ProtectedRoute>
  );
};

// רכיב לבדיקת הרשאות עם הודעה מותאמת אישית
export const ConditionalRoute = ({ 
  children, 
  condition, 
  fallback, 
  redirectTo 
}) => {
  if (redirectTo && !condition) {
    return <Navigate to={redirectTo} replace />;
  }
  
  if (!condition) {
    return fallback || (
      <div className="container py-8">
        <div className="empty-state">
          <div className="empty-state-icon">🔒</div>
          <h3 className="empty-state-title">אין הרשאה</h3>
          <p className="empty-state-description">
            אין לך הרשאה לצפות בתוכן זה
          </p>
        </div>
      </div>
    );
  }

  return children;
};

// Hook לבדיקת הרשאות
export const usePermissions = () => {
  const { isAuthenticated, isAdmin, user } = useAuth();

  const can = (permission) => {
    switch (permission) {
      case 'view-admin':
        return isAuthenticated && isAdmin();
      case 'edit-profile':
        return isAuthenticated;
      case 'view-orders':
        return isAuthenticated;
      case 'manage-products':
        return isAuthenticated && isAdmin();
      case 'manage-users':
        return isAuthenticated && isAdmin();
      case 'manage-orders':
        return isAuthenticated && isAdmin();
      default:
        return false;
    }
  };

  const canAccess = (resource, action = 'read') => {
    // לוגיקה מתקדמת יותר לבדיקת הרשאות
    return can(`${action}-${resource}`);
  };

  return {
    can,
    canAccess,
    isAuthenticated,
    isAdmin: isAdmin(),
    user
  };
};

export default ProtectedRoute;