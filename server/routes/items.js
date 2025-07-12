const express = require('express');
const { body, validationResult, query } = require('express-validator');
const ClothingItem = require('../models/ClothingItem');
const PointTransaction = require('../models/PointTransaction');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all items with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('category').optional().isIn(['tops', 'bottoms', 'outerwear', 'shoes', 'accessories', 'dresses', 'activewear']),
  query('status').optional().isIn(['available', 'reserved', 'swapped']),
  query('search').optional().isLength({ max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = { status: 'available' };
    
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Execute query
    const items = await ClothingItem.find(query)
      .populate('owner', 'username firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ClothingItem.countDocuments(query);

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
    console.error('Get items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.id)
      .populate('owner', 'username firstName lastName avatar bio');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Increment view count
    item.views += 1;
    await item.save();

    res.json({ item });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new item
router.post('/', auth, upload.array('images', 5), [
  body('title').isLength({ min: 1, max: 100 }).trim(),
  body('description').isLength({ min: 10, max: 1000 }).trim(),
  body('category').isIn(['tops', 'bottoms', 'outerwear', 'shoes', 'accessories', 'dresses', 'activewear']),
  body('type').isLength({ min: 1, max: 50 }).trim(),
  body('size').isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42']),
  body('condition').isIn(['excellent', 'good', 'fair', 'worn']),
  body('color').isLength({ min: 1, max: 30 }).trim(),
  body('brand').optional().isLength({ max: 50 }).trim(),
  body('location').optional().isLength({ max: 100 }).trim(),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    // Calculate point value based on condition
    const pointValues = {
      excellent: 100,
      good: 75,
      fair: 50,
      worn: 25
    };

    const images = req.files.map(file => `/uploads/items/${file.filename}`);
    
    const item = new ClothingItem({
      ...req.body,
      images,
      pointValue: pointValues[req.body.condition],
      owner: req.user._id,
      tags: req.body.tags || []
    });

    await item.save();

    // Populate owner info
    await item.populate('owner', 'username firstName lastName avatar');

    res.status(201).json({
      message: 'Item created successfully',
      item
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update item
router.put('/:id', auth, [
  body('title').optional().isLength({ min: 1, max: 100 }).trim(),
  body('description').optional().isLength({ min: 10, max: 1000 }).trim(),
  body('location').optional().isLength({ max: 100 }).trim(),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const item = await ClothingItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    // Only allow updates to certain fields
    const allowedUpdates = ['title', 'description', 'location', 'tags'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedItem = await ClothingItem.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate('owner', 'username firstName lastName avatar');

    res.json({
      message: 'Item updated successfully',
      item: updatedItem
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership or admin
    if (item.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await ClothingItem.findByIdAndDelete(req.params.id);

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle favorite
router.post('/:id/favorite', auth, async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const userId = req.user._id;
    const isFavorited = item.favorites.includes(userId);

    if (isFavorited) {
      item.favorites.pull(userId);
    } else {
      item.favorites.push(userId);
    }

    await item.save();

    res.json({
      message: isFavorited ? 'Removed from favorites' : 'Added to favorites',
      isFavorited: !isFavorited
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Redeem item with points
router.post('/:id/redeem', auth, async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.status !== 'available') {
      return res.status(400).json({ message: 'Item is not available' });
    }

    if (item.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot redeem your own item' });
    }

    if (req.user.points < item.pointValue) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    // Start transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update item status
      item.status = 'swapped';
      await item.save({ session });

      // Deduct points from user
      req.user.points -= item.pointValue;
      await req.user.save({ session });

      // Create point transaction
      const transaction = new PointTransaction({
        user: req.user._id,
        item: item._id,
        type: 'spent',
        amount: -item.pointValue,
        description: `Redeemed item: ${item.title}`
      });
      await transaction.save({ session });

      await session.commitTransaction();

      res.json({
        message: 'Item redeemed successfully',
        pointsRemaining: req.user.points
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Redeem item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;