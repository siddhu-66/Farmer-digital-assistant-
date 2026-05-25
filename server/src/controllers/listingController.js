const Listing = require('../models/Listing');
const { sendServerError } = require('../utils/http');

exports.createListing = async (req, res) => {
  try {
    // Handle auth bypass for development
    let farmerId = req.user.id;
    if (farmerId.startsWith('dev-')) {
      // For dev bypass, create mock listing or return error
      return res.status(400).json({ success: false, message: 'Cannot create listings with dev bypass' });
    }
    
    const listing = new Listing({
      farmer: farmerId,
      ...req.body,
    });
    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    return sendServerError(res, err);
  }
};

exports.getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find({ status: 'active' })
      .populate('farmer', 'name mobile')
      .lean();
    res.json(Array.isArray(listings) ? listings : []);
  } catch (err) {
    return sendServerError(res, err);
  }
};

exports.getFarmerListings = async (req, res) => {
  try {
    // Handle auth bypass for development
    let farmerId = req.user.id;
    if (farmerId.startsWith('dev-')) {
      // For dev bypass, return empty array or mock data
      return res.json([]);
    }
    
    const listings = await Listing.find({ farmer: farmerId }).lean();
    res.json(Array.isArray(listings) ? listings : []);
  } catch (err) {
    return sendServerError(res, err);
  }
};

exports.updateListingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const listing = await Listing.findOneAndUpdate(
      { _id: req.params.id, farmer: req.user.id },
      { status },
      { new: true }
    );
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found or unauthorized' });
    res.json(listing);
  } catch (err) {
    return sendServerError(res, err);
  }
};
