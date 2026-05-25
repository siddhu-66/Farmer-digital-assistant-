const Crop = require('../models/Crop');
const { sendServerError } = require('../utils/http');

// Create a new crop
exports.createCrop = async (req, res) => {
  try {
    const { cropName, category, season, description, basePrice, unit, imageUrl } = req.body;
    
    const crop = new Crop({
      cropName,
      category,
      season,
      description,
      basePrice,
      unit,
      imageUrl,
      createdBy: req.user.id
    });
    
    await crop.save();
    
    res.status(201).json({
      success: true,
      message: 'Crop created successfully',
      data: crop
    });
  } catch (err) {
    return sendServerError(res, err);
  }
};

// Get all crops (with optional filters)
exports.getCrops = async (req, res) => {
  try {
    const { category, season, isActive } = req.query;
    
    const query = {};
    if (category) query.category = category;
    if (season) query.season = season;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    const crops = await Crop.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: crops
    });
  } catch (err) {
    return sendServerError(res, err);
  }
};

// Get crop by ID
exports.getCropById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const crop = await Crop.findById(id).populate('createdBy', 'name email');
    
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }
    
    res.json({
      success: true,
      data: crop
    });
  } catch (err) {
    return sendServerError(res, err);
  }
};

// Update crop
exports.updateCrop = async (req, res) => {
  try {
    const { id } = req.params;
    const { cropName, category, season, description, basePrice, unit, imageUrl, isActive } = req.body;
    
    const crop = await Crop.findByIdAndUpdate(
      id,
      { cropName, category, season, description, basePrice, unit, imageUrl, isActive },
      { new: true, runValidators: true }
    );
    
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Crop updated successfully',
      data: crop
    });
  } catch (err) {
    return sendServerError(res, err);
  }
};

// Delete crop
exports.deleteCrop = async (req, res) => {
  try {
    const { id } = req.params;
    
    const crop = await Crop.findByIdAndDelete(id);
    
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Crop deleted successfully'
    });
  } catch (err) {
    return sendServerError(res, err);
  }
};
