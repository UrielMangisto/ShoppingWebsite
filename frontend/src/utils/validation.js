import { VALIDATION_RULES } from './constants';

// Email validation
export const isValidEmail = (email) => {
  return VALIDATION_RULES.EMAIL_PATTERN.test(email);
};

// Password validation
export const isValidPassword = (password) => {
  return (
    password.length >= VALIDATION_RULES.PASSWORD_MIN_LENGTH &&
    VALIDATION_RULES.PASSWORD_PATTERN.test(password)
  );
};

// Phone number validation
export const isValidPhone = (phone) => {
  return VALIDATION_RULES.PHONE_PATTERN.test(phone);
};

// Product validation
export const validateProduct = (product) => {
  const errors = {};

  if (!product.name?.trim()) {
    errors.name = 'Product name is required';
  }

  if (!product.price || product.price <= 0) {
    errors.price = 'Valid price is required';
  }

  if (!product.category_id) {
    errors.category_id = 'Category is required';
  }

  if (product.description?.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Image validation
export const validateImage = (file) => {
  const errors = [];

  if (!file) {
    errors.push('No file provided');
    return { isValid: false, errors };
  }

  // Check file size
  if (file.size > IMAGE_CONFIG.MAX_SIZE) {
    errors.push('File size exceeds 5MB limit');
  }

  // Check file type
  if (!IMAGE_CONFIG.ACCEPTED_TYPES.includes(file.type)) {
    errors.push('Invalid file type. Only JPG, PNG and WebP are allowed');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Order validation
export const validateOrder = (order) => {
  const errors = {};

  if (!order.shipping_address) {
    errors.shipping_address = 'Shipping address is required';
  }

  if (!order.items?.length) {
    errors.items = 'Order must contain at least one item';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Review validation
export const validateReview = (review) => {
  const errors = {};

  if (!review.rating || review.rating < 1 || review.rating > 5) {
    errors.rating = 'Rating must be between 1 and 5';
  }

  if (!review.comment?.trim()) {
    errors.comment = 'Review comment is required';
  }

  if (review.comment?.length > 500) {
    errors.comment = 'Review comment must be less than 500 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Category validation
export const validateCategory = (category) => {
  const errors = {};

  if (!category.name?.trim()) {
    errors.name = 'Category name is required';
  }

  if (category.name?.length > 50) {
    errors.name = 'Category name must be less than 50 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
