import User from '../models/User.js';
import Item from '../models/Item.js';
import Swap from '../models/Swap.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};

export const getUserItems = async (req, res) => {
  try {
    const items = await Item.find({ uploader: req.user.id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch items', error: err.message });
  }
};

export const getUserSwaps = async (req, res) => {
  try {
    const swaps = await Swap.find({ $or: [ { requester: req.user.id }, { owner: req.user.id } ] })
      .populate('item')
      .populate('requester', 'name email')
      .populate('owner', 'name email');
    res.json(swaps);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch swaps', error: err.message });
  }
};
