const mongoose = require('mongoose');

const clothingItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'tops',
        'bottoms',
        'outerwear',
        'shoes',
        'accessories',
        'dresses',
        'activewear',
      ],
    },
    type: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    size: {
      type: String,
      required: true,
      enum: [
        'XS',
        'S',
        'M',
        'L',
        'XL',
        'XXL',
        '28',
        '30',
        '32',
        '34',
        '36',
        '38',
        '40',
        '42',
      ],
    },
    condition: {
      type: String,
      required: true,
      enum: ['excellent', 'good', 'fair', 'worn'],
    },
    brand: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    color: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
        maxlength: 30,
      },
    ],
    pointValue: {
      type: Number,
      required: true,
      min: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'swapped', 'pending_approval', 'rejected'],
      default: 'pending_approval',
    },
    location: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Text search index
clothingItemSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text',
  brand: 'text',
});

// Other indexes
clothingItemSchema.index({ owner: 1, status: 1 });
clothingItemSchema.index({ status: 1, createdAt: -1 });
clothingItemSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('ClothingItem', clothingItemSchema);