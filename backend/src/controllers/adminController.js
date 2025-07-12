import Item from '../models/Item.js';

export const getPendingItems = async (req, res) => {
  try {
    const items = await Item.find({ status: 'pending' }).populate('uploader', 'name email');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending items', error: err.message });
  }
};

export const approveItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.status = 'approved';
    await item.save();
    res.json({ message: 'Item approved', item });
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve item', error: err.message });
  }
};

export const rejectItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.status = 'rejected';
    await item.save();
    res.json({ message: 'Item rejected', item });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reject item', error: err.message });
  }
};

export const removeItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove item', error: err.message });
  }
};
