// server/controllers/auth.controller.js
import { registerUser, loginUser, resetPassword as resetPasswordService } from '../services/auth.service.js';

export const register = async (req, res, next) => {
  try {
    const token = await registerUser(req.body);
    res.status(201).json({ message: 'User registered', token });
  } catch (e) {
    next(e);
  }
};

export const login = async (req, res, next) => {
  try {
    const token = await loginUser(req.body);
    res.json({ message: 'Login successful', token });
  } catch (e) {
    next(e);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    await resetPasswordService(req.body);
    res.json({ message: 'Password reset successful' });
  } catch (e) {
    next(e);
  }
};
