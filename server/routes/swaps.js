const express = require('express');
const { body, validationResult } = require('express-validator');
const SwapRequest = require('../models/SwapRequest');
const ClothingItem = require('../models/ClothingItem');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create swap request
router.post(
  '/',
  auth,
  [
    body('itemOffered').isMongoId(),
    body('itemRequested').isMongoId(),
    body('message').optional().isLength({ max: 500 }).trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { itemOffered, itemRequested, message } = req.body;

      // Validate items exist and are available
      const [offeredItem, requestedItem] = await Promise.all([
        ClothingItem.findById(itemOffered),
        ClothingItem.findById(itemRequested),
      ]);

      if (!offeredItem || !requestedItem) {
        return res.status(404).json({ message: 'One or both items not found' });
      }

      if (offeredItem.owner.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: 'You can only offer your own items' });
      }

      if (requestedItem.owner.toString() === req.user._id.toString()) {
        return res
          .status(400)
          .json({ message: 'Cannot request your own item' });
      }

      if (
        offeredItem.status !== 'available' ||
        requestedItem.status !== 'available'
      ) {
        return res
          .status(400)
          .json({ message: 'One or both items are not available' });
      }

      // Check for existing pending request
      const existingRequest = await SwapRequest.findOne({
        requester: req.user._id,
        itemOffered,
        itemRequested,
        status: 'pending',
      });

      if (existingRequest) {
        return res.status(400).json({ message: 'Swap request already exists' });
      }

      const swapRequest = new SwapRequest({
        requester: req.user._id,
        itemOffered,
        itemRequested,
        message,
      });

      await swapRequest.save();

      // Populate the request
      await swapRequest.populate([
        { path: 'requester', select: 'username firstName lastName avatar' },
        { path: 'itemOffered', select: 'title images pointValue' },
        { path: 'itemRequested', select: 'title images pointValue' },
      ]);

      res.status(201).json({
        message: 'Swap request created successfully',
        swapRequest,
      });
    } catch (error) {
      console.error('Create swap request error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get user's swap requests (sent)
router.get('/sent', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const requests = await SwapRequest.find({ requester: req.user._id })
      .populate([
        { path: 'itemOffered', select: 'title images pointValue' },
        {
          path: 'itemRequested',
          select: 'title images pointValue owner',
          populate: { path: 'owner', select: 'username firstName lastName' },
        },
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SwapRequest.countDocuments({ requester: req.user._id });

    res.json({
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get sent requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's swap requests (received)
router.get('/received', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find requests for items owned by the user
    const userItems = await ClothingItem.find({ owner: req.user._id }).select(
      '_id'
    );
    const itemIds = userItems.map((item) => item._id);

    const requests = await SwapRequest.find({
      itemRequested: { $in: itemIds },
      requester: { $ne: req.user._id },
    })
      .populate([
        { path: 'requester', select: 'username firstName lastName avatar' },
        { path: 'itemOffered', select: 'title images pointValue' },
        { path: 'itemRequested', select: 'title images pointValue' },
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SwapRequest.countDocuments({
      itemRequested: { $in: itemIds },
      requester: { $ne: req.user._id },
    });

    res.json({
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get received requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Respond to swap request
router.put(
  '/:id/respond',
  auth,
  [
    body('status').isIn(['accepted', 'rejected']),
    body('responseMessage').optional().isLength({ max: 500 }).trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { status, responseMessage } = req.body;

      const swapRequest = await SwapRequest.findById(req.params.id).populate([
        'itemOffered',
        'itemRequested',
      ]);

      if (!swapRequest) {
        return res.status(404).json({ message: 'Swap request not found' });
      }

      if (swapRequest.status !== 'pending') {
        return res
          .status(400)
          .json({ message: 'Swap request already processed' });
      }

      // Check if user owns the requested item
      if (
        swapRequest.itemRequested.owner.toString() !== req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({ message: 'Not authorized to respond to this request' });
      }

      swapRequest.status = status;
      swapRequest.responseMessage = responseMessage;

      if (status === 'accepted') {
        // Mark both items as reserved
        await Promise.all([
          ClothingItem.findByIdAndUpdate(swapRequest.itemOffered._id, {
            status: 'reserved',
          }),
          ClothingItem.findByIdAndUpdate(swapRequest.itemRequested._id, {
            status: 'reserved',
          }),
        ]);
      }

      await swapRequest.save();

      res.json({
        message: `Swap request ${status}`,
        swapRequest,
      });
    } catch (error) {
      console.error('Respond to swap error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Complete swap
router.put('/:id/complete', auth, async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id).populate([
      'itemOffered',
      'itemRequested',
    ]);

    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    if (swapRequest.status !== 'accepted') {
      return res
        .status(400)
        .json({ message: 'Swap request must be accepted first' });
    }

    // Check if user is involved in the swap
    const isRequester =
      swapRequest.requester.toString() === req.user._id.toString();
    const isOwner =
      swapRequest.itemRequested.owner.toString() === req.user._id.toString();

    if (!isRequester && !isOwner) {
      return res
        .status(403)
        .json({ message: 'Not authorized to complete this swap' });
    }

    swapRequest.status = 'completed';
    swapRequest.completedAt = new Date();

    // Mark both items as swapped
    await Promise.all([
      ClothingItem.findByIdAndUpdate(swapRequest.itemOffered._id, {
        status: 'swapped',
      }),
      ClothingItem.findByIdAndUpdate(swapRequest.itemRequested._id, {
        status: 'swapped',
      }),
      swapRequest.save(),
    ]);

    res.json({
      message: 'Swap completed successfully',
      swapRequest,
    });
  } catch (error) {
    console.error('Complete swap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel swap request
router.delete('/:id', auth, async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id);

    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Only requester can cancel
    if (swapRequest.requester.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to cancel this request' });
    }

    if (swapRequest.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed swap' });
    }

    swapRequest.status = 'cancelled';
    await swapRequest.save();

    // If swap was accepted, make items available again
    if (swapRequest.status === 'accepted') {
      await Promise.all([
        ClothingItem.findByIdAndUpdate(swapRequest.itemOffered, {
          status: 'available',
        }),
        ClothingItem.findByIdAndUpdate(swapRequest.itemRequested, {
          status: 'available',
        }),
      ]);
    }

    res.json({ message: 'Swap request cancelled' });
  } catch (error) {
    console.error('Cancel swap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;