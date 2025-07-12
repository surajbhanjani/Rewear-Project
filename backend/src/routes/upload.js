import express from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth.js';
import { uploadImage } from '../controllers/uploadController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/image', authenticate, upload.single('image'), uploadImage);

export default router;
