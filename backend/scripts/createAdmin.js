import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function createAdmin() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const existing = await User.findOne({ email: 'admin@gmail.com' });
  if (existing) {
    console.log('Admin already exists.');
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash('admin123', 10);

  const admin = new User({
    name: 'admin',
    email: 'admin@gmail.com',
    password: passwordHash,
    role: 'admin',
    points: 0
  });
  await admin.save();
  console.log('Admin user created:', admin.email);
  process.exit(0);
}

createAdmin().catch(err => {
  console.error('Error creating admin:', err);
  process.exit(1);
});
