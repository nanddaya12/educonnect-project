import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized: no token provided', 401));
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next(new AppError('Server configuration error', 500));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return next(new AppError('Session expired, please sign in again', 401));
      }
      return next(new AppError('Not authorized: invalid token', 401));
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new AppError('Not authorized: user not found', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Not authorized', 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`This action is not allowed for role "${req.user.role}"`, 403)
      );
    }
    next();
  };
