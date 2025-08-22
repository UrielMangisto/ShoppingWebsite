const API_BASE_URL = 'http://localhost:3000/api';

// Utility function to handle HTTP errors
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

// Configure request headers
const getHeaders = (token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Base API methods
export const api = {
  get: async (endpoint, token = null) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  post: async (endpoint, data, token = null) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  put: async (endpoint, data, token = null) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (endpoint, token = null) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  // Special method for file uploads
  upload: async (endpoint, formData, token = null) => {
    const headers = {
      'Authorization': token ? `Bearer ${token}` : '',
      // Don't set Content-Type here as it will be set automatically for FormData
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse(response);
  },
};

export default api;
