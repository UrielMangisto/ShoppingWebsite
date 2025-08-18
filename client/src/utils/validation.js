// Validation utility functions

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    isValid: emailRegex.test(email),
    message: 'Please enter a valid email address'
  };
};

/**
 * Validate password strength
 */
export const validatePassword = (password, minLength = 6) => {
  const errors = [];
  
  if (!password) {
    return {
      isValid: false,
      message: 'Password is required',
      errors: ['Password is required']
    };
  }
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    message: errors[0] || 'Password is valid',
    errors
  };
};

/**
 * Simple password validation (less strict)
 */
export const validateSimplePassword = (password, minLength = 6) => {
  if (!password) {
    return {
      isValid: false,
      message: 'Password is required'
    };
  }
  
  if (password.length < minLength) {
    return {
      isValid: false,
      message: `Password must be at least ${minLength} characters long`
    };
  }
  
  return {
    isValid: true,
    message: 'Password is valid'
  };
};

/**
 * Validate password confirmation
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (!confirmPassword) {
    return {
      isValid: false,
      message: 'Please confirm your password'
    };
  }
  
  if (password !== confirmPassword) {
    return {
      isValid: false,
      message: 'Passwords do not match'
    };
  }
  
  return {
    isValid: true,
    message: 'Passwords match'
  };
};

/**
 * Validate name
 */
export const validateName = (name, minLength = 2) => {
  if (!name || !name.trim()) {
    return {
      isValid: false,
      message: 'Name is required'
    };
  }
  
  if (name.trim().length < minLength) {
    return {
      isValid: false,
      message: `Name must be at least ${minLength} characters long`
    };
  }
  
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return {
      isValid: false,
      message: 'Name can only contain letters, spaces, hyphens, and apostrophes'
    };
  }
  
  return {
    isValid: true,
    message: 'Name is valid'
  };
};

/**
 * Validate phone number
 */
export const validatePhone = (phone) => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (!cleanPhone) {
    return {
      isValid: false,
      message: 'Phone number is required'
    };
  }
  
  if (cleanPhone.length < 10) {
    return {
      isValid: false,
      message: 'Phone number must be at least 10 digits'
    };
  }
  
  if (cleanPhone.length > 15) {
    return {
      isValid: false,
      message: 'Phone number cannot exceed 15 digits'
    };
  }
  
  return {
    isValid: true,
    message: 'Phone number is valid'
  };
};

/**
 * Validate address
 */
export const validateAddress = (address) => {
  if (!address || !address.trim()) {
    return {
      isValid: false,
      message: 'Address is required'
    };
  }
  
  if (address.trim().length < 5) {
    return {
      isValid: false,
      message: 'Address must be at least 5 characters long'
    };
  }
  
  return {
    isValid: true,
    message: 'Address is valid'
  };
};

/**
 * Validate postal code
 */
export const validatePostalCode = (postalCode, country = 'US') => {
  if (!postalCode || !postalCode.trim()) {
    return {
      isValid: false,
      message: 'Postal code is required'
    };
  }
  
  const patterns = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
    UK: /^[A-Za-z]{1,2}\d[A-Za-z\d]? \d[A-Za-z]{2}$/,
    FR: /^\d{5}$/,
    DE: /^\d{5}$/
  };
  
  const pattern = patterns[country] || patterns.US;
  
  if (!pattern.test(postalCode.trim())) {
    return {
      isValid: false,
      message: 'Please enter a valid postal code'
    };
  }
  
  return {
    isValid: true,
    message: 'Postal code is valid'
  };
};

/**
 * Validate credit card number
 */
export const validateCreditCard = (cardNumber) => {
  // Remove all non-digit characters
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  if (!cleanNumber) {
    return {
      isValid: false,
      message: 'Credit card number is required'
    };
  }
  
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return {
      isValid: false,
      message: 'Credit card number must be between 13 and 19 digits'
    };
  }
  
  // Luhn algorithm check
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i));
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  if (sum % 10 !== 0) {
    return {
      isValid: false,
      message: 'Please enter a valid credit card number'
    };
  }
  
  return {
    isValid: true,
    message: 'Credit card number is valid'
  };
};

/**
 * Validate expiry date (MM/YY format)
 */
