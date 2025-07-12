import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { getPendingItems, approveItem, rejectItem, removeItem } from '../controllers/adminController.js';

const router = express.Router();

router.get('/pending-items', authenticate, requireAdmin, getPendingItems);
router.post('/approve/:id', authenticate, requireAdmin, approveItem);
router.post('/reject/:id', authenticate, requireAdmin, rejectItem);
router.delete('/remove/:id', authenticate, requireAdmin, removeItem);

export default router;
