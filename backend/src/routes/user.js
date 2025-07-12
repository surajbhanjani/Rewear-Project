import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getProfile, getUserItems, getUserSwaps, approveSwap, rejectSwap } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.get('/items', authenticate, getUserItems);
router.get('/swaps', authenticate, getUserSwaps);

// Approve or reject swap/redeem requests
router.post('/swap/:swapId/approve', authenticate, approveSwap);
router.post('/swap/:swapId/reject', authenticate, rejectSwap);

export default router;
