// server/controllers/users.controller.js
import { findAllUsers, findUserById, updateUserById, deleteUserById } from '../models/users.model.js';

// Helper function to transform user data for response (hide sensitive data)
const transformUserForResponse = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
    // Note: password is intentionally excluded for security
  };
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await findAllUsers();
    const transformedUsers = users.map(transformUserForResponse);
    res.json(transformedUsers);
  } catch (e) {
    next(e);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (typeof user !== 'object' || !user.id) {
      return res.status(500).json({ message: 'Invalid user data' });
    }

    const transformedUser = transformUserForResponse(user);
    res.json(transformedUser);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const updated = await updateUserById(req.params.id, req.body);
    res.json({ message: 'User updated', updated });
  } catch (e) {
    next(e);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const affectedRows = await deleteUserById(req.params.id);
    
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully', affectedRows });
  } catch (e) {
    next(e);
  }
};
