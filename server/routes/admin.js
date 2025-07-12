const express = require('express');
const { body, validationResult } = require('express-validator');
const ClothingItem = require('../models/ClothingItem');
const User = require('../models/User');
const PointTransaction = require('../models/PointTransaction');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get pending items for approval
router.get('/items/pending', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const items = await ClothingItem.find({ status: 'pending_approval' })
      .populate('owner', 'username firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ClothingItem.countDocuments({ status: 'pending_approval' });

    res.json({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get pending items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve item
router.put('/items/:id/approve', adminAuth, async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.status !== 'pending_approval') {
      return res.status(400).json({ message: 'Item is not pending approval' });
    }

    item.status = 'available';
    item.approvedAt = new Date();
    item.approvedBy = req.user._id;
    await item.save();

    // Award points to the owner
    const owner = await User.findById(item.owner);
    owner.points += item.pointValue;
    await owner.save();

    // Create point transaction
    const transaction = new PointTransaction({
      user: item.owner,
      item: item._id,
      type: 'earned',
      amount: item.pointValue,
      description: `Item approved: ${item.title}`
    });
    await transaction.save();

    res.json({
      message: 'Item approved successfully',
      item
    });
  } catch (error) {
    console.error('Approve item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject item
router.put('/items/:id/reject', adminAuth, [
  body('reason').isLength({ min: 1, max: 500 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { reason } = req.body;
    const item = await ClothingItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.status !== 'pending_approval') {
      return res.status(400).json({ message: 'Item is not pending approval' });
    }

    item.status = 'rejected';
    item.rejectionReason = reason;
    await item.save();

    res.json({
      message: 'Item rejected',
      item
    });
  } catch (error) {
    console.error('Reject item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({});

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle user active status
router.put('/users/:id/toggle-status', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot modify admin users' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get platform statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalItems,
      pendingItems,
      availableItems,
      swappedItems,
      totalTransactions
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ isActive: true }),
      ClothingItem.countDocuments({}),
      ClothingItem.countDocuments({ status: 'pending_approval' }),
      ClothingItem.countDocuments({ status: 'available' }),
      ClothingItem.countDocuments({ status: 'swapped' }),
      PointTransaction.countDocuments({})
    ]);

    // Get recent activity
    const recentItems = await ClothingItem.find({})
      .populate('owner', 'username')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find({})
      .select('username firstName lastName createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        totalItems,
        pendingItems,
        availableItems,
        swappedItems,
        totalTransactions
      },
      recentActivity: {
        items: recentItems,
        users: recentUsers
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;