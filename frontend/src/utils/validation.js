// src/utils/validation.js
import { VALIDATION_RULES, FILE_UPLOAD } from './constants';

// ולידציה בסיסית לשדה
export const validateField = (value, rules = {}) => {
  const errors = [];

  // בדיקת חובה
  if (rules.required && (!value || value.toString().trim() === '')) {
    errors.push(rules.requiredMessage || 'שדה זה הוא חובה');
    return { isValid: false, errors };
  }

  // אם השדה ריק ולא חובה, הוא תקין
  if (!value || value.toString().trim() === '') {
    return { isValid: true, errors: [] };
  }

  // בדיקת אורך מינימלי
  if (rules.minLength && value.length < rules.minLength) {
    errors.push(rules.minLengthMessage || `חייב להכיל לפחות ${rules.minLength} תווים`);
  }

  // בדיקת אורך מקסימלי
  if (rules.maxLength && value.length > rules.maxLength) {
    errors.push(rules.maxLengthMessage || `חייב להכיל לכל היותר ${rules.maxLength} תווים`);
  }

  // בדיקת ערך מינימלי
  if (rules.min !== undefined && Number(value) < rules.min) {
    errors.push(rules.minMessage || `חייב להיות לפחות ${rules.min}`);
  }

  // בדיקת ערך מקסימלי
  if (rules.max !== undefined && Number(value) > rules.max) {
    errors.push(rules.maxMessage || `חייב להיות לכל היותר ${rules.max}`);
  }

  // בדיקת תבנית (regex)
  if (rules.pattern && !rules.pattern.test(value)) {
    errors.push(rules.patternMessage || 'פורמט לא תקין');
  }

  // בדיקות מותאמות אישית
  if (rules.custom && typeof rules.custom === 'function') {
    const customError = rules.custom(value);
    if (customError) {
      errors.push(customError);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// ולידציה לאימייל
export const validateEmail = (email) => {
  return validateField(email, {
    required: true,
    requiredMessage: 'כתובת אימייל היא חובה',
    pattern: VALIDATION_RULES.EMAIL.PATTERN,
    patternMessage: VALIDATION_RULES.EMAIL.MESSAGE
  });
};

// ולידציה לסיסמה
export const validatePassword = (password) => {
  return validateField(password, {
    required: true,
    requiredMessage: 'סיסמה היא חובה',
    minLength: VALIDATION_RULES.PASSWORD.MIN_LENGTH,
    minLengthMessage: VALIDATION_RULES.PASSWORD.MESSAGE
  });
};

// ולידציה לאישור סיסמה
export const validatePasswordConfirm = (password, confirmPassword) => {
  const passwordValidation = validatePassword(confirmPassword);
  
  if (!passwordValidation.isValid) {
    return passwordValidation;
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      errors: ['הסיסמאות אינן תואמות']
    };
  }

  return { isValid: true, errors: [] };
};

// ולידציה לשם
export const validateName = (name) => {
  return validateField(name, {
    required: true,
    requiredMessage: 'שם הוא חובה',
    minLength: VALIDATION_RULES.NAME.MIN_LENGTH,
    minLengthMessage: VALIDATION_RULES.NAME.MESSAGE,
    maxLength: 100,
    maxLengthMessage: 'שם חייב להיות קצר מ-100 תווים'
  });
};

// ולידציה למחיר
export const validatePrice = (price) => {
  return validateField(price, {
    required: true,
    requiredMessage: 'מחיר הוא חובה',
    min: VALIDATION_RULES.PRICE.MIN,
    minMessage: VALIDATION_RULES.PRICE.MESSAGE,
    custom: (value) => {
      if (isNaN(Number(value))) {
        return 'מחיר חייב להיות מספר';
      }
      return null;
    }
  });
};

// ולידציה למלאי
export const validateStock = (stock) => {
  return validateField(stock, {
    required: true,
    requiredMessage: 'מלאי הוא חובה',
    min: VALIDATION_RULES.STOCK.MIN,
    minMessage: VALIDATION_RULES.STOCK.MESSAGE,
    custom: (value) => {
      if (!Number.isInteger(Number(value))) {
        return 'מלאי חייב להיות מספר שלם';
      }
      return null;
    }
  });
};

// ולידציה לדירוג
export const validateRating = (rating) => {
  return validateField(rating, {
    required: true,
    requiredMessage: 'דירוג הוא חובה',
    min: VALIDATION_RULES.RATING.MIN,
    max: VALIDATION_RULES.RATING.MAX,
    minMessage: VALIDATION_RULES.RATING.MESSAGE,
    maxMessage: VALIDATION_RULES.RATING.MESSAGE,
    custom: (value) => {
      if (!Number.isInteger(Number(value))) {
        return 'דירוג חייב להיות מספר שלם';
      }
      return null;
    }
  });
};

// ולידציה לקובץ תמונה
export const validateImageFile = (file) => {
  const errors = [];

  if (!file) {
    return { isValid: true, errors: [] }; // תמונה אופציונלית
  }

  // בדיקת גודל קובץ
  if (file.size > FILE_UPLOAD.MAX_SIZE) {
    const maxSizeMB = FILE_UPLOAD.MAX_SIZE / (1024 * 1024);
    errors.push(`גודל הקובץ חייב להיות קטן מ-${maxSizeMB}MB`);
  }

  // בדיקת סוג קובץ
  if (!FILE_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
    errors.push('סוג הקובץ לא נתמך. נתמכים: JPG, PNG, GIF');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// ולידציה לטופס רישום
export const validateRegisterForm = (formData) => {
  const { name, email, password, confirmPassword } = formData;
  const errors = {};

  // ולידציה לשם
  const nameValidation = validateName(name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.errors;
  }

  // ולידציה לאימייל
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.errors;
  }

  // ולידציה לסיסמה
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors;
  }

  // ולידציה לאישור סיסמה
  const confirmPasswordValidation = validatePasswordConfirm(password, confirmPassword);
  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = confirmPasswordValidation.errors;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ולידציה לטופס התחברות
export const validateLoginForm = (formData) => {
  const { email, password } = formData;
  const errors = {};

  // ולידציה לאימייל
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.errors;
  }

  // ולידציה לסיסמה (רק בדיקה שלא ריק)
  const passwordValidation = validateField(password, {
    required: true,
    requiredMessage: 'סיסמה היא חובה'
  });
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ולידציה לטופס מוצר
export const validateProductForm = (formData) => {
  const { name, description, price, stock, category_id } = formData;
  const errors = {};

  // ולידציה לשם מוצר
  const nameValidation = validateField(name, {
    required: true,
    requiredMessage: 'שם המוצר הוא חובה',
    minLength: 2,
    minLengthMessage: 'שם המוצר חייב להכיל לפחות 2 תווים',
    maxLength: 100,
    maxLengthMessage: 'שם המוצר חייב להיות קצר מ-100 תווים'
  });
  if (!nameValidation.isValid) {
    errors.name = nameValidation.errors;
  }

  // ולידציה לתיאור (אופציונלי)
  if (description) {
    const descriptionValidation = validateField(description, {
      maxLength: 1000,
      maxLengthMessage: 'תיאור חייב להיות קצר מ-1000 תווים'
    });
    if (!descriptionValidation.isValid) {
      errors.description = descriptionValidation.errors;
    }
  }

  // ולידציה למחיר
  const priceValidation = validatePrice(price);
  if (!priceValidation.isValid) {
    errors.price = priceValidation.errors;
  }

  // ולידציה למלאי
  const stockValidation = validateStock(stock);
  if (!stockValidation.isValid) {
    errors.stock = stockValidation.errors;
  }

  // ולידציה לקטגוריה (אופציונלי)
  if (category_id && isNaN(Number(category_id))) {
    errors.category_id = ['קטגוריה לא תקינה'];
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ולידציה לטופס ביקורת
export const validateReviewForm = (formData) => {
  const { rating, comment } = formData;
  const errors = {};

  // ולידציה לדירוג
  const ratingValidation = validateRating(rating);
  if (!ratingValidation.isValid) {
    errors.rating = ratingValidation.errors;
  }

  // ולידציה לתגובה (אופציונלי)
  if (comment) {
    const commentValidation = validateField(comment, {
      maxLength: 500,
      maxLengthMessage: 'תגובה חייבת להיות קצרה מ-500 תווים'
    });
    if (!commentValidation.isValid) {
      errors.comment = commentValidation.errors;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ולידציה לטופס פרופיל משתמש
export const validateProfileForm = (formData) => {
  const { name, email } = formData;
  const errors = {};

  // ולידציה לשם
  const nameValidation = validateName(name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.errors;
  }

  // ולידציה לאימייל
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.errors;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ולידציה לטופס איפוס סיסמה
export const validateResetPasswordForm = (formData) => {
  const { email, oldPassword, newPassword, confirmNewPassword } = formData;
  const errors = {};

  // ולידציה לאימייל
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.errors;
  }

  // ולידציה לסיסמה ישנה
  const oldPasswordValidation = validateField(oldPassword, {
    required: true,
    requiredMessage: 'סיסמה נוכחית היא חובה'
  });
  if (!oldPasswordValidation.isValid) {
    errors.oldPassword = oldPasswordValidation.errors;
  }

  // ולידציה לסיסמה חדשה
  const newPasswordValidation = validatePassword(newPassword);
  if (!newPasswordValidation.isValid) {
    errors.newPassword = newPasswordValidation.errors;
  }

  // ולידציה לאישור סיסמה חדשה
  const confirmNewPasswordValidation = validatePasswordConfirm(newPassword, confirmNewPassword);
  if (!confirmNewPasswordValidation.isValid) {
    errors.confirmNewPassword = confirmNewPasswordValidation.errors;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};