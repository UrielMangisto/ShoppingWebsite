// src/utils/constants.js

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    RESET_PASSWORD: '/auth/reset-password',
  },
  PRODUCTS: {
    BASE: '/products',
    REVIEWS: (id) => `/products/${id}/reviews`,
  },
  CART: {
    BASE: '/cart',
    ITEM: (id) => `/cart/${id}`,
  },
  ORDERS: {
    BASE: '/orders',
    ADMIN: '/orders/all/admin',
    DETAIL: (id) => `/orders/${id}`,
  },
  USERS: {
    BASE: '/users',
    DETAIL: (id) => `/users/${id}`,
  },
  CATEGORIES: {
    BASE: '/categories',
    DETAIL: (id) => `/categories/${id}`,
  },
};

// User roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// Order statuses
export const ORDER_STATUSES = {
  PENDING: 'pending',
  PAID: 'paid',
  SHIPPED: 'shipped',
  CANCELLED: 'cancelled',
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUSES.PENDING]: 'ממתין לתשלום',
  [ORDER_STATUSES.PAID]: 'שולם',
  [ORDER_STATUSES.SHIPPED]: 'נשלח',
  [ORDER_STATUSES.CANCELLED]: 'בוטל',
};

// Sort options for products
export const PRODUCT_SORT_OPTIONS = {
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc',
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  RATING_DESC: 'rating_desc',
  CREATED_DESC: 'created_desc',
};

export const PRODUCT_SORT_LABELS = {
  [PRODUCT_SORT_OPTIONS.NAME_ASC]: 'שם (א-ת)',
  [PRODUCT_SORT_OPTIONS.NAME_DESC]: 'שם (ת-א)',
  [PRODUCT_SORT_OPTIONS.PRICE_ASC]: 'מחיר (נמוך לגבוה)',
  [PRODUCT_SORT_OPTIONS.PRICE_DESC]: 'מחיר (גבוה לנמוך)',
  [PRODUCT_SORT_OPTIONS.RATING_DESC]: 'דירוג גבוה',
  [PRODUCT_SORT_OPTIONS.CREATED_DESC]: 'חדשים ביותר',
};

// Form validation
export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'כתובת אימייל לא תקינה',
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MESSAGE: 'סיסמה חייבת להכיל לפחות 8 תווים',
  },
  NAME: {
    MIN_LENGTH: 2,
    MESSAGE: 'שם חייב להכיל לפחות 2 תווים',
  },
  PRICE: {
    MIN: 0,
    MESSAGE: 'מחיר חייב להיות חיובי',
  },
  STOCK: {
    MIN: 0,
    MESSAGE: 'מלאי חייב להיות חיובי',
  },
  RATING: {
    MIN: 1,
    MAX: 5,
    MESSAGE: 'דירוג חייב להיות בין 1 ל-5',
  },
};

// File upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif'],
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  DEFAULT_ADMIN_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  CART: 'cart',
  RECENT_SEARCHES: 'recentSearches',
  RECENTLY_VIEWED: 'recentlyViewed',
};

// Theme options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  MOBILE: '768px',
  TABLET: '1024px',
  DESKTOP: '1200px',
};

// Toast message types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Default messages
export const MESSAGES = {
  LOADING: 'טוען...',
  ERROR: {
    GENERIC: 'אירעה שגיאה. אנא נסה שוב.',
    NETWORK: 'שגיאת רשת. בדוק את החיבור לאינטרנט.',
    NOT_FOUND: 'הפריט לא נמצא.',
    UNAUTHORIZED: 'אין לך הרשאה לפעולה זו.',
    FORBIDDEN: 'הגישה נדחתה.',
  },
  SUCCESS: {
    LOGIN: 'התחברת בהצלחה!',
    REGISTER: 'נרשמת בהצלחה!',
    LOGOUT: 'התנתקת בהצלחה!',
    UPDATE: 'עודכן בהצלחה!',
    DELETE: 'נמחק בהצלחה!',
    ADD_TO_CART: 'נוסף לעגלה!',
    ORDER_CREATED: 'ההזמנה נוצרה בהצלחה!',
  },
  CONFIRM: {
    DELETE: 'האם אתה בטוח שברצונך למחוק פריט זה?',
    LOGOUT: 'האם אתה בטוח שברצונך להתנתק?',
    CLEAR_CART: 'האם אתה בטוח שברצונך לנקות את העגלה?',
  },
};

// Navigation links
export const NAV_LINKS = {
  PUBLIC: [
    { path: '/', label: 'בית', key: 'home' },
    { path: '/products', label: 'מוצרים', key: 'products' },
  ],
  AUTHENTICATED: [
    { path: '/profile', label: 'פרופיל', key: 'profile' },
    { path: '/orders', label: 'הזמנות', key: 'orders' },
    { path: '/cart', label: 'עגלה', key: 'cart' },
  ],
  ADMIN: [
    { path: '/admin', label: 'ניהול', key: 'admin' },
    { path: '/admin/products', label: 'ניהול מוצרים', key: 'admin-products' },
    { path: '/admin/users', label: 'ניהול משתמשים', key: 'admin-users' },
    { path: '/admin/orders', label: 'ניהול הזמנות', key: 'admin-orders' },
  ],
};