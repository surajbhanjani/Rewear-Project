import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import itemRoutes from './routes/item.js';
import dotenvConfig from 'dotenv';
import './config/cloudinary.js';

dotenvConfig.config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
import adminRoutes from './routes/admin.js';
app.use('/api/admin', adminRoutes);
import userRoutes from './routes/user.js';
app.use('/api/user', userRoutes);
import uploadRoutes from './routes/upload.js';
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.send('ReWear API is running');
});

// Error handler placeholder
app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