export const validateExpiryDate = (expiryDate) => {
  if (!expiryDate) {
    return {
      isValid: false,
      message: 'Expiry date is required'
    };
  }
  
  const match = expiryDate.match(/^(\d{2})\/(\d{2})$/);
  if (!match) {
    return {
      isValid: false,
      message: 'Expiry date must be in MM/YY format'
    };
  }
  
  const month = parseInt(match[1]);
  const year = parseInt(match[2]) + 2000; // Convert YY to YYYY
  
  if (month < 1 || month > 12) {
    return {
      isValid: false,
      message: 'Month must be between 01 and 12'
    };
  }
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return {
      isValid: false,
      message: 'Card has expired'
    };
  }
  
  return {
    isValid: true,
    message: 'Expiry date is valid'
  };
};

/**
 * Validate CVV
 */
export const validateCVV = (cvv) => {
  if (!cvv) {
    return {
      isValid: false,
      message: 'CVV is required'
    };
  }
  
  if (!/^\d{3,4}$/.test(cvv)) {
    return {
      isValid: false,
      message: 'CVV must be 3 or 4 digits'
    };
  }
  
  return {
    isValid: true,
    message: 'CVV is valid'
  };
};

/**
 * Validate URL
 */
export const validateUrl = (url) => {
  if (!url) {
    return {
      isValid: false,
      message: 'URL is required'
    };
  }
  
  try {
    new URL(url);
    return {
      isValid: true,
      message: 'URL is valid'
    };
  } catch {
    return {
      isValid: false,
      message: 'Please enter a valid URL'
    };
  }
};

/**
 * Validate price
 */
export const validatePrice = (price, min = 0, max = 999999) => {
  const numPrice = parseFloat(price);
  
  if (isNaN(numPrice)) {
    return {
      isValid: false,
      message: 'Price must be a valid number'
    };
  }
  
  if (numPrice < min) {
    return {
      isValid: false,
      message: `Price must be at least $${min}`
    };
  }
  
  if (numPrice > max) {
    return {
      isValid: false,
      message: `Price cannot exceed $${max}`
    };
  }
  
  return {
    isValid: true,
    message: 'Price is valid'
  };
};

/**
 * Validate quantity
 */
export const validateQuantity = (quantity, min = 1, max = 999) => {
  const numQuantity = parseInt(quantity);
  
  if (isNaN(numQuantity)) {
    return {
      isValid: false,
      message: 'Quantity must be a valid number'
    };
  }
  
  if (numQuantity < min) {
    return {
      isValid: false,
      message: `Quantity must be at least ${min}`
    };
  }
  
  if (numQuantity > max) {
    return {
      isValid: false,
      message: `Quantity cannot exceed ${max}`
    };
  }
  
  return {
    isValid: true,
    message: 'Quantity is valid'
  };
};

/**
 * Validate file upload
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
  } = options;
  
  if (!file) {
    return {
      isValid: false,
      message: 'File is required'
    };
  }
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      message: `File size cannot exceed ${Math.round(maxSize / 1024 / 1024)}MB`
    };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      message: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }
  
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    return {
      isValid: false,
      message: `File extension not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`
    };
  }
  
  return {
    isValid: true,
    message: 'File is valid'
  };
};

/**
 * Validate form with multiple fields
 */
export const validateForm = (formData, rules) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = formData[field];
    
    if (rule.required && (!value || !value.toString().trim())) {
      errors[field] = `${field} is required`;
      isValid = false;
      return;
    }
    
    if (value && rule.validator) {
      const result = rule.validator(value);
      if (!result.isValid) {
        errors[field] = result.message;
        isValid = false;
      }
    }
  });
  
  return {
    isValid,
    errors
  };
};

/**
 * Real-time validation for form fields
 */
export const createFieldValidator = (validationRules) => {
  return (fieldName, value) => {
    const rule = validationRules[fieldName];
    if (!rule) return { isValid: true, message: '' };
    
    if (rule.required && (!value || !value.toString().trim())) {
      return {
        isValid: false,
        message: `${fieldName} is required`
      };
    }
    
    if (value && rule.validator) {
      return rule.validator(value);
    }
    
    return { isValid: true, message: '' };
  };
};

export default {
  validateEmail,
  validatePassword,
  validateSimplePassword,
  validatePasswordConfirmation,
  validateName,
  validatePhone,
  validateAddress,
  validatePostalCode,
  validateCreditCard,
  validateExpiryDate,
  validateCVV,
  validateUrl,
  validatePrice,
  validateQuantity,
  validateFile,
  validateForm,
  createFieldValidator
};