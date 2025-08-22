// src/utils/helpers.js
import { ORDER_STATUS_LABELS, PRODUCT_SORT_LABELS } from './constants';

// פורמט מחיר
export const formatPrice = (price) => {
  if (price == null || isNaN(price)) return '₪0.00';
  return `₪${parseFloat(price).toFixed(2)}`;
};

// פורמט תאריך
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// פורמט תאריך קצר
export const formatDateShort = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleDateString('he-IL');
};

// חישוב זמן יחסי (לפני כמה זמן)
export const getRelativeTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'כעת';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `לפני ${diffInMinutes} דקות`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `לפני ${diffInHours} שעות`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `לפני ${diffInDays} ימים`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `לפני ${diffInMonths} חודשים`;
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `לפני ${diffInYears} שנים`;
};

// קיצור טקסט
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// קבלת תווית סטטוס הזמנה
export const getOrderStatusLabel = (status) => {
  return ORDER_STATUS_LABELS[status] || status;
};

// קבלת תווית מיון מוצרים
export const getSortLabel = (sortKey) => {
  return PRODUCT_SORT_LABELS[sortKey] || sortKey;
};

// יצירת initials מתוך שם
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// בדיקת תקינות אימייל
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// בדיקת חוזק סיסמה
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: 'חלשה מאוד' };
  
  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[^A-Za-z0-9]/.test(password)
  };
  
  score = Object.values(checks).filter(Boolean).length;
  
  const labels = {
    0: 'חלשה מאוד',
    1: 'חלשה מאוד',
    2: 'חלשה',
    3: 'בינונית',
    4: 'חזקה',
    5: 'חזקה מאוד'
  };
  
  return { 
    score, 
    label: labels[score],
    checks 
  };
};

// פורמט גודל קובץ
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// בדיקת תמיכה בסוג קובץ
export const isImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  return allowedTypes.includes(file.type);
};

// יצירת URL לתמונה מקובץ
export const createImageURL = (file) => {
  if (!file) return null;
  return URL.createObjectURL(file);
};

// ניקוי URL של תמונה
export const revokeImageURL = (url) => {
  if (url) {
    URL.revokeObjectURL(url);
  }
};

// דיבאונס - עיכוב ביצוע פונקציה
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// טרוטל - הגבלת תדירות ביצוע פונקציה
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// יצירת מזהה ייחודי
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// בדיקה אם הערך ריק
export const isEmpty = (value) => {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

// עיגול מספר לעשרוניות
export const roundToDecimals = (num, decimals = 2) => {
  return Math.round((num + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

// המרת פרמטרים לQuery String
export const objectToQueryString = (obj) => {
  return Object.entries(obj)
    .filter(([_, value]) => value != null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
};

// המרת Query String לאובייקט
export const queryStringToObject = (queryString) => {
  const params = new URLSearchParams(queryString);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
};

// בדיקת מכשיר מובייל
export const isMobile = () => {
  return window.innerWidth <= 768;
};

// בדיקת מכשיר טאבלט
export const isTablet = () => {
  return window.innerWidth > 768 && window.innerWidth <= 1024;
};

// בדיקת דסקטופ
export const isDesktop = () => {
  return window.innerWidth > 1024;
};

// scroll לאלמנט
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const top = element.offsetTop - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};

// scroll לחלק העליון של העמוד
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// העתקה ללוח
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Copy to clipboard failed:', error);
    return false;
  }
};