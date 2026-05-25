const User = require('../models/User');
const Farmer = require('../models/Farmer');
const { sendServerError } = require('../utils/http');

exports.registerFarmer = async (req, res) => {
  const { registrationData } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Check if farmer profile already exists
    let farmer = await Farmer.findOne({ user: userId });
    if (farmer) return res.status(400).json({ success: false, message: 'Farmer profile already exists' });

    // Create farmer profile using MongoDB
    farmer = new Farmer({
      user: userId,
      experienceYears: registrationData.experienceYears,
      primaryCrops: registrationData.primaryCrops,
      landArea: registrationData.landArea,
      landType: registrationData.landType,
      irrigationType: registrationData.irrigationType,
      location: {
        state: registrationData.location?.state,
        district: registrationData.location?.district,
        village: registrationData.location?.village,
        address: registrationData.location?.address,
        pinCode: registrationData.location?.pinCode
      },
      documents: {
        aadhaarNumber: registrationData.documents?.aadhaarNumber,
        aadhaarUrl: registrationData.documents?.aadhaarUrl
      }
    });

    await farmer.save();

    // Update user status to pending
    await User.findByIdAndUpdate(userId, { status: 'pending' });

    res.status(201).json({ success: true, message: 'Farmer registration submitted', farmer });
  } catch (err) {
    console.error('Registration Error:', err);
    return sendServerError(res, err);
  }
};

exports.getFarmerStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const farmer = await Farmer.findOne({ user: req.user.id }).populate('user');
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer profile not found' });

    const locationParts = [
      farmer.location?.village,
      farmer.location?.district,
      farmer.location?.state,
    ].filter(Boolean);

    res.json({
      success: true,
      status: user.status,
      verified: user.verified,
      farmerName: user.name,
      mobile: user.mobile,
      email: user.email,
      id: farmer._id,
      rejection_reason: farmer.rejectionReason,
      applied_at: farmer.createdAt,
      approved_at: farmer.updatedAt,
      name: user.name,
      phone: user.mobile,
      location: locationParts.length ? locationParts.join(', ') : 'India',
      landSize: parseFloat(farmer.landArea) || 12.5,
      soilType: farmer.landType || 'Alluvial (Loamy)',
      contracts: [],
    });
  } catch (err) {
    console.error('[FarmerController] getFarmerStatus error:', err);
    return sendServerError(res, err);
  }
};

exports.getAllFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find().populate('user');
    res.json(farmers);
  } catch (err) {
    return sendServerError(res, err);
  }
};

exports.updateFarmer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const farmer = await Farmer.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    );

    res.json({ success: true, message: 'Profile updated', farmer });
  } catch (err) {
    return sendServerError(res, err);
  }
};

exports.deleteFarmer = async (req, res) => {
  try {
    const { id } = req.params;
    await Farmer.findByIdAndDelete(id);
    res.json({ success: true, message: 'Farmer record deleted' });
  } catch (err) {
    return sendServerError(res, err);
  }
};
