import User from '../models/User.js';
import Student from '../models/Student.js';
import { AppError } from '../utils/AppError.js';

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Trainer
export const getStudents = async (req, res) => {
  const students = await Student.find().populate('user', '-password');
  res.json(students);
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private/Trainer
export const getStudentById = async (req, res) => {
  const student = await Student.findById(req.params.id).populate('user', '-password');
  if (!student) {
    throw new AppError('Student not found', 404);
  }
  res.json(student);
};

// @desc    Create a student
// @route   POST /api/students
// @access  Private/Trainer
export const createStudent = async (req, res) => {
  const { name, email, phone, course, batch, password } = req.body;

  const count = await User.countDocuments({ role: 'student' });
  const uniqueId = `IDH-${String(count + 1).padStart(3, '0')}`;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError('A user with this email already exists', 400);
  }

  const user = await User.create({
    uniqueId,
    email,
    password: password || 'student123',
    role: 'student',
  });

  const student = await Student.create({
    user: user._id,
    name,
    phone,
    course,
    batch,
  });

  res.status(201).json({
    _id: student._id,
    name: student.name,
    user: {
      uniqueId: user.uniqueId,
      email: user.email,
    },
  });
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private/Trainer/Admin
export const deleteStudent = async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    throw new AppError('Student not found', 404);
  }

  await User.findByIdAndDelete(student.user);
  await Student.findByIdAndDelete(req.params.id);

  res.json({ message: 'Student removed' });
};
