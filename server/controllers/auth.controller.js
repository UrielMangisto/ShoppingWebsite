// server/controllers/auth.controller.js - Authentication controller
// Handles user registration, login, and password reset operations
import bcrypt from 'bcrypt'; // Password hashing library
import jwt from 'jsonwebtoken'; // JSON Web Token for authentication
import { findUserByEmailRaw, createUser, updateUserPassword } from '../models/users.model.js';

// User registration endpoint
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, email, password' 
      });
    }
    
    // Check if user already exists to prevent duplicate accounts
    const existingUser = await findUserByEmailRaw(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    // Hash password with salt rounds for security
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user in database
    const userId = await createUser({ 
      name, 
      email, 
      password: hashedPassword, 
      role: role || 'user' 
    });
    
    // Generate JWT token with user information
    const tokenPayload = { id: userId, role: role || 'user', email, name };
    const token = jwt.sign(
      tokenPayload, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' } // Token expires in 7 days
    );
    
    // Send success response with token and user data
    res.status(201).json({ 
      message: 'User registered successfully', 
      token,
      user: {
        id: userId,
        email,
        name,
        role: role || 'user'
      }
    });
  } catch (error) {
    next(error); // Pass error to global error handler
  }
};

// User login endpoint
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Missing required fields: email, password' 
      });
    }
    
    // Find user by email (includes password for verification)
    const user = await findUserByEmailRaw(email);
    if (!user) {
      // Generic error message to prevent email enumeration attacks
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Verify password against stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token with complete user information
    const tokenPayload = { 
      id: user.id, 
      role: user.role, 
      email: user.email, 
      name: user.name 
    };
    const token = jwt.sign(
      tokenPayload, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    // Send success response with token and safe user data (no password)
    res.json({ 
      message: 'Login successful', 
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// Password reset endpoint - allows users to change their password
export const resetPassword = async (req, res, next) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    
    // Validate required fields
    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Missing required fields: email, oldPassword, newPassword' 
      });
    }
    
    // Validate new password strength (basic validation)
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'New password must be at least 6 characters long' 
      });
    }
    
    // Find user by email
    const user = await findUserByEmailRaw(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify old password before allowing change
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password with salt rounds for security
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password in database
    await updateUserPassword(user.id, hashedNewPassword);
    
    res.json({ 
      message: 'Password updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};
