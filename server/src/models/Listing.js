const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  crop: { type: String, required: true },
  variety: String,
  quantity: { type: Number, required: true }, // in Quintals
  unit: { type: String, default: 'qtl' },
  pricePerUnit: { type: Number, required: true },
  qualityGrade: { type: String, enum: ['A+', 'A', 'B', 'C'], default: 'B' },
  location: {
    state: String,
    district: String,
    village: String
  },
  description: String,
  images: [String],
  status: { 
    type: String, 
    enum: ['active', 'sold', 'expired', 'removed'], 
    default: 'active' 
  },
  expiryDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', ListingSchema);
