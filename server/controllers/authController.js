import User from '../models/User.js';
import Student from '../models/Student.js';
import Trainer from '../models/Trainer.js';
import generateToken from '../utils/generateToken.js';
import { AppError } from '../utils/AppError.js';
import escapeRegex from '../utils/escapeRegex.js';
import resolveDisplayName from '../utils/resolveDisplayName.js';

const buildAuthPayload = (user, profile) => ({
  _id: user._id,
  uniqueId: user.uniqueId,
  email: user.email,
  role: user.role,
  name: resolveDisplayName(user, profile),
  profile,
  token: generateToken(user._id),
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { identifier, password, role } = req.body;

  const trimmed = String(identifier || '').trim();
  const emailNorm = trimmed.toLowerCase();
  const idPattern = new RegExp(`^${escapeRegex(trimmed)}$`, 'i');

  const user = await User.findOne({
    $or: [{ uniqueId: idPattern }, { email: emailNorm }],
    role,
  });

  if (!user || !(await user.matchPassword(password))) {
    throw new AppError('Invalid school ID, email, password, or account type.', 401);
  }

  let profile = null;
  if (user.role === 'student') {
    profile = await Student.findOne({ user: user._id });
  } else if (user.role === 'trainer') {
    profile = await Trainer.findOne({ user: user._id });
  }

  res.json(buildAuthPayload(user, profile));
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    throw new AppError('User not found', 404);
  }

  let profile = null;
  if (user.role === 'student') {
    profile = await Student.findOne({ user: user._id });
  } else if (user.role === 'trainer') {
    profile = await Trainer.findOne({ user: user._id });
  }

  res.json({
    ...user._doc,
    name: resolveDisplayName(user, profile),
    profile,
  });
};

// @desc    Register a new student
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (role !== 'student') {
    throw new AppError('Staff and admin accounts are created by your school administrator.', 403);
  }

  const normalizedEmail = String(email || '').trim().toLowerCase();
  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    throw new AppError('An account with this email already exists.', 400);
  }

  const prefix = 'IDH';
  const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
  const uniqueId = `${prefix}-${randomHex}`;

  const user = await User.create({
    uniqueId,
    email: normalizedEmail,
    password,
    role,
  });

  const profile = await Student.create({
    user: user._id,
    name: name || normalizedEmail.split('@')[0],
    phone: 'Not provided',
    course: 'General Curriculum',
    batch: 'Batch 2026',
  });

  res.status(201).json(
    buildAuthPayload(user, profile)
  );
};
