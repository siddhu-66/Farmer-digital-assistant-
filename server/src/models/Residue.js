const mongoose = require('mongoose');

const ResidueSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cropType: { type: String, required: true },
  quantity: { type: Number, required: true }, // in Tons/Quintals
  source: String, // e.g., 'Harvest Sec A'
  status: { 
    type: String, 
    enum: ['unprocessed', 'processed', 'sold', 'removed'], 
    default: 'unprocessed' 
  },
  actionTaken: String, // e.g., 'Urea Treatment'
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Residue', ResidueSchema);
