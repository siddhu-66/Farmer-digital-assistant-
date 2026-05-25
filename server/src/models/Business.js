const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orgName: { type: String, required: true, unique: true },
  businessType: { type: String, enum: ['Mandi', 'Trader', 'Wholesaler'], required: true },
  gstNumber: { type: String, required: true },
  location: String,
  gpsLocation: String,
  documents: {
    gstCertificateUrl: String,
    shopPhotos: [String]
  },
  rejectionReason: String,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Business', BusinessSchema);
