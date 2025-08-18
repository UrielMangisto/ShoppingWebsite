import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmailRaw, createUser, updateUserPassword } from '../models/users.model.js';

export const registerUser = async ({ name, email, password, role }) => {
  const exists = await findUserByEmailRaw(email);
  if (exists) throw new Error('Email already exists');
  const hashed = await bcrypt.hash(password, 10);
  const id = await createUser({ name, email, password: hashed, role: role || 'user' });
  return jwt.sign({ id, role: role || 'user', email }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmailRaw(email);
  if (!user) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error('Invalid credentials');
  return jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const resetPassword = async ({ email, newPassword }) => {
  const user = await findUserByEmailRaw(email);
  if (!user) throw new Error('User not found');
  const hashed = await bcrypt.hash(newPassword, 10);
  await updateUserPassword(user.id, hashed);
};
