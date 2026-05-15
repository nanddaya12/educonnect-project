import Assignment from '../models/Assignment.js';
import Student from '../models/Student.js';
import { AppError } from '../utils/AppError.js';

const assignmentPopulate = () =>
  Assignment.find()
    .sort({ createdAt: -1 })
    .populate('assignedStudents', 'name course batch')
    .populate('createdBy', 'email uniqueId role');

// @desc    List assignments (students only see their own)
// @route   GET /api/assignments
// @access  Private
export const getAssignments = async (req, res) => {
  if (req.user.role === 'student') {
    const profile = await Student.findOne({ user: req.user._id });
    if (!profile) {
      throw new AppError('Student profile not found', 404);
    }
    const assignments = await Assignment.find({ assignedStudents: profile._id })
      .sort({ createdAt: -1 })
      .populate('assignedStudents', 'name course batch')
      .populate('createdBy', 'email uniqueId role');
    return res.json(assignments);
  }

  const assignments = await assignmentPopulate();
  res.json(assignments);
};

// @desc    Create assignment (faculty or admin)
// @route   POST /api/assignments
// @access  Private / Trainer, Admin
export const createAssignment = async (req, res) => {
  const { title, subject, description, dueDate, assignedStudents } = req.body;
  const assignment = await Assignment.create({
    title,
    subject,
    description,
    dueDate,
    assignedStudents: assignedStudents || [],
    createdBy: req.user._id,
  });
  const populated = await Assignment.findById(assignment._id)
    .populate('assignedStudents', 'name course batch')
    .populate('createdBy', 'email uniqueId role');
  res.status(201).json(populated);
};
