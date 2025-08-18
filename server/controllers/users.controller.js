// server/controllers/users.controller.js
import {
  getUsers, getUser, updateUserDetails, removeUser
} from '../services/users.service.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (e) {
    next(e);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await getUser(req.params.id);
    res.json(user);
  } catch (e) {
    next(e);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const updated = await updateUserDetails(req.params.id, req.body);
    res.json({ message: 'User updated', updated });
  } catch (e) {
    next(e);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await removeUser(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (e) {
    next(e);
  }
};
