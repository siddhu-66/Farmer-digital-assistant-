const express = require('express');
const router = express.Router();
const mlController = require('../controllers/mlController');
const auth = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { z } = require('zod');

// Validation schemas for ML endpoints
const mlQualityPredictBody = z.object({
  cropName: z.string().trim().min(1).max(200),
  quantity: z.coerce.number().positive(),
  location: z.string().trim().min(1).max(500),
  season: z.string().trim().max(100).optional(),
  imageUrl: z.string().max(200000).optional(),
  marketPrice: z.coerce.number().nonnegative().optional()
});

const mlPricePredictBody = z.object({
  cropName: z.string().trim().min(1).max(200),
  quantity: z.coerce.number().positive(),
  location: z.string().trim().min(1).max(500),
  season: z.string().trim().max(100).optional(),
  imageUrl: z.string().max(200000).optional(),
  marketPrice: z.coerce.number().nonnegative().optional()
});

// ML Prediction Routes
router.post(
  '/predict-quality',
  auth,
  validate({ body: mlQualityPredictBody }),
  mlController.predictQuality
);

router.post(
  '/predict-price',
  validate({ body: mlPricePredictBody }),
  mlController.predictPrice
);

// Test route without auth for ML service integration testing
router.post(
  '/test-predict-price',
  mlController.predictPrice
);

router.get(
  '/status',
  auth,
  mlController.getMLStatus
);

module.exports = router;
