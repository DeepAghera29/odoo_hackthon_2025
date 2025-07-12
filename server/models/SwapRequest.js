const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemOffered: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClothingItem',
    required: true
  },
  itemRequested: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClothingItem',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  message: {
    type: String,
    trim: true,
    maxlength: 500
  },
  responseMessage: {
    type: String,
    trim: true,
    maxlength: 500
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for queries
swapRequestSchema.index({ requester: 1, status: 1 });
swapRequestSchema.index({ itemRequested: 1, status: 1 });
swapRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('SwapRequest', swapRequestSchema);