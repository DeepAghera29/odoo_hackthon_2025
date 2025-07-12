const mongoose = require('mongoose');

const pointTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClothingItem',
    default: null
  },
  type: {
    type: String,
    enum: ['earned', 'spent', 'bonus', 'refund'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  relatedTransaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PointTransaction',
    default: null
  }
}, {
  timestamps: true
});

// Index for user queries
pointTransactionSchema.index({ user: 1, createdAt: -1 });
pointTransactionSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model('PointTransaction', pointTransactionSchema);