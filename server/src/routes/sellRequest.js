const express = require('express');
const router = express.Router();
const sellRequestController = require('../controllers/sellRequestController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { validate } = require('../middleware/validate');
const schemas = require('../validations/schemas');

router.post(
  '/',
  auth,
  role(['farmer']),
  validate({ body: schemas.sellRequestCreateBody }),
  sellRequestController.createSellRequest
);

router.get(
  '/my',
  auth,
  role(['farmer']),
  validate({ query: schemas.sellRequestsQuery }),
  sellRequestController.getMySellRequests
);

// Admin routes
router.get(
  '/all',
  auth,
  role(['admin']),
  validate({ query: schemas.sellRequestsQuery }),
  sellRequestController.getAllSellRequests
);

router.put(
  '/:id/assign',
  auth,
  role(['admin']),
  validate({ body: schemas.sellRequestAssignBody }),
  sellRequestController.assignSellRequest
);

router.put(
  '/:id/reject',
  auth,
  role(['admin']),
  validate({ body: schemas.sellRequestRejectAdminBody }),
  sellRequestController.rejectSellRequestByAdmin
);

// Business routes
router.get(
  '/assigned',
  auth,
  role(['business']),
  validate({ query: schemas.sellRequestsQuery }),
  sellRequestController.getAssignedSellRequestsForBusiness
);

router.put(
  '/:id/accept',
  auth,
  role(['business']),
  validate({ body: schemas.sellRequestBusinessActionBody }),
  sellRequestController.acceptSellRequestByBusiness
);

router.put(
  '/:id/reject-business',
  auth,
  role(['business']),
  validate({ body: schemas.sellRequestBusinessActionBody }),
  sellRequestController.rejectSellRequestByBusiness
);

module.exports = router;

