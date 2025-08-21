import { VALIDATION_RULES, IMAGE_CONFIG, RATING } from './constants'

// Email validation
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, error: 'Email is required' }
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }
  
  return { isValid: true }
}

// Password validation
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'Password is required' }
  }
  
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters long` 
    }
  }
  
  return { isValid: true }
}

// Name validation
export const validateName = (name) => {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'Name is required' }
  }
  
  const trimmedName = name.trim()
  
  if (trimmedName.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `Name must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters long` 
    }
  }
  
  if (trimmedName.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
    return { 
      isValid: false, 
      error: `Name must be less than ${VALIDATION_RULES.NAME_MAX_LENGTH} characters` 
    }
  }
  
  return { isValid: true }
}

// Required field validation
export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { isValid: false, error: `${fieldName} is required` }
  }
  
  return { isValid: true }
}

// Number validation
export const validateNumber = (value, min = null, max = null, fieldName = 'Value') => {
  if (value === undefined || value === null || value === '') {
    return { isValid: false, error: `${fieldName} is required` }
  }
  
  const numValue = Number(value)
  
  if (isNaN(numValue)) {
    return { isValid: false, error: `${fieldName} must be a valid number` }
  }
  
  if (min !== null && numValue < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min}` }
  }
  
  if (max !== null && numValue > max) {
    return { isValid: false, error: `${fieldName} must be at most ${max}` }
  }
  
  return { isValid: true }
}

// Price validation
export const validatePrice = (price) => {
  const numberValidation = validateNumber(price, 0.01, null, 'Price')
  
  if (!numberValidation.isValid) {
    return numberValidation
  }
  
  return { isValid: true }
}

// Stock validation
export const validateStock = (stock) => {
  if (stock === undefined || stock === null || stock === '') {
    return { isValid: true } // Stock is optional
  }
  
  return validateNumber(stock, 0, null, 'Stock')
}

// Rating validation
export const validateRating = (rating) => {
  const numberValidation = validateNumber(rating, RATING.MIN, RATING.MAX, 'Rating')
  
  if (!numberValidation.isValid) {
    return numberValidation
  }
  
  if (!Number.isInteger(Number(rating))) {
    return { isValid: false, error: 'Rating must be a whole number' }
  }
  
  return { isValid: true }
}

// Comment validation
export const validateComment = (comment, required = false) => {
  if (!comment || !comment.trim()) {
    if (required) {
      return { isValid: false, error: 'Comment is required' }
    }
    return { isValid: true } // Optional comment
  }
  
  const trimmedComment = comment.trim()
  
  if (trimmedComment.length < VALIDATION_RULES.COMMENT_MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `Comment must be at least ${VALIDATION_RULES.COMMENT_MIN_LENGTH} characters long` 
    }
  }
  
  if (trimmedComment.length > VALIDATION_RULES.COMMENT_MAX_LENGTH) {
    return { 
      isValid: false, 
      error: `Comment must be less than ${VALIDATION_RULES.COMMENT_MAX_LENGTH} characters` 
    }
  }
  
  return { isValid: true }
}

// Image file validation
export const validateImageFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'Please select an image file' }
  }
  
  // Check file type
  if (!IMAGE_CONFIG.ALLOWED_TYPES.includes(file.type)) {
    return { 
      isValid: false, 
      error: `Invalid file type. Allowed types: ${IMAGE_CONFIG.ALLOWED_EXTENSIONS.join(', ')}` 
    }
  }
  
  // Check file size
  if (file.size > IMAGE_CONFIG.MAX_SIZE) {
    const maxSizeMB = IMAGE_CONFIG.MAX_SIZE / (1024 * 1024)
    return { 
      isValid: false, 
      error: `File size too large. Maximum size: ${maxSizeMB}MB` 
    }
  }
  
  return { isValid: true }
}

// Category name validation
export const validateCategoryName = (name) => {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'Category name is required' }
  }
  
  const trimmedName = name.trim()
  
  if (trimmedName.length < VALIDATION_RULES.CATEGORY_NAME_MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `Category name must be at least ${VALIDATION_RULES.CATEGORY_NAME_MIN_LENGTH} characters long` 
    }
  }
  
  if (trimmedName.length > VALIDATION_RULES.CATEGORY_NAME_MAX_LENGTH) {
    return { 
      isValid: false, 
      error: `Category name must be less than ${VALIDATION_RULES.CATEGORY_NAME_MAX_LENGTH} characters` 
    }
  }
  
  return { isValid: true }
}

// Product name validation
export const validateProductName = (name) => {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'Product name is required' }
  }
  
  const trimmedName = name.trim()
  
  if (trimmedName.length < VALIDATION_RULES.PRODUCT_NAME_MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `Product name must be at least ${VALIDATION_RULES.PRODUCT_NAME_MIN_LENGTH} characters long` 
    }
  }
  
  if (trimmedName.length > VALIDATION_RULES.PRODUCT_NAME_MAX_LENGTH) {
    return { 
      isValid: false, 
      error: `Product name must be less than ${VALIDATION_RULES.PRODUCT_NAME_MAX_LENGTH} characters` 
    }
  }
  
  return { isValid: true }
}

// Description validation
export const validateDescription = (description, required = true) => {
  if (!description || !description.trim()) {
    if (required) {
      return { isValid: false, error: 'Description is required' }
    }
    return { isValid: true }
  }
  
  const trimmedDescription = description.trim()
  
  if (trimmedDescription.length > VALIDATION_RULES.DESCRIPTION_MAX_LENGTH) {
    return { 
      isValid: false, 
      error: `Description must be less than ${VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} characters` 
    }
  }
  
  return { isValid: true }
}

// Form validation helper
export const validateForm = (fields, validationRules) => {
  const errors = {}
  let isValid = true
  
  Object.keys(validationRules).forEach(fieldName => {
    const value = fields[fieldName]
    const validator = validationRules[fieldName]
    
    if (typeof validator === 'function') {
      const result = validator(value)
      if (!result.isValid) {
        errors[fieldName] = result.error
        isValid = false
      }
    }
  })
  
  return { isValid, errors }
}

// Login form validation
export const validateLoginForm = (email, password) => {
  return validateForm(
    { email, password },
    {
      email: validateEmail,
      password: validatePassword
    }
  )
}

// Register form validation
export const validateRegisterForm = (name, email, password, confirmPassword) => {
  const baseValidation = validateForm(
    { name, email, password },
    {
      name: validateName,
      email: validateEmail,
      password: validatePassword
    }
  )
  
  // Check password confirmation
  if (password !== confirmPassword) {
    baseValidation.isValid = false
    baseValidation.errors.confirmPassword = 'Passwords do not match'
  }
  
  return baseValidation
}

// Product form validation
export const validateProductForm = (name, description, price, stock) => {
  return validateForm(
    { name, description, price, stock },
    {
      name: validateProductName,
      description: (desc) => validateDescription(desc, true),
      price: validatePrice,
      stock: validateStock
    }
  )
}