// server/controllers/auth.controller.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmailRaw, createUser, updateUserPassword } from '../models/users.model.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const exists = await findUserByEmailRaw(email);
    if (exists) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    // Hash password and create user
    const hashed = await bcrypt.hash(password, 10);
    const userId = await createUser({ name, email, password: hashed, role: role || 'user' });
    
    // Generate JWT token
    const token = jwt.sign({ id: userId, role: role || 'user', email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
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
  } catch (e) {
    next(e);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await findUserByEmailRaw(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
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
  } catch (e) {
    next(e);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    
    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Missing required fields: email, oldPassword, newPassword' });
    }
    
    // Find user by email
    const user = await findUserByEmailRaw(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    // Hash new password and update
    const hashed = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(user.id, hashed);
    
    res.json({ message: 'Password reset successful' });
  } catch (e) {
    next(e);
  }
};
