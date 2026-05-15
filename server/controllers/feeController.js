import FeeRecord from '../models/FeeRecord.js';
import Student from '../models/Student.js';
import { AppError } from '../utils/AppError.js';

// @desc    List fee records (students only see their own)
// @route   GET /api/fees
// @access  Private
export const getFees = async (req, res) => {
  if (req.user.role === 'student') {
    const profile = await Student.findOne({ user: req.user._id });
    if (!profile) {
      throw new AppError('Student profile not found', 404);
    }
    const fees = await FeeRecord.find({ student: profile._id })
      .populate('student')
      .sort({ dueDate: 1 });
    return res.json(fees);
  }

  const fees = await FeeRecord.find().populate('student').sort({ dueDate: 1 });
  res.json(fees);
};

// @desc    Create fee record
// @route   POST /api/fees
// @access  Private / Trainer, Admin
export const createFee = async (req, res) => {
  const { student, month, amount, dueDate, status } = req.body;
  const fee = await FeeRecord.create({
    student,
    month,
    amount,
    dueDate,
    status: status || 'Pending',
  });
  res.status(201).json(fee);
};

// @desc    Update fee status
// @route   PUT /api/fees/:id
// @access  Private / Trainer, Admin
export const updateFeeStatus = async (req, res) => {
  const fee = await FeeRecord.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!fee) {
    throw new AppError('Fee record not found', 404);
  }
  res.json(fee);
};
