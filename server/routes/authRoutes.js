import express from 'express';
import rateLimit from 'express-rate-limit';
import { login, signup, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import asyncHandler from '../middleware/asyncHandler.js';
import {
  loginValidators,
  signupValidators,
  rejectValidation,
} from '../middleware/validateAuth.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please wait and try again.' },
});

router.use(authLimiter);

router.post('/login', loginValidators, rejectValidation, asyncHandler(login));
router.post('/signup', signupValidators, rejectValidation, asyncHandler(signup));
router.get('/me', protect, asyncHandler(getMe));

export default router;
