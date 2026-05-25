const mongoose = require('mongoose');

/**
 * CropPrediction Schema
 * ---------------------
 * Stores farmer-submitted crop details along with
 * ML-predicted quality and price from the Flask service.
 */
const CropPredictionSchema = new mongoose.Schema(
  {
    // ── Who submitted ─────────────────────────────────────────────────────────
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // ── Crop Input Features ───────────────────────────────────────────────────
    cropName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    moisture: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      comment: 'Moisture content in percent (e.g. 12 means 12%)',
    },
    size: {
      type: String,
      enum: ['Small', 'Medium', 'Large'],
      required: true,
    },
    colorScore: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
      comment: 'Visual colour score rated 1-10 by farmer',
    },
    freshnessDays: {
      type: Number,
      required: true,
      min: 0,
      comment: 'Days since harvest',
    },
    damagePercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      comment: 'Estimated physical damage in percent',
    },
    marketDemand: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: true,
    },
    marketPrice: {
      type: Number,
      default: null,
      comment: 'Current mandi/market price (₹/qtl) provided by farmer',
    },

    // ── ML Outputs ────────────────────────────────────────────────────────────
    quality: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: null,
      comment: 'ML predicted quality tier',
    },
    predictedPrice: {
      type: Number,
      default: null,
      comment: 'ML predicted price (₹/qtl)',
    },
    finalPrice: {
      type: Number,
      default: null,
      comment: '(ML price + market price) / 2',
    },
    mlError: {
      type: String,
      default: null,
      comment: 'Stores error message if ML prediction failed',
    },

    // ── Admin Review Status ───────────────────────────────────────────────────
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
      maxlength: 2000,
      default: null,
    },
  },
  { timestamps: true }  // adds createdAt, updatedAt automatically
);

module.exports = mongoose.model('CropPrediction', CropPredictionSchema);
