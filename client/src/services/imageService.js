import { postFormData } from './api.js'

// Upload image (admin only)
export const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append('image', file)
  return await postFormData('/images', formData)
}

// Get image URL
export const getImageUrl = (imageId) => {
  return imageId ? `/api/images/${imageId}` : null
}

// Validate image file
export const validateImageFile = (file) => {
  const errors = []
  
  if (!file) {
    errors.push('File is required')
    return { isValid: false, errors }
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    errors.push('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed')
  }

  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    errors.push('File too large. Maximum size is 5MB')
  }

  return {
    isValid: errors.length === 0,
    errors
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

// Create preview URL
export const createPreviewUrl = (file) => {
  if (!file || !file.type.startsWith('image/')) return null
  
  try {
    return URL.createObjectURL(file)
  } catch {
    return null
  }
}

// Clean up preview URL
export const revokePreviewUrl = (url) => {
  if (url && url.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(url)
    } catch {
      // Ignore errors
    }
  }
}