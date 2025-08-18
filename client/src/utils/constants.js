// Application Constants

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  PRODUCTS: {
    GET_ALL: '/products',
    GET_BY_ID: (id) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
  },
  CART: {
    GET: '/cart',
    ADD: '/cart',
    UPDATE: (id) => `/cart/${id}`,
    DELETE: (id) => `/cart/${id}`,
  },
  ORDERS: {
    CREATE: '/orders',
    GET_MY_ORDERS: '/orders',
    GET_BY_ID: (id) => `/orders/${id}`,
    GET_ALL_ADMIN: '/orders/all/admin',
  },
  USERS: {
    GET_ALL: '/users',
    GET_BY_ID: (id) => `/users/${id}`,
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
  },
  CATEGORIES: {
    GET_ALL: '/categories',
    CREATE: '/categories',
    UPDATE: (id) => `/categories/${id}`,
    DELETE: (id) => `/categories/${id}`,
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  CART: 'cart',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

// Product Categories (these might come from API, but useful for fallback)
export const DEFAULT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports',
  'Beauty',
  'Toys',
  'Automotive',
];

// Form Validation Rules
export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Please enter a valid email address',
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MESSAGE: 'Password must be at least 6 characters long',
  },
  NAME: {
    MIN_LENGTH: 2,
    MESSAGE: 'Name must be at least 2 characters long',
  },
  PHONE: {
    PATTERN: /^[\+]?[1-9][\d]{0,15}$/,
    MESSAGE: 'Please enter a valid phone number',
  },
};

// File Upload Constraints
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif'],
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 48],
  MAX_PAGE_SIZE: 100,
};

// Search
export const SEARCH = {
  MIN_QUERY_LENGTH: 2,
  DEBOUNCE_DELAY: 300, // milliseconds
};

// Price Formatting
export const CURRENCY = {
  CODE: 'USD',
  SYMBOL: '$',
  LOCALE: 'en-US',
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
  INPUT: 'YYYY-MM-DD',
  API: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
};

// Toast/Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Toast/Notification Duration
export const NOTIFICATION_DURATION = {
  SHORT: 3000,  // 3 seconds
  MEDIUM: 5000, // 5 seconds
  LONG: 8000,   // 8 seconds
};

// Sort Options for Products
export const PRODUCT_SORT_OPTIONS = [
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'created_desc', label: 'Newest First' },
  { value: 'created_asc', label: 'Oldest First' },
];

// Price Range Filters
export const PRICE_RANGES = [
  { min: 0, max: 25, label: 'Under $25' },
  { min: 25, max: 50, label: '$25 - $50' },
  { min: 50, max: 100, label: '$50 - $100' },
  { min: 100, max: 200, label: '$100 - $200' },
  { min: 200, max: null, label: 'Over $200' },
];

// Rating Values
export const RATINGS = {
  MIN: 1,
  MAX: 5,
  LABELS: {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  },
};

// Breakpoints for Responsive Design
export const BREAKPOINTS = {
  XS: '480px',
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
};

// Z-Index Values
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1010,
  FIXED: 1020,
  MODAL_BACKDROP: 1030,
  MODAL: 1040,
  POPOVER: 1050,
  TOOLTIP: 1060,
  TOAST: 1070,
};

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Internal server error. Please try again later.',
  VALIDATION: 'Please check your input and try again.',
  UNKNOWN: 'An unexpected error occurred.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in!',
  REGISTER: 'Account created successfully!',
  LOGOUT: 'Successfully logged out!',
  PASSWORD_RESET: 'Password reset email sent!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PRODUCT_ADDED: 'Product added to cart!',
  ORDER_PLACED: 'Order placed successfully!',
  ITEM_DELETED: 'Item deleted successfully!',
};

// Loading Messages
export const LOADING_MESSAGES = {
  DEFAULT: 'Loading...',
  PRODUCTS: 'Loading products...',
  CART: 'Loading cart...',
  ORDERS: 'Loading orders...',
  PROFILE: 'Loading profile...',
  SAVING: 'Saving...',
  DELETING: 'Deleting...',
  PROCESSING: 'Processing...',
};

// Routes
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id) => `/products/${id}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: (token) => `/reset-password/${token}`,
  ADMIN: '/admin',
};

export default {
  API_ENDPOINTS,
  STORAGE_KEYS,
  USER_ROLES,
  ORDER_STATUS,
  VALIDATION_RULES,
  FILE_UPLOAD,
  PAGINATION,
  CURRENCY,
  DATE_FORMATS,
  NOTIFICATION_TYPES,
  NOTIFICATION_DURATION,
  PRODUCT_SORT_OPTIONS,
  PRICE_RANGES,
  RATINGS,
  BREAKPOINTS,
  Z_INDEX,
  ANIMATION_DURATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_MESSAGES,
  ROUTES,
};