import { CURRENCY, DATE_FORMATS } from './constants'

// Format price in USD
export const formatPrice = (price) => {
  if (price === undefined || price === null || isNaN(price)) {
    return 'N/A'
  }
  
  return new Intl.NumberFormat(CURRENCY.LOCALE, {
    style: 'currency',
    currency: CURRENCY.CODE
  }).format(price)
}

// Format date with different options
export const formatDate = (dateString, format = 'SHORT') => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    const options = DATE_FORMATS[format] || DATE_FORMATS.SHORT
    
    return new Intl.DateTimeFormat(CURRENCY.LOCALE, options).format(date)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

// Format file size
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B'
  
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = (bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)
  
  return `${size} ${sizes[i]}`
}

// Format phone number (US format)
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return ''
  
  const cleaned = phoneNumber.replace(/\D/g, '')
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  
  return phoneNumber
}

// Format time ago (e.g., "2 hours ago")
export const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Unknown'
  
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffMinutes = Math.ceil(diffTime / (1000 * 60))
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const diffWeeks = Math.ceil(diffDays / 7)
    const diffMonths = Math.ceil(diffDays / 30)
    const diffYears = Math.ceil(diffDays / 365)
    
    if (diffMinutes < 60) {
      return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`
    } else if (diffHours < 24) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`
    } else if (diffDays < 7) {
      return diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`
    } else if (diffWeeks < 4) {
      return diffWeeks === 1 ? '1 week ago' : `${diffWeeks} weeks ago`
    } else if (diffMonths < 12) {
      return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`
    } else {
      return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`
    }
  } catch (error) {
    console.error('Error formatting time ago:', error)
    return 'Unknown'
  }
}

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
  if (value === undefined || value === null || isNaN(value)) {
    return 'N/A'
  }
  
  return `${(value * 100).toFixed(decimals)}%`
}

// Format number with commas
export const formatNumber = (number) => {
  if (number === undefined || number === null || isNaN(number)) {
    return 'N/A'
  }
  
  return new Intl.NumberFormat(CURRENCY.LOCALE).format(number)
}

// Capitalize first letter of each word
export const formatCapitalize = (text) => {
  if (!text || typeof text !== 'string') return ''
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Format text to title case
export const formatTitleCase = (text) => {
  if (!text || typeof text !== 'string') return ''
  
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (!text || typeof text !== 'string') return ''
  
  if (text.length <= maxLength) return text
  
  return text.substring(0, maxLength).trim() + '...'
}

// Format URL slug
export const formatSlug = (text) => {
  if (!text || typeof text !== 'string') return ''
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

// Format rating display
export const formatRating = (rating, maxRating = 5) => {
  if (rating === undefined || rating === null || isNaN(rating)) {
    return 'No rating'
  }
  
  return `${rating.toFixed(1)}/${maxRating}`
}

// Format stock status display
export const formatStockStatus = (stock) => {
  if (stock === undefined || stock === null) {
    return 'Unlimited'
  }
  
  if (stock === 0) {
    return 'Out of stock'
  }
  
  if (stock <= 5) {
    return `Low stock (${stock} left)`
  }
  
  return `In stock (${stock} available)`
}

// Format order status display
export const formatOrderStatus = (status) => {
  if (!status) return 'Unknown'
  
  const statusMap = {
    processing: 'Processing',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    completed: 'Completed'
  }
  
  return statusMap[status] || formatCapitalize(status)
}

// Format address (basic)
export const formatAddress = (address) => {
  if (!address) return ''
  
  const { street, city, state, zipCode, country } = address
  const parts = [street, city, state, zipCode, country].filter(Boolean)
  
  return parts.join(', ')
}

// Format credit card number (masked)
export const formatCreditCard = (cardNumber) => {
  if (!cardNumber) return ''
  
  const cleaned = cardNumber.replace(/\D/g, '')
  const masked = '**** **** **** ' + cleaned.slice(-4)
  
  return masked
}