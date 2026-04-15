// src/models/product.model.js

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true
    },

    description: {
      type: String
    },

    // RELATIONS
    category: {
      type: String, // "laptops", "mobiles"
      required: true,
      index: true
    },

    type: {
      type: String, // "gaming", "android"
      index: true
    },

    brand: {
      type: String, // "apple", "samsung"
      index: true
    },

    // PRICING
    price: {
      type: Number,
      required: true
    },

    discountPrice: {
      type: Number
    },

    currency: {
      type: String,
      default: "INR"
    },

    // MEDIA
    images: [
      {
        url: String,
        alt: String
      }
    ],

    thumbnail: {
      type: String
    },

    // FLAGS (important for your UI sections)
    isTrending: {
      type: Boolean,
      default: false
    },

    isBestDeal: {
      type: Boolean,
      default: false
    },

    
    // RATINGS
    rating: {
      type: Number,
      default: 0
    },

    totalReviews: {
      type: Number,
      default: 0
    },

    ratingBreakdown: {
      averageRating: { type: Number, min: 0, max: 5, default: 0 },
      star5Percentage: { type: Number, min: 0, max: 100, default: 0 },
      star4Percentage: { type: Number, min: 0, max: 100, default: 0 },
      star3Percentage: { type: Number, min: 0, max: 100, default: 0 },
      star2Percentage: { type: Number, min: 0, max: 100, default: 0 },
      star1Percentage: { type: Number, min: 0, max: 100, default: 0 }
    },

    ratingsAndReviews: [
      {
        ratings: {
          type: Number,
          min: 1,
          max: 5,
          required: true
        },
        username: {
          type: String,
          trim: true,
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        },
        review: {
          type: String,
          trim: true,
          required: true
        },
        likes: {
          type: Number,
          min: 0,
          default: 0
        }
      }
    ],

    // STOCK
    inStock: {
      type: Boolean,
      default: true
    },
    productInformation:[
        {
            type:String
        }
    ],
    specifications: {
      type: Map,
      of: String,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Product', productSchema);