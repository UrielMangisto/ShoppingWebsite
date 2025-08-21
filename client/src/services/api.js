// API configuration and base fetch wrapper
const API_BASE_URL = '/api'

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('token')

// Base fetch wrapper with auth headers
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const token = getAuthToken()
  
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  }

  const response = await fetch(url, config)
  
  // Handle auth errors
  if (response.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
    throw new Error('Session expired')
  }
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }))
    throw new Error(error.message || 'Request failed')
  }
  
  return response.json()
}

// HTTP methods
export const get = (endpoint) => apiRequest(endpoint)

export const post = (endpoint, data) => apiRequest(endpoint, {
  method: 'POST',
  body: JSON.stringify(data)
})

export const put = (endpoint, data) => apiRequest(endpoint, {
  method: 'PUT', 
  body: JSON.stringify(data)
})

export const del = (endpoint) => apiRequest(endpoint, {
  method: 'DELETE'
})

// Form data upload (for images)
export const postFormData = async (endpoint, formData) => {
  const url = `${API_BASE_URL}${endpoint}`
  const token = getAuthToken()
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` })
      // Don't set Content-Type for FormData
    },
    body: formData
  })
  
  if (response.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
    throw new Error('Session expired')
  }
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Upload failed' }))
    throw new Error(error.message || 'Upload failed')
  }
  
  return response.json()
}