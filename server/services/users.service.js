import { findAllUsers, findUserById, updateUserById, deleteUserById } from '../models/users.model.js';
import { UserDTO } from '../dtos/user.dto.js';

export const getUsers = async () => {
  const users = await findAllUsers();
  return users.map(user => new UserDTO(user));
};

export const getUser = async (userId) => {
  const user = await findUserById(userId);
  return new UserDTO(user);
};

export const updateUserDetails = async (userId, userData) => {
  return await updateUserById(userId, userData);
};

export const removeUser = async (userId) => {
  return await deleteUserById(userId);
};
