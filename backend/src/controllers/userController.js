import User from '../models/User.js';
import Item from '../models/Item.js';
import Swap from '../models/Swap.js';

// Approve a swap/redeem request
export const approveSwap = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.swapId).populate('item requester owner');
    if (!swap) return res.status(404).json({ message: 'Swap request not found' });
    if (swap.owner._id.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    if (swap.status !== 'pending') return res.status(400).json({ message: 'Swap already processed' });

    // For item-for-item swap, require offeredItem
    if (swap.type === 'swap') {
      const { offeredItem } = req.body;
      if (!offeredItem && !swap.offeredItem) {
        return res.status(400).json({ message: 'You must select one of your items to swap.' });
      }
      // Save offeredItem if provided
      if (offeredItem) {
        swap.offeredItem = offeredItem;
      }
      if (!swap.offeredItem) {
        return res.status(400).json({ message: 'No offered item specified.' });
      }
      // Mark both items as swapped
      const item1 = await Item.findById(swap.item._id);
      const item2 = await Item.findById(swap.offeredItem);
      if (!item2) return res.status(400).json({ message: 'Selected offered item not found.' });
      item1.status = 'swapped';
      item2.status = 'swapped';
      await item1.save();
      await item2.save();
    }
    // Redeem (points) logic
    if (swap.type === 'points') {
      const item = await Item.findById(swap.item._id);
      const requester = await User.findById(swap.requester._id);
      const owner = await User.findById(swap.owner._id);
      if (requester.points < item.points) return res.status(400).json({ message: 'Requester does not have enough points' });
      requester.points -= item.points;
      owner.points += item.points;
      await requester.save();
      await owner.save();
      item.status = 'swapped';
      await item.save();
    }
    swap.status = 'completed';
    await swap.save();
    return res.json({ message: 'Swap approved and completed', swap });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to approve swap', error: err.message });
  }
};

// Reject a swap/redeem request
export const rejectSwap = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.swapId);
    if (!swap) return res.status(404).json({ message: 'Swap request not found' });
    if (swap.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    if (swap.status !== 'pending') return res.status(400).json({ message: 'Swap already processed' });
    swap.status = 'rejected';
    await swap.save();
    return res.json({ message: 'Swap request rejected', swap });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to reject swap', error: err.message });
  }
};

export const getSwapsForItem = async (req, res) => {
  try {
    const swaps = await Swap.find({ item: req.params.id })
      .populate('requester', 'name email')
      .populate('owner', 'name email');
    res.json(swaps);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch swaps for item', error: err.message });
  }
};

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
