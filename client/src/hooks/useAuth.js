import { useState, useEffect } from 'react'
import { useAuth as useAuthContext } from '../context/AuthContext'
import * as authService from '../services/authService'

export const useAuth = () => {
  const authContext = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Login function
  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await authContext.login(email, password)
      if (result.success) {
        return { success: true }
      } else {
        setError(result.error)
        return { success: false, error: result.error }
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Register function
  const register = async (name, email, password, role = 'user') => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await authContext.register(name, email, password, role)
      if (result.success) {
        return { success: true }
      } else {
        setError(result.error)
        return { success: false, error: result.error }
      }
    } catch (err) {
      const errorMessage = err.message || 'Registration failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    authContext.logout()
    setError(null)
  }

  // Clear error
  const clearError = () => {
    setError(null)
    authContext.clearError()
  }

  return {
    // State from context
    user: authContext.user,
    isAuthenticated: authContext.isAuthenticated,
    token: authContext.token,
    
    // Loading and error state
    loading: loading || authContext.isLoading,
    error: error || authContext.error,
    
    // Actions
    login,
    register,
    logout,
    clearError,
    
    // Role checks
    isAdmin: authContext.isAdmin,
    isUser: authContext.isUser
  }
}