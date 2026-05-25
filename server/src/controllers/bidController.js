const Bid = require('../models/Bid');
const Listing = require('../models/Listing');
const { sendServerError } = require('../utils/http');

exports.placeBid = async (req, res) => {
  try {
    const { listingId, offeredPrice, quantity, notes } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing || listing.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Listing is no longer active' });
    }

    const bid = new Bid({
      listing: listingId,
      salesman: req.user.id,
      offeredPrice,
      quantity,
      notes,
    });

    await bid.save();
    res.status(201).json(bid);
  } catch (err) {
    return sendServerError(res, err);
  }
};

exports.getBidsForListing = async (req, res) => {
  try {
    const bids = await Bid.find({ listing: req.params.listingId })
      .populate('salesman', 'name mobile')
      .lean();
    res.json(Array.isArray(bids) ? bids : []);
  } catch (err) {
    return sendServerError(res, err);
  }
};

exports.updateBidStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const bid = await Bid.findById(req.params.id).populate('listing');

    if (!bid) return res.status(404).json({ success: false, message: 'Bid not found' });

    // FIXED: Guard against null listing (can happen if listing was deleted)
    if (!bid.listing) {
      return res.status(400).json({ success: false, message: 'Associated listing no longer exists' });
    }

    const isOwner = bid.listing.farmer && bid.listing.farmer.toString() === req.user.id;
    const salesmanId =
      bid.salesman && typeof bid.salesman === 'object' && bid.salesman._id
        ? bid.salesman._id.toString()
        : String(bid.salesman);
    const isSalesman = salesmanId === req.user.id;

    if (!isOwner && !isSalesman) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    bid.status = status;
    await bid.save();

    if (status === 'accepted') {
      const Order = require('../models/Order');
      const User = require('../models/User');

      await Listing.findByIdAndUpdate(bid.listing._id, { status: 'sold' });

      await Bid.updateMany(
        { listing: bid.listing._id, _id: { $ne: bid._id }, status: 'pending' },
        { status: 'rejected' }
      );

      const farmer = await User.findById(bid.listing.farmer);
      const order = new Order({
        salesman: bid.salesman,
        crop: bid.listing.crop,
        quantity: bid.quantity,
        pricePerQtl: bid.offeredPrice,
        customerName: farmer?.name || 'Farmer',
        deliveryLocation: farmer?.location
          ? `${farmer.location.district || ''}, ${farmer.location.state || ''}`.trim().replace(/^,\s*/, '')
          : 'Unknown Location',
        status: 'Pending',
        assignedFarmers: [{ farmer: bid.listing.farmer, status: 'Accepted' }],
      });
      await order.save();
    }

    res.json(bid);
  } catch (err) {
    return sendServerError(res, err);
  }
};

exports.getSalesmanBids = async (req, res) => {
  try {
    const bids = await Bid.find({ salesman: req.user.id }).populate('listing').lean();
    res.json(Array.isArray(bids) ? bids : []);
  } catch (err) {
    return sendServerError(res, err);
  }
};

exports.getFarmerListingsBids = async (req, res) => {
  try {
    const listings = await Listing.find({ farmer: req.user.id }).select('_id').lean();
    const listingIds = listings.map((l) => l._id);
    const bids = await Bid.find({ listing: { $in: listingIds } })
      .populate('salesman', 'name mobile')
      .populate('listing', 'crop quantity unit pricePerUnit')
      .lean();
    res.json(Array.isArray(bids) ? bids : []);
  } catch (err) {
    return sendServerError(res, err);
  }
};
