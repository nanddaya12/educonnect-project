import jwt from 'jsonwebtoken';
import { AppError } from './AppError.js';

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError('Server authentication is not configured (JWT_SECRET).', 500);
  }
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export default generateToken;
