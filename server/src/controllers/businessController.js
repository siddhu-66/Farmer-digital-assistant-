const Business = require('../models/Business');
const User = require('../models/User');
const Listing = require('../models/Listing');
const { sendServerError } = require('../utils/http');

exports.registerBusiness = async (req, res) => {
  const { businessData } = req.body;
  const userId = req.user.id;

  try {
    let business = await Business.findOne({ user: userId });
    if (business) return res.status(400).json({ success: false, message: 'Business profile already exists' });

    business = new Business({
      user: userId,
      ...businessData,
    });

    await business.save();

    await User.findByIdAndUpdate(userId, { status: 'pending' });

    res.status(201).json({ success: true, message: 'Business registration submitted for review', business });
  } catch (err) {
    return sendServerError(res, err);
  }
};

exports.getBusinessStatus = async (req, res) => {
  try {
    const business = await Business.findOne({ user: req.user.id });
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      status: user.status,
      verified: user.verified,
      rejectionReason: business ? business.rejectionReason : null,
    });
  } catch (err) {
    return sendServerError(res, err);
  }
};

exports.getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find().populate('user', 'name mobile email status verified');
    res.json(businesses);
  } catch (err) {
    return sendServerError(res, err);
  }
};

// NEW: Get verified farmer listings for business users
exports.getVerifiedFarmerListings = async (req, res) => {
  try {
    // Only allow business/salesman roles
    if (req.user.role !== 'business' && req.user.role !== 'salesman') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Get listings from verified farmers only
    const verifiedFarmerListings = await Listing.find({ status: 'active' })
      .populate({
        path: 'farmer',
        select: 'name mobile status verified',
        match: { status: { $in: ['verified', 'approved'] }, verified: true }
      })
      .lean();

    // Filter out listings where farmer population didn't match (unverified farmers)
    const filteredListings = verifiedFarmerListings.filter((listing) => listing.farmer);

    res.json({
      success: true,
      listings: filteredListings,
      count: filteredListings.length
    });
  } catch (err) {
    console.error('[Business Controller] getVerifiedFarmerListings error:', err);
    return sendServerError(res, err);
  }
};
