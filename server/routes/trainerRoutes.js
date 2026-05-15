import express from 'express';
import { getTrainers, createTrainer, deleteTrainer } from '../controllers/trainerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('admin'), asyncHandler(getTrainers))
  .post(protect, authorize('admin'), asyncHandler(createTrainer));

router.route('/:id').delete(protect, authorize('admin'), asyncHandler(deleteTrainer));

export default router;
