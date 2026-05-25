const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/cropPredictionController');
const auth    = require('../middleware/auth');
const role    = require('../middleware/role');
const { validate } = require('../middleware/validate');
const { z } = require('zod');

// ── Validation Schema ─────────────────────────────────────────────────────────
const cropPredictBody = z.object({
  cropName:      z.string().trim().min(1).max(120),
  moisture:      z.coerce.number().min(0).max(100),
  size:          z.enum(['Small', 'Medium', 'Large']),
  colorScore:    z.coerce.number().min(1).max(10),
  freshnessDays: z.coerce.number().min(0),
  damagePercent: z.coerce.number().min(0).max(100),
  marketDemand:  z.enum(['Low', 'Medium', 'High']),
  marketPrice:   z.coerce.number().nonnegative().optional(),
});

const statusUpdateBody = z.object({
  status:     z.enum(['pending', 'approved', 'rejected']),
  adminNotes: z.string().max(2000).optional(),
});

// ── Routes ────────────────────────────────────────────────────────────────────

/**
 * POST /api/crops/predict
 * Farmer submits crop details → ML predicts quality + price → saved to MongoDB
 */
router.post(
  '/predict',
  auth,
  role(['farmer']),
  validate({ body: cropPredictBody }),
  ctrl.submitCropForPrediction
);

/**
 * GET /api/crops/my
 * Farmer gets their own past submissions and predictions
 */
router.get(
  '/my',
  auth,
  role(['farmer']),
  ctrl.getMyPredictions
);

/**
 * GET /api/crops
 * Admin views all crop submissions (optionally filtered by status)
 */
router.get(
  '/',
  auth,
  role(['admin']),
  ctrl.getAllPredictions
);

/**
 * GET /api/crops/approved
 * Business views approved crop predictions
 */
router.get(
  '/approved',
  auth,
  role(['admin', 'business', 'salesman']),
  ctrl.getApprovedCrops
);

/**
 * PATCH /api/crops/:id/status
 * Admin approves or rejects a submission
 */
router.patch(
  '/:id/status',
  auth,
  role(['admin']),
  validate({ body: statusUpdateBody }),
  ctrl.updateCropStatus
);

module.exports = router;
