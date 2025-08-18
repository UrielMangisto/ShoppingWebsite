import { get, post, put, del } from './api';

export const userService = {
  // Get all users (admin only)
  getAllUsers: async () => {
    const response = await get('/users');
    return response;
  },

  // Get single user by ID
  getUserById: async (userId) => {
    const response = await get(`/users/${userId}`);
    return response;
  },

  // Update user profile
  updateUser: async (userId, userData) => {
    const response = await put(`/users/${userId}`, userData);
    return response;
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    const response = await del(`/users/${userId}`);
    return response;
  },

  // Update current user profile
  updateProfile: async (userData) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) throw new Error('No authenticated user');
    
    const response = await userService.updateUser(currentUser.id, userData);
    
    // Update local storage with new user data
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return response;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await put('/users/change-password', {
      currentPassword,
      newPassword
    });
    return response;
  },

  // Get user profile
  getProfile: async () => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) throw new Error('No authenticated user');
    
    return await userService.getUserById(currentUser.id);
  },

  // Upload profile picture (if you add this feature)
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const response = await post('/users/upload-profile-picture', formData, true); // true = isFormData
    return response;
  },

  // Get user statistics (admin only)
  getUserStats: async () => {
    const response = await get('/users/stats');
    return response;
  },

  // Search users (admin only)
  searchUsers: async (query) => {
    const response = await get(`/users?search=${encodeURIComponent(query)}`);
    return response;
  },

  // Validate user data
  validateUserData: (userData) => {
    const errors = {};
    
    if (!userData.name || userData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }
    
    if (!userData.email || !isValidEmail(userData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (userData.password && userData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

// Helper function to validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};