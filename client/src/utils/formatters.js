// Formatting utility functions

/**
 * Format price as currency
 */
export const formatPrice = (price, currency = 'USD', locale = 'en-US') => {
  if (price === null || price === undefined || isNaN(price)) return '$0.00';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

/**
 * Format number with thousands separator
 */
export const formatNumber = (number, locale = 'en-US') => {
  if (number === null || number === undefined || isNaN(number)) return '0';
  
  return new Intl.NumberFormat(locale).format(number);
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Format date in various formats
 */
export const formatDate = (date, format = 'short', locale = 'en-US') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  const options = {
    short: { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    },
    long: { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    },
    full: { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    },
    time: { 
      hour: '2-digit', 
      minute: '2-digit' 
    },
    datetime: { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    }
  };
  
  return new Intl.DateTimeFormat(locale, options[format] || options.short).format(dateObj);
};

/**
 * Format relative time (time ago)
 */
export const formatTimeAgo = (date, locale = 'en-US') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phoneNumber, format = 'US') => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  if (format === 'US') {
    // US format: (123) 456-7890
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    if (cleaned.length === 11 && cleaned[0] === '1') {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
  }
  
  // International format: +1 234 567 8900
  if (cleaned.length > 10) {
    return `+${cleaned.slice(0, -10)} ${cleaned.slice(-10, -7)} ${cleaned.slice(-7, -4)} ${cleaned.slice(-4)}`;
  }
  
  return phoneNumber; // Return original if can't format
};

/**
 * Format credit card number
 */
export const formatCreditCard = (cardNumber) => {
  if (!cardNumber) return '';
  
  // Remove all non-digit characters
  const cleaned = cardNumber.replace(/\D/g, '');
  
  // Add spaces every 4 digits
  return cleaned.replace(/(.{4})/g, '$1 ').trim();
};

/**
 * Mask credit card number (show only last 4 digits)
 */
export const maskCreditCard = (cardNumber) => {
  if (!cardNumber) return '';
  
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length < 4) return cardNumber;
  
  const lastFour = cleaned.slice(-4);
  const masked = '*'.repeat(cleaned.length - 4);
  
  return (masked + lastFour).replace(/(.{4})/g, '$1 ').trim();
};

/**
 * Format expiry date (MM/YY)
 */
