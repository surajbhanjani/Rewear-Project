import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { addItem, getItems, getItemById, requestSwap, redeemWithPoints } from '../controllers/itemController.js';
import { getSwapsForItem } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getItems);
router.get('/:id', getItemById);
router.post('/', authenticate, addItem);
router.post('/:id/swap', authenticate, requestSwap);
router.post('/:id/redeem', authenticate, redeemWithPoints);
router.get('/:id/swaps', getSwapsForItem);

export default router;
