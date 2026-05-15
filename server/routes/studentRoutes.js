import express from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  deleteStudent,
} from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('trainer', 'admin'), asyncHandler(getStudents))
  .post(protect, authorize('trainer', 'admin'), asyncHandler(createStudent));

router
  .route('/:id')
  .get(protect, authorize('trainer', 'admin'), asyncHandler(getStudentById))
  .delete(protect, authorize('trainer', 'admin'), asyncHandler(deleteStudent));

export default router;
