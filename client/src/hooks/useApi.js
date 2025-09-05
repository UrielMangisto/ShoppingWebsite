// src/hooks/useApi.js - Custom Hook for API State Management
// This hook provides a reusable pattern for handling API calls with loading states and error handling
import { useState } from 'react';

/**
 * Custom hook for managing API call states
 * Provides consistent loading, error, and execution patterns across the application
 * 
 * @returns {Object} - { loading, error, execute, clearError }
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);  // Track loading state
  const [error, setError] = useState(null);       // Store error messages

  /**
   * Execute an API call with automatic loading and error state management
   * 
   * @param {Function} apiCall - Async function that makes the API request
   * @returns {Promise} - Result of the API call
   * 
   * Usage Example:
   * const { loading, error, execute } = useApi();
   * const fetchData = () => execute(() => productsService.getAll());
   */
  const execute = async (apiCall) => {
    try {
      setLoading(true);      // Start loading
      setError(null);        // Clear previous errors
      
      const result = await apiCall();  // Execute the API call
      return result;         // Return success result
      
    } catch (err) {
      // Handle and store error
      setError(err.message || 'An unexpected error occurred');
      throw err;             // Re-throw for component-level handling
      
    } finally {
      setLoading(false);     // Always stop loading (success or error)
    }
  };

  // Utility function to manually clear errors
  const clearError = () => setError(null);

  return {
    loading,     // Boolean: Is API call in progress
    error,       // String|null: Error message if any
    execute,     // Function: Execute API call with state management
    clearError   // Function: Manually clear error state
  };
};