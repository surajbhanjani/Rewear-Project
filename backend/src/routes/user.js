import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getProfile, getUserItems, getUserSwaps } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.get('/items', authenticate, getUserItems);
router.get('/swaps', authenticate, getUserSwaps);

export default router;
