const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const ClothingItem = require('../models/ClothingItem');
const PointTransaction = require('../models/PointTransaction');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, [
  body('firstName').optional().isLength({ min: 1, max: 50 }).trim(),
  body('lastName').optional().isLength({ min: 1, max: 50 }).trim(),
  body('bio').optional().isLength({ max: 500 }).trim(),
  body('preferences.sizes').optional().isArray(),
  body('preferences.styles').optional().isArray(),
  body('preferences.brands').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const allowedUpdates = ['firstName', 'lastName', 'bio', 'preferences'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's items
router.get('/items', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const items = await ClothingItem.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ClothingItem.countDocuments({ owner: req.user._id });

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
    console.error('Get user items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's favorites
router.get('/favorites', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const items = await ClothingItem.find({ 
      favorites: req.user._id,
      status: 'available'
    })
      .populate('owner', 'username firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ClothingItem.countDocuments({ 
      favorites: req.user._id,
      status: 'available'
    });

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
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get point transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const transactions = await PointTransaction.find({ user: req.user._id })
      .populate('item', 'title images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await PointTransaction.countDocuments({ user: req.user._id });

    res.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user stats
router.get('/stats', auth, async (req, res) => {
  try {
    const [
      totalItems,
      availableItems,
      swappedItems,
      totalEarned,
      totalSpent
    ] = await Promise.all([
      ClothingItem.countDocuments({ owner: req.user._id }),
      ClothingItem.countDocuments({ owner: req.user._id, status: 'available' }),
      ClothingItem.countDocuments({ owner: req.user._id, status: 'swapped' }),
      PointTransaction.aggregate([
        { $match: { user: req.user._id, type: { $in: ['earned', 'bonus'] } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      PointTransaction.aggregate([
        { $match: { user: req.user._id, type: 'spent' } },
        { $group: { _id: null, total: { $sum: { $abs: '$amount' } } } }
      ])
    ]);

    res.json({
      stats: {
        totalItems,
        availableItems,
        swappedItems,
        totalEarned: totalEarned[0]?.total || 0,
        totalSpent: totalSpent[0]?.total || 0,
        currentPoints: req.user.points
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;