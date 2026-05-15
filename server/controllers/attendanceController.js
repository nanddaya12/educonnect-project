import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';
import { AppError } from '../utils/AppError.js';

// @desc    Get attendance (students only see days they appear on)
// @route   GET /api/attendance
// @access  Private
export const getAttendance = async (req, res) => {
  if (req.user.role === 'student') {
    const profile = await Student.findOne({ user: req.user._id });
    if (!profile) {
      throw new AppError('Student profile not found', 404);
    }
    const attendance = await Attendance.find({ 'records.student': profile._id })
      .populate('records.student')
      .sort({ date: -1 });
    return res.json(attendance);
  }

  const attendance = await Attendance.find()
    .populate('records.student')
    .sort({ date: -1 });
  res.json(attendance);
};

// @desc    Create / replace daily attendance
// @route   POST /api/attendance
// @access  Private / Trainer, Admin
export const createAttendance = async (req, res) => {
  const { date, records } = req.body;
  const attendance = await Attendance.create({
    date: date || new Date(),
    markedBy: req.user._id,
    records,
  });
  const populated = await Attendance.findById(attendance._id).populate('records.student');
  res.status(201).json(populated);
};
