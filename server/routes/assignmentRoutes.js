import express from 'express';
import { getAssignments, createAssignment } from '../controllers/assignmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

router
  .route('/')
  .get(protect, asyncHandler(getAssignments))
  .post(protect, authorize('trainer', 'admin'), asyncHandler(createAssignment));

export default router;
