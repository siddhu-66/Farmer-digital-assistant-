const SellRequest = require('../models/SellRequest');
const Business = require('../models/Business');
const { sendServerError } = require('../utils/http');

const STATUSES = {
  PENDING: 'PENDING',
  APPROVED_BY_ADMIN: 'APPROVED_BY_ADMIN',
  REJECTED_BY_ADMIN: 'REJECTED_BY_ADMIN',
  SENT_TO_BUSINESS: 'SENT_TO_BUSINESS',
  ACCEPTED_BY_BUSINESS: 'ACCEPTED_BY_BUSINESS',
  REJECTED_BY_BUSINESS: 'REJECTED_BY_BUSINESS',
  COMPLETED: 'COMPLETED',
};

function getBusinessForUserId(userId) {
  return Business.findOne({ user: userId });
}

exports.createSellRequest = async (req, res) => {
  try {
    const {
      cropName,
      quantity,
      expectedPrice,
      location,
      description,
      image,
    } = req.body;

    const sellRequest = new SellRequest({
      farmerId: req.user.id,
      cropName,
      quantity,
      expectedPrice,
      location,
      description,
      image,
      status: STATUSES.PENDING,
    });

    await sellRequest.save();
    res.status(201).json(sellRequest);
  } catch (err) {
    return sendServerError(res, err);
  }
};

exports.getMySellRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { farmerId: req.user.id };
    if (status) query.status = status;

    const sellRequests = await SellRequest.find(query).sort({ createdAt: -1 }).lean();
    res.json(Array.isArray(sellRequests) ? sellRequests : []);
  } catch (err) {
    return sendServerError(res, err);
  }
};

exports.getAllSellRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const sellRequests = await SellRequest.find(query)
      .populate('farmerId', 'name mobile email')
      .populate('assignedBusinessId', 'orgName businessType gstNumber')
      .sort({ createdAt: -1 })
      .lean();

    res.json(Array.isArray(sellRequests) ? sellRequests : []);
  } catch (err) {
    return sendServerError(res, err);
  }
};

exports.assignSellRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedBusinessId, adminRemarks } = req.body;

    const [sellRequest, business] = await Promise.all([
      SellRequest.findById(id),
      Business.findById(assignedBusinessId),
    ]);

    if (!sellRequest) return res.status(404).json({ success: false, message: 'Sell request not found' });
    if (!business) return res.status(404).json({ success: false, message: 'Business not found' });

    if (sellRequest.status !== STATUSES.PENDING) {
      return res.status(400).json({ success: false, message: 'Sell request cannot be assigned in its current status' });
    }

    sellRequest.assignedBusinessId = business._id;
    sellRequest.adminRemarks = adminRemarks;
    sellRequest.status = STATUSES.APPROVED_BY_ADMIN;
    
    // Add status history with user info
    sellRequest.statusHistory.push({
      status: STATUSES.APPROVED_BY_ADMIN,
      changedBy: req.user.id,
      changedByRole: req.user.role,
      remarks: adminRemarks,
      timestamp: new Date()
    });

    await sellRequest.save();
    
    // Then immediately send to business
    sellRequest.status = STATUSES.SENT_TO_BUSINESS;
    sellRequest.statusHistory.push({
      status: STATUSES.SENT_TO_BUSINESS,
      changedBy: req.user.id,
      changedByRole: req.user.role,
      remarks: `Assigned to business: ${business.orgName}`,
      timestamp: new Date()
    });
    
    await sellRequest.save();
    res.json(sellRequest);
  } catch (err) {
    return sendServerError(res, err);
  }
};

exports.rejectSellRequestByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminRemarks } = req.body;

    const sellRequest = await SellRequest.findById(id);
    if (!sellRequest) return res.status(404).json({ success: false, message: 'Sell request not found' });

    if (sellRequest.status !== STATUSES.PENDING) {
      return res.status(400).json({ success: false, message: 'Sell request cannot be rejected in its current status' });
    }

    sellRequest.status = STATUSES.REJECTED_BY_ADMIN;
    sellRequest.adminRemarks = adminRemarks;
    sellRequest.assignedBusinessId = null;
    
    // Add status history
    sellRequest.statusHistory.push({
      status: STATUSES.REJECTED_BY_ADMIN,
      changedBy: req.user.id,
      changedByRole: req.user.role,
      remarks: adminRemarks,
      timestamp: new Date()
    });

    await sellRequest.save();
    res.json(sellRequest);
  } catch (err) {
    return sendServerError(res, err);
  }
};

exports.getAssignedSellRequestsForBusiness = async (req, res) => {
  try {
    const business = await getBusinessForUserId(req.user.id);
    if (!business) return res.status(404).json({ success: false, message: 'Business profile not found' });

    const { status } = req.query;
    const query = { assignedBusinessId: business._id };
    if (status) query.status = status;

    const sellRequests = await SellRequest.find(query)
      .populate('farmerId', 'name mobile email')
      .sort({ createdAt: -1 })
      .lean();

    res.json(Array.isArray(sellRequests) ? sellRequests : []);
  } catch (err) {
    return sendServerError(res, err);
  }
};

exports.acceptSellRequestByBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const { businessRemarks } = req.body || {};

    const business = await getBusinessForUserId(req.user.id);
    if (!business) return res.status(404).json({ success: false, message: 'Business profile not found' });

    const sellRequest = await SellRequest.findById(id);
    if (!sellRequest) return res.status(404).json({ success: false, message: 'Sell request not found' });

    const isAssignedToMe = String(sellRequest.assignedBusinessId) === String(business._id);
    if (!isAssignedToMe) return res.status(403).json({ success: false, message: 'Forbidden' });

    if (sellRequest.status !== STATUSES.SENT_TO_BUSINESS) {
      return res.status(400).json({ success: false, message: 'Sell request cannot be accepted in its current status' });
    }

    sellRequest.status = STATUSES.ACCEPTED_BY_BUSINESS;
    sellRequest.businessRemarks = businessRemarks;
    
    // Add status history
    sellRequest.statusHistory.push({
      status: STATUSES.ACCEPTED_BY_BUSINESS,
      changedBy: req.user.id,
      changedByRole: req.user.role,
      remarks: businessRemarks,
      timestamp: new Date()
    });
    
    await sellRequest.save();
    res.json(sellRequest);
  } catch (err) {
    return sendServerError(res, err);
  }
};

exports.rejectSellRequestByBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const { businessRemarks } = req.body || {};

    const business = await getBusinessForUserId(req.user.id);
    if (!business) return res.status(404).json({ success: false, message: 'Business profile not found' });

    const sellRequest = await SellRequest.findById(id);
    if (!sellRequest) return res.status(404).json({ success: false, message: 'Sell request not found' });

    const isAssignedToMe = String(sellRequest.assignedBusinessId) === String(business._id);
    if (!isAssignedToMe) return res.status(403).json({ success: false, message: 'Forbidden' });

    if (sellRequest.status !== STATUSES.SENT_TO_BUSINESS) {
      return res.status(400).json({ success: false, message: 'Sell request cannot be rejected in its current status' });
    }

    sellRequest.status = STATUSES.REJECTED_BY_BUSINESS;
    sellRequest.businessRemarks = businessRemarks;
    
    // Add status history
    sellRequest.statusHistory.push({
      status: STATUSES.REJECTED_BY_BUSINESS,
      changedBy: req.user.id,
      changedByRole: req.user.role,
      remarks: businessRemarks,
      timestamp: new Date()
    });

    await sellRequest.save();
    res.json(sellRequest);
  } catch (err) {
    return sendServerError(res, err);
  }
};

