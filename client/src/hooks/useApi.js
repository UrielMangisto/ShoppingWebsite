import { useState, useCallback } from 'react'

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  // Generic API call function
  const execute = useCallback(async (apiFunction, ...args) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await apiFunction(...args)
      setData(result)
      return { success: true, data: result }
    } catch (err) {
      const errorMessage = err.message || 'API request failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  // Execute without storing data (for actions like create, update, delete)
  const executeAction = useCallback(async (apiFunction, ...args) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await apiFunction(...args)
      return { success: true, data: result }
    } catch (err) {
      const errorMessage = err.message || 'Action failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Clear all state
  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setData(null)
  }, [])

  return {
    loading,
    error,
    data,
    execute,
    executeAction,
    clearError,
    reset
  }
}

// Hook for fetching data with automatic loading state
export const useFetch = (apiFunction, dependencies = []) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const refetch = useCallback(async () => {
    if (!apiFunction) return

    setLoading(true)
    setError(null)
    
    try {
      const result = await apiFunction()
      setData(result)
      return { success: true, data: result }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch data'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [apiFunction])

  // Auto-fetch on mount and dependency changes
  useState(() => {
    refetch()
  }, dependencies)

  return {
    loading,
    error,
    data,
    refetch
  }
}