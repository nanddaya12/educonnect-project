import express from 'express';
import { getAttendance, createAttendance } from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

router
  .route('/')
  .get(protect, asyncHandler(getAttendance))
  .post(protect, authorize('trainer', 'admin'), asyncHandler(createAttendance));

export default router;
