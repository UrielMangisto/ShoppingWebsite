import { post } from './api.js'

// Auth endpoints
export const login = async (email, password) => {
  const response = await post('/auth/login', { email, password })
  
  if (response.token) {
    localStorage.setItem('token', response.token)
  }
  
  return response
}

export const register = async (name, email, password, role = 'user') => {
  const response = await post('/auth/register', { name, email, password, role })
  
  if (response.token) {
    localStorage.setItem('token', response.token)
  }
  
  return response
}

export const resetPassword = async (email, newPassword) => {
  return await post('/auth/reset-password', { email, newPassword })
}

export const logout = () => {
  localStorage.removeItem('token')
  window.location.href = '/login'
}

// Token utilities
export const getToken = () => localStorage.getItem('token')

export const isAuthenticated = () => {
  const token = getToken()
  if (!token) return false
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export const getCurrentUser = () => {
  const token = getToken()
  if (!token) return null
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role
    }
  } catch {
    return null
  }
}

export const isAdmin = () => {
  const user = getCurrentUser()
  return user?.role === 'admin'
}

export const isUser = () => {
  const user = getCurrentUser()
  return user?.role === 'user'
}