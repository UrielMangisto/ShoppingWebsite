// API Constants
export const API_BASE_URL = 'http://localhost:3000/api';

// Authentication
export const AUTH_TOKEN_KEY = 'authToken';
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

// Product Constants
export const PRODUCT_SORT_OPTIONS = {
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc',
  NEWEST: 'newest',
};

// Image Upload Constants
export const IMAGE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_DIMENSIONS: {
    width: 2000,
    height: 2000,
  },
};

// Pagination
export const ITEMS_PER_PAGE = 12;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Cart Constants
export const CART_ACTIONS = {
  ADD: 'add',
  REMOVE: 'remove',
  UPDATE: 'update',
  CLEAR: 'clear',
};

// Validation Constants
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_PATTERN: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PATTERN: /^\+?[\d\s-]{10,}$/,
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ADMIN: {
    DASHBOARD: '/admin',
    PRODUCTS: '/admin/products',
    ORDERS: '/admin/orders',
    USERS: '/admin/users',
    CATEGORIES: '/admin/categories',
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  CART: 'cart',
  THEME: 'theme',
  LANGUAGE: 'language',
};
