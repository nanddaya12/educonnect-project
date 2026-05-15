import User from '../models/User.js';
import Trainer from '../models/Trainer.js';
import { AppError } from '../utils/AppError.js';

// @desc    Get all trainers
// @route   GET /api/trainers
// @access  Private/Admin
export const getTrainers = async (req, res) => {
  const trainers = await Trainer.find().populate('user', '-password');
  res.json(trainers);
};

// @desc    Create a trainer
// @route   POST /api/trainers
// @access  Private/Admin
export const createTrainer = async (req, res) => {
  const { name, email, phone, department, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError('A user with this email already exists', 400);
  }

  const count = await User.countDocuments({ role: 'trainer' });
  const uniqueId = `TRN-${String(count + 1).padStart(3, '0')}`;

  const user = await User.create({
    uniqueId,
    email,
    password: password || 'trainer123',
    role: 'trainer',
  });

  const trainer = await Trainer.create({
    user: user._id,
    name,
    phone,
    department,
  });

  res.status(201).json({
    _id: trainer._id,
    name: trainer.name,
    user: {
      uniqueId: user.uniqueId,
      email: user.email,
    },
  });
};

// @desc    Delete a trainer
// @route   DELETE /api/trainers/:id
// @access  Private/Admin
export const deleteTrainer = async (req, res) => {
  const trainer = await Trainer.findById(req.params.id);
  if (!trainer) {
    throw new AppError('Trainer not found', 404);
  }

  await User.findByIdAndDelete(trainer.user);
  await Trainer.findByIdAndDelete(req.params.id);

  res.json({ message: 'Trainer removed' });
};
