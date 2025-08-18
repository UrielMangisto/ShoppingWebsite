// API utility functions using fetch

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get headers with auth token
const getHeaders = (includeAuth = true, isFormData = false) => {
  const headers = {};
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Helper function to handle fetch responses
const handleResponse = async (response) => {
  // Handle token expiration
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // Parse response
  let data;
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const error = new Error(data.message || `HTTP Error: ${response.status}`);
    error.status = response.status;
    error.response = { data, status: response.status };
    throw error;
  }

  return { data, status: response.status };
};

// GET request
export const get = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  
  return handleResponse(response);
};

// POST request
export const post = async (endpoint, data, isFormData = false) => {
  const headers = getHeaders(true, isFormData);
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: isFormData ? data : JSON.stringify(data),
  });
  
  return handleResponse(response);
};

// PUT request
export const put = async (endpoint, data, isFormData = false) => {
  const headers = getHeaders(true, isFormData);
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers,
    body: isFormData ? data : JSON.stringify(data),
  });
  
  return handleResponse(response);
};

// DELETE request
export const del = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  
  return handleResponse(response);
};

// POST without auth (for login/register)
export const postNoAuth = async (endpoint, data) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify(data),
  });
  
  return handleResponse(response);
};

// Helper function for handling API errors
export const handleApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  return error.message || 'An unexpected error occurred';
};

// Helper function for creating form data
export const createFormData = (data) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  
  return formData;
};

export default { get, post, put, del, postNoAuth, handleApiError, createFormData };