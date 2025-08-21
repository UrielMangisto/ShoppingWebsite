import { get, post, put, del, postFormData } from './api.js'

// Get all products
export const getProducts = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  const endpoint = queryString ? `/products?${queryString}` : '/products'
  return await get(endpoint)
}

// Get single product
export const getProduct = async (id) => {
  return await get(`/products/${id}`)
}

// Search products
export const searchProducts = async (query) => {
  return await get(`/products/search?q=${encodeURIComponent(query)}`)
}

// Get recommended products
export const getRecommendedProducts = async () => {
  return await get('/products/recommend')
}

// Create product (admin only)
export const createProduct = async (productData) => {
  return await post('/products', productData)
}

// Create product with image (admin only)
export const createProductWithImage = async (productData, imageFile) => {
  const formData = new FormData()
  
  // Add product data
  Object.keys(productData).forEach(key => {
    if (productData[key] !== undefined && productData[key] !== '') {
      formData.append(key, productData[key])
    }
  })
  
  // Add image
  if (imageFile) {
    formData.append('image', imageFile)
  }
  
  return await postFormData('/products', formData)
}

// Update product (admin only)
export const updateProduct = async (id, productData) => {
  return await put(`/products/${id}`, productData)
}

// Update product with image (admin only)
export const updateProductWithImage = async (id, productData, imageFile) => {
  const formData = new FormData()
  
  // Add product data
  Object.keys(productData).forEach(key => {
    if (productData[key] !== undefined && productData[key] !== '') {
      formData.append(key, productData[key])
    }
  })
  
  // Add image if provided
  if (imageFile) {
    formData.append('image', imageFile)
  }
  
  return await postFormData(`/products/${id}`, formData)
}

// Delete product (admin only)
export const deleteProduct = async (id) => {
  return await del(`/products/${id}`)
}

// Utility functions
export const formatPrice = (price) => {
  if (price === undefined || price === null) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

export const getImageUrl = (imageId) => {
  return imageId ? `/api/images/${imageId}` : null
}