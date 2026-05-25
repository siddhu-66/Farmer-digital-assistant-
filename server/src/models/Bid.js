const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  salesman: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  offeredPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  notes: String,
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'], 
    default: 'pending' 
  },
  deliveryRequested: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bid', BidSchema);
