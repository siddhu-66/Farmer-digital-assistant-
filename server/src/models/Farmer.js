const mongoose = require('mongoose');

const FarmerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  experienceYears: String,
  primaryCrops: [String],
  landArea: String,
  landType: String,
  irrigationType: String,
  location: {
    state: String,
    district: String,
    village: String,
    address: String,
    pinCode: String
  },
  documents: {
    aadhaarNumber: String,
    aadhaarUrl: String,
    landDocUrl: String
  },
  rejectionReason: String,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Farmer', FarmerSchema);