export const formatExpiryDate = (expiry) => {
  if (!expiry) return '';
  
  // Remove all non-digit characters
  const cleaned = expiry.replace(/\D/g, '');
  
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  
  return cleaned;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  if (!bytes) return '';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format address for display
 */
export const formatAddress = (address) => {
  if (!address) return '';
  
  const {
    street,
    city,
    state,
    postalCode,
    country
  } = address;
  
  const parts = [];
  
  if (street) parts.push(street);
  if (city) parts.push(city);
  if (state) parts.push(state);
  if (postalCode) parts.push(postalCode);
  if (country && country !== 'United States') parts.push(country);
  
  return parts.join(', ');
};

/**
 * Format name (capitalize each word)
 */
export const formatName = (name) => {
  if (!name) return '';
  
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format text to title case
 */
export const formatTitleCase = (text) => {
  if (!text) return '';
  
  const articles = ['a', 'an', 'the'];
  const prepositions = ['at', 'by', 'for', 'in', 'of', 'on', 'to', 'up', 'and', 'as', 'but', 'or', 'nor'];
  
  return text
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      // Always capitalize first and last word
      if (index === 0 || index === text.split(' ').length - 1) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      
      // Don't capitalize articles and prepositions
      if (articles.includes(word) || prepositions.includes(word)) {
        return word;
      }
      
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

/**
 * Format URL to be user-friendly
 */
export const formatUrl = (url) => {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url);
    return urlObj.hostname + urlObj.pathname;
  } catch {
    return url;
  }
};

/**
 * Format social security number
 */
export const formatSSN = (ssn) => {
  if (!ssn) return '';
  
  const cleaned = ssn.replace(/\D/g, '');
  
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`;
  }
  
  return ssn;
};

/**
 * Mask sensitive information
 */
export const maskSensitiveData = (data, visibleChars = 4, maskChar = '*') => {
  if (!data || data.length <= visibleChars) return data;
  
  const visible = data.slice(-visibleChars);
  const masked = maskChar.repeat(data.length - visibleChars);
  
  return masked + visible;
};

/**
 * Format product SKU
 */
export const formatSKU = (sku) => {
  if (!sku) return '';
  
  return sku.toUpperCase().replace(/[^A-Z0-9]/g, '');
};

/**
 * Format order number
 */
export const formatOrderNumber = (orderNumber, prefix = 'ORD') => {
  if (!orderNumber) return '';
  
  const paddedNumber = orderNumber.toString().padStart(6, '0');
  return `${prefix}-${paddedNumber}`;
};

/**
 * Format discount percentage
 */
export const formatDiscount = (originalPrice, discountedPrice) => {
  if (!originalPrice || !discountedPrice || originalPrice <= discountedPrice) {
    return null;
  }
  
  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return Math.round(discount);
};

/**
 * Format stock status
 */
export const formatStockStatus = (stock) => {
  if (stock === 0) return 'Out of Stock';
  if (stock < 5) return 'Low Stock';
  if (stock < 10) return 'Limited Stock';
  return 'In Stock';
};

/**
 * Format rating (e.g., 4.5 stars)
 */
export const formatRating = (rating, maxRating = 5) => {
  if (!rating) return '0.0';
  
  return Number(rating).toFixed(1);
};

/**
 * Format review count
 */
export const formatReviewCount = (count) => {
  if (!count || count === 0) return 'No reviews';
  if (count === 1) return '1 review';
  if (count < 1000) return `${count} reviews`;
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K reviews`;
  return `${(count / 1000000).toFixed(1)}M reviews`;
};

/**
 * Format category breadcrumb
 */
export const formatBreadcrumb = (categories) => {
  if (!categories || !Array.isArray(categories)) return '';
  
  return categories.map(cat => formatTitleCase(cat)).join(' > ');
};

/**
 * Format search results count
 */
export const formatSearchResults = (count, query) => {
  if (!count || count === 0) {
    return query ? `No results found for "${query}"` : 'No results found';
  }
  
  const formattedCount = formatNumber(count);
  const resultText = count === 1 ? 'result' : 'results';
  
  if (query) {
    return `${formattedCount} ${resultText} for "${query}"`;
  }
  
  return `${formattedCount} ${resultText} found`;
};

/**
 * Format error messages for user display
 */
export const formatErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred';
  
  if (typeof error === 'string') return error;
  
  if (error.message) return error.message;
  
  if (error.response?.data?.message) return error.response.data.message;
  
  return 'An unexpected error occurred';
};

/**
 * Format success messages
 */
export const formatSuccessMessage = (action, item) => {
  const actions = {
    create: 'created',
    update: 'updated',
    delete: 'deleted',
    add: 'added',
    remove: 'removed'
  };
  
  const actionText = actions[action] || action;
  return `${formatTitleCase(item)} ${actionText} successfully`;
};

/**
 * Format loading messages
 */
export const formatLoadingMessage = (action, item) => {
  const actions = {
    load: 'Loading',
    save: 'Saving',
    delete: 'Deleting',
    update: 'Updating',
    create: 'Creating'
  };
  
  const actionText = actions[action] || action;
  return `${actionText} ${item}...`;
};

export default {
  formatPrice,
  formatNumber,
  formatPercentage,
  formatDate,
  formatTimeAgo,
  formatPhoneNumber,
  formatCreditCard,
  maskCreditCard,
  formatExpiryDate,
  formatFileSize,
  formatAddress,
  formatName,
  formatTitleCase,
  formatUrl,
  formatSSN,
  maskSensitiveData,
  formatSKU,
  formatOrderNumber,
  formatDiscount,
  formatStockStatus,
  formatRating,
  formatReviewCount,
  formatBreadcrumb,
  formatSearchResults,
  formatErrorMessage,
  formatSuccessMessage,
  formatLoadingMessage
};