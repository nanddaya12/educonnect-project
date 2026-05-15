import express from 'express';
import { getFees, createFee, updateFeeStatus } from '../controllers/feeController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

router
  .route('/')
  .get(protect, asyncHandler(getFees))
  .post(protect, authorize('trainer', 'admin'), asyncHandler(createFee));

router.route('/:id').put(protect, authorize('trainer', 'admin'), asyncHandler(updateFeeStatus));

export default router;
