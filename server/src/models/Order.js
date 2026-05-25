const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  salesman: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  crop: { type: String, required: true },
  quantity: { type: Number, required: true },
  pricePerQtl: Number,
  deliveryLocation: String,
  deliveryDate: Date,
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Assigned', 'In Progress', 'Completed', 'Rejected'],
    default: 'Pending'
  },
  assignedFarmers: [{
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Notified', 'Accepted', 'Declined'], default: 'Notified' }
  }],
  adminNotes: String,
  rejectionReason: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
