import { body, validationResult } from 'express-validator';
import { AppError } from '../utils/AppError.js';

const firstErrorMessage = (req) => {
  const r = validationResult(req);
  if (r.isEmpty()) return null;
  return r.array({ onlyFirstError: true })[0]?.msg || 'Invalid request';
};

export const rejectValidation = (req, res, next) => {
  const msg = firstErrorMessage(req);
  if (msg) return next(new AppError(msg, 400));
  next();
};

export const loginValidators = [
  body('identifier').trim().notEmpty().withMessage('Enter your school ID or email.'),
  body('password').notEmpty().withMessage('Enter your password.'),
  body('role').isIn(['student', 'trainer', 'admin']).withMessage('Choose a valid account type.'),
];

export const signupValidators = [
  body('email').trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters.'),
  body('name').optional().trim().isLength({ max: 120 }).withMessage('Name is too long.'),
  body('role').equals('student').withMessage('Only student registration is available here.'),
];
