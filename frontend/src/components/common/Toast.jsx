// src/components/common/Toast.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { TOAST_TYPES } from '../../utils/constants';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = TOAST_TYPES.INFO, options = {}) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type,
      title: options.title,
      duration: options.duration ?? 5000,
      persistent: options.persistent ?? false,
      action: options.action
    };

    setToasts(prev => [...prev, toast]);

    // הסרה אוטומטית אם לא persistent
    if (!toast.persistent && toast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // פונקציות נוחות
  const success = useCallback((message, options) => 
    addToast(message, TOAST_TYPES.SUCCESS, options), [addToast]);
  
  const error = useCallback((message, options) => 
    addToast(message, TOAST_TYPES.ERROR, options), [addToast]);
  
  const warning = useCallback((message, options) => 
    addToast(message, TOAST_TYPES.WARNING, options), [addToast]);
  
  const info = useCallback((message, options) => 
    addToast(message, TOAST_TYPES.INFO, options), [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
    success,
    error,
    warning,
    info
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

const ToastContainer = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast }) => {
  const { removeToast } = useToast();

  const getToastIcon = (type) => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return '✅';
      case TOAST_TYPES.ERROR:
        return '❌';
      case TOAST_TYPES.WARNING:
        return '⚠️';
      case TOAST_TYPES.INFO:
      default:
        return 'ℹ️';
    }
  };

  const getToastClass = (type) => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return 'toast-success';
      case TOAST_TYPES.ERROR:
        return 'toast-error';
      case TOAST_TYPES.WARNING:
        return 'toast-warning';
      case TOAST_TYPES.INFO:
      default:
        return 'toast-info';
    }
  };

  const handleClose = () => {
    removeToast(toast.id);
  };

  const handleAction = () => {
    if (toast.action?.onClick) {
      toast.action.onClick();
    }
    if (toast.action?.closeOnAction !== false) {
      handleClose();
    }
  };

  return (
    <div className={`toast ${getToastClass(toast.type)}`}>
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0 mt-0.5">
          {getToastIcon(toast.type)}
        </span>
        
        <div className="toast-content">
          {toast.title && (
            <div className="toast-title">{toast.title}</div>
          )}
          <div className="text-sm">{toast.message}</div>
          
          {toast.action && (
            <button
              onClick={handleAction}
              className="mt-2 text-sm font-medium underline hover:no-underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>
      </div>

      <button
        onClick={handleClose}
        className="toast-close"
        aria-label="סגור הודעה"
      >
        ✕
      </button>
    </div>
  );
};

// Hook מותאם לפעולות נפוצות
export const useToastActions = () => {
  const toast = useToast();

  const showSuccess = (message, options = {}) => {
    return toast.success(message, {
      title: 'הצלחה!',
      ...options
    });
  };

  const showError = (message, options = {}) => {
    return toast.error(message, {
      title: 'שגיאה',
      duration: 7000, // שגיאות נשארות יותר זמן
      ...options
    });
  };

  const showWarning = (message, options = {}) => {
    return toast.warning(message, {
      title: 'אזהרה',
      duration: 6000,
      ...options
    });
  };

  const showInfo = (message, options = {}) => {
    return toast.info(message, options);
  };

  const showNetworkError = () => {
    return showError('בעיית חיבור לאינטרנט. אנא בדוק את החיבור ונסה שוב.', {
      persistent: true,
      action: {
        label: 'נסה שוב',
        onClick: () => window.location.reload()
      }
    });
  };

  const showLoadingError = (action = 'לטעון את הנתונים') => {
    return showError(`לא הצלחנו ${action}. אנא נסה שוב.`);
  };

  const showSaveSuccess = (item = 'הפריט') => {
    return showSuccess(`${item} נשמר בהצלחה!`);
  };

  const showDeleteSuccess = (item = 'הפריט') => {
    return showSuccess(`${item} נמחק בהצלחה!`);
  };

  const showAddToCartSuccess = (productName) => {
    return showSuccess(`${productName} נוסף לעגלה!`, {
      action: {
        label: 'לעגלה',
        onClick: () => window.location.href = '/cart'
      }
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showNetworkError,
    showLoadingError,
    showSaveSuccess,
    showDeleteSuccess,
    showAddToCartSuccess,
    ...toast
  };
};

export default ToastItem;