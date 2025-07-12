import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true }, // e.g. shirt, pants
  size: { type: String, required: true },
  condition: { type: String, required: true },
  tags: [String],
  images: [String], // Cloudinary URLs
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'swapped'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Item', itemSchema);
