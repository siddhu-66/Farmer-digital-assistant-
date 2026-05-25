/**
 * cropPredictionController.js
 * ---------------------------
 * Handles crop submission, calls the Flask ML service,
 * saves the prediction result in MongoDB.
 *
 * Flow:
 *  Farmer fills form → POST /api/crops/predict
 *    → Node calls Flask POST /predict
 *    → Flask returns { quality, predictedPrice, finalPrice }
 *    → Node saves record to MongoDB
 *    → Returns full record to frontend
 */

const axios = require('axios');
const CropPrediction = require('../models/CropPrediction');
const { sendServerError } = require('../utils/http');

// Flask ML service URL — change port if needed
const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5000';

// ── Submit crop + get ML prediction ──────────────────────────────────────────
exports.submitCropForPrediction = async (req, res) => {
  try {
    const {
      cropName, moisture, size, colorScore,
      freshnessDays, damagePercent, marketDemand, marketPrice,
    } = req.body;
    // ── Call Flask ML API ─────────────────────────────────────────────────
    let mlResult = {};
    let mlError  = null;

    try {
      const flaskRes = await axios.post(`${ML_API_URL}/predict`, {
        cropName, moisture, size, colorScore,
        freshnessDays, damagePercent, marketDemand, marketPrice,
      }, { timeout: 8000 }); // 8-second timeout

      mlResult = flaskRes.data;
    } catch (mlErr) {
      // ML service may be down — save record anyway without prediction
      mlError = mlErr.response?.data?.error || mlErr.message || 'ML service unavailable';
      console.error('[ML] Prediction failed:', mlError);
    }

    // ── Save to MongoDB ────────────────────────────────────────────────────
    const record = new CropPrediction({
      farmer:         req.user.id,
      cropName,
      moisture,
      size,
      colorScore,
      freshnessDays,
      damagePercent,
      marketDemand,
      marketPrice:    marketPrice || null,
      quality:        mlResult.quality        || null,
      predictedPrice: mlResult.predictedPrice || null,
      finalPrice:     mlResult.finalPrice     || null,
      mlError:        mlError,
      status:         'pending',
    });

    await record.save();

    return res.status(201).json({
      success:  true,
      message:  mlError ? 'Crop saved (ML prediction unavailable)' : 'Crop analysed successfully!',
      data:     record,
      mlError:  mlError || undefined,
    });

  } catch (err) {
    return sendServerError(res, err);
  }
};

// ── Farmer: get own submissions ───────────────────────────────────────────────
exports.getMyPredictions = async (req, res) => {
  try {
    const records = await CropPrediction
      .find({ farmer: req.user.id })
      .sort({ createdAt: -1 })
      .lean();
    return res.json(Array.isArray(records) ? records : []);
  } catch (err) {
    return sendServerError(res, err);
  }
};

// ── Admin: get all pending submissions ───────────────────────────────────────
exports.getAllPredictions = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const records = await CropPrediction
      .find(query)
      .populate('farmer', 'name mobile')
      .sort({ createdAt: -1 })
      .lean();
    return res.json(Array.isArray(records) ? records : []);
  } catch (err) {
    return sendServerError(res, err);
  }
};

// ── Admin/Business: approve or reject a crop ─────────────────────────────────
exports.updateCropStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const record = await CropPrediction.findByIdAndUpdate(
      id,
      { status, adminNotes: adminNotes || null },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    return res.json({ success: true, data: record });
  } catch (err) {
    return sendServerError(res, err);
  }
};

// ── Business: view approved crops ────────────────────────────────────────────
exports.getApprovedCrops = async (req, res) => {
  try {
    const records = await CropPrediction
      .find({ status: 'approved' })
      .populate('farmer', 'name mobile')
      .sort({ createdAt: -1 })
      .lean();
    return res.json(Array.isArray(records) ? records : []);
  } catch (err) {
    return sendServerError(res, err);
  }
};
