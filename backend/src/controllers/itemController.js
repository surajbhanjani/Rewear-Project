import Item from '../models/Item.js';
import User from '../models/User.js';
import Swap from '../models/Swap.js';
import cloudinary from '../config/cloudinary.js';

export const addItem = async (req, res) => {
  try {
    const { title, description, category, type, size, condition, tags, images, points } = req.body;
    const uploader = req.user.id;
    // images: array of Cloudinary URLs
    const item = new Item({
      title, description, category, type, size, condition, tags, images, uploader,
      points: Number(points) > 0 ? Number(points) : 10
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add item', error: err.message });
  }
};

export const getItems = async (req, res) => {
  try {
    const items = await Item.find({ status: 'approved' }).populate('uploader', 'name email');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch items', error: err.message });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('uploader', 'name email');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch item', error: err.message });
  }
};

export const requestSwap = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item || item.status !== 'approved') return res.status(400).json({ message: 'Item not available' });
    if (item.uploader.toString() === req.user.id) return res.status(400).json({ message: 'Cannot swap your own item' });
    const swap = new Swap({
      item: item._id,
      requester: req.user.id,
      owner: item.uploader,
      type: 'swap',
      status: 'pending',
    });
    await swap.save();
    res.status(201).json({ message: 'Swap request sent and pending approval', swap });
  } catch (err) {
    res.status(500).json({ message: 'Failed to request swap', error: err.message });
  }
};

export const redeemWithPoints = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item || item.status !== 'approved') return res.status(400).json({ message: 'Item not available' });
    const user = await User.findById(req.user.id);
    if (user.points < item.points) return res.status(400).json({ message: 'Not enough points' });
    // Create a pending redeem request (swap type: points)
    const swap = new Swap({
      item: item._id,
      requester: req.user.id,
      owner: item.uploader,
      type: 'points',
      status: 'pending',
    });
    await swap.save();
    res.status(201).json({ message: 'Redeem request sent and pending approval', swap });
  } catch (err) {
    res.status(500).json({ message: 'Failed to redeem with points', error: err.message });
  }
};
