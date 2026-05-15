import express from 'express';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Trainer from '../models/Trainer.js';
import Assignment from '../models/Assignment.js';
import Attendance from '../models/Attendance.js';
import FeeRecord from '../models/FeeRecord.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

// @desc    Dump all database content for local verification only
// @route   GET /api/debug/dump
// @access  Development (router not mounted in production)
router.get(
  '/dump',
  asyncHandler(async (req, res) => {
    const users = await User.find().select('-password');
    const students = await Student.find();
    const trainers = await Trainer.find();
    const assignments = await Assignment.find();
    const attendance = await Attendance.find();
    const fees = await FeeRecord.find();

    res.json({
      connection: 'Success',
      database: 'MongoDB',
      counts: {
        users: users.length,
        students: students.length,
        trainers: trainers.length,
        assignments: assignments.length,
        attendance: attendance.length,
        fees: fees.length,
      },
      data: {
        users,
        students,
        trainers,
        assignments,
        attendance,
        fees,
      },
    });
  })
);

export default router;
