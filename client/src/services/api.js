// src/services/api.js - Centralized API Service Layer
// This module provides a clean abstraction for all HTTP requests to the backend
// Features: JWT token handling, error processing, file uploads, consistent request structure

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Centralized response handler for all API calls
 * Processes HTTP responses and extracts JSON data or error messages
 * 
 * @param {Response} response - Fetch API response object
 * @returns {Object} - Parsed JSON response data
 * @throws {Error} - Formatted error message from server or default message
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    // Attempt to extract error message from response body
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP Error: ${response.status}`);
  }
  return response.json();
};

/**
 * Generate request headers with optional JWT token
 * Automatically includes Content-Type and Authorization headers
 * 
 * @param {string|null} token - JWT token for authenticated requests
 * @returns {Object} - Headers object for fetch requests
 */
const getHeaders = (token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Add authorization header if token is provided
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Core API methods for all HTTP operations
 * Provides consistent interface for GET, POST, PUT, DELETE operations
 * Automatically handles authentication and response processing
 */
export const api = {
  /**
   * GET request method
   * @param {string} endpoint - API endpoint (e.g., '/products')
   * @param {string|null} token - Optional JWT token for authenticated requests
   * @returns {Promise<Object>} - Response data
   */
  get: async (endpoint, token = null) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  /**
   * POST request method for creating resources
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {string|null} token - Optional JWT token
   * @returns {Promise<Object>} - Response data
   */
  post: async (endpoint, data, token = null) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * PUT request method for updating resources
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Updated resource data
   * @param {string|null} token - Optional JWT token
   * @returns {Promise<Object>} - Response data
   */
  put: async (endpoint, data, token = null) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * DELETE request method for removing resources
   * @param {string} endpoint - API endpoint
   * @param {string|null} token - Optional JWT token
   * @returns {Promise<Object>} - Response data
   */
  delete: async (endpoint, token = null) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  /**
   * File upload method (POST) - for creating resources with files
   * Used for product images, user avatars, etc.
   * @param {string} endpoint - API endpoint
   * @param {FormData} formData - FormData object containing files and data
   * @param {string|null} token - Optional JWT token
   * @returns {Promise<Object>} - Response data
   * 
   * Note: Content-Type header is automatically set by browser for FormData
   */
  upload: async (endpoint, formData, token = null) => {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // Don't set Content-Type - browser sets it automatically with boundary for FormData

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse(response);
  },

  /**
   * File upload method (PUT) - for updating resources with files
   * Used for updating existing product images, etc.
   * @param {string} endpoint - API endpoint
   * @param {FormData} formData - FormData object containing files and data
   * @param {string|null} token - Optional JWT token
   * @returns {Promise<Object>} - Response data
   */
  uploadPut: async (endpoint, formData, token = null) => {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // Don't set Content-Type - browser sets it automatically with boundary for FormData

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: formData,
    });
    return handleResponse(response);
  },
};

export default api;