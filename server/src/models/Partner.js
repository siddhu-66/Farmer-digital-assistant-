const mongoose = require('mongoose');

const PartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Bio-Refinery', 'Feed Processor', 'Power Plant', 'Other'], 
    default: 'Other' 
  },
  location: { type: String, required: true },
  distance: { type: Number, default: 0 }, // in KM (relative or absolute)
  accepts: [String], // Array of residue types (e.g., 'Wheat Straw', 'Maize Stover')
  contactPerson: String,
  phone: String,
  email: String,
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Partner', PartnerSchema);
