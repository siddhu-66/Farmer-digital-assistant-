const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  eligibility: String,
  benefits: String,
  applyLink: String,
  category: { type: String, enum: ['subsidy', 'insurance', 'loan', 'training', 'other'], default: 'other' },
  state: String, // For state-specific schemes
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scheme', SchemeSchema);
