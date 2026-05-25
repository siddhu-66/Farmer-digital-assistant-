const express = require('express');
const router = express.Router();
const cropController = require('../controllers/cropManagementController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { validate } = require('../middleware/validate');
const { z } = require('zod');

// Validation schemas
const cropCreateBody = z.object({
  cropName: z.string().trim().min(1).max(200),
  category: z.enum(['Cereals', 'Pulses', 'Oilseeds', 'Vegetables', 'Fruits', 'Cash Crops', 'Spices', 'Other']),
  season: z.enum(['Kharif', 'Rabi', 'Zaid', 'All Season']),
  description: z.string().max(2000).optional(),
  basePrice: z.coerce.number().nonnegative(),
  unit: z.enum(['kg', 'quintal', 'ton', 'bushel']),
  imageUrl: z.string().max(200000).optional()
});

const cropUpdateBody = z.object({
  cropName: z.string().trim().min(1).max(200).optional(),
  category: z.enum(['Cereals', 'Pulses', 'Oilseeds', 'Vegetables', 'Fruits', 'Cash Crops', 'Spices', 'Other']).optional(),
  season: z.enum(['Kharif', 'Rabi', 'Zaid', 'All Season']).optional(),
  description: z.string().max(2000).optional(),
  basePrice: z.coerce.number().nonnegative().optional(),
  unit: z.enum(['kg', 'quintal', 'ton', 'bushel']).optional(),
  imageUrl: z.string().max(200000).optional(),
  isActive: z.boolean().optional()
});

// POST /api/crop-management - Create crop (Admin only)
router.post(
  '/',
  auth,
  role(['admin']),
  validate({ body: cropCreateBody }),
  cropController.createCrop
);

// GET /api/crop-management - Get all crops (Admin and Farmer)
router.get(
  '/',
  auth,
  role(['admin', 'farmer']),
  cropController.getCrops
);

// GET /api/crop-management/:id - Get crop by ID
router.get(
  '/:id',
  auth,
  role(['admin', 'farmer']),
  cropController.getCropById
);

// PUT /api/crop-management/:id - Update crop (Admin only)
router.put(
  '/:id',
  auth,
  role(['admin']),
  validate({ body: cropUpdateBody }),
  cropController.updateCrop
);

// DELETE /api/crop-management/:id - Delete crop (Admin only)
router.delete(
  '/:id',
  auth,
  role(['admin']),
  cropController.deleteCrop
);

module.exports = router;
