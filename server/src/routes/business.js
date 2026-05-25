const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const sellRequestController = require('../controllers/sellRequestController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { validate } = require('../middleware/validate');
const schemas = require('../validations/schemas');

router.post(
  '/register',
  auth,
  validate({ body: schemas.businessRegisterBody }),
  businessController.registerBusiness
);

router.get(
  '/status',
  auth,
  validate({ query: schemas.emptyQuery }),
  businessController.getBusinessStatus
);

router.get(
  '/all',
  auth,
  role(['admin']),
  validate({ query: schemas.emptyQuery }),
  businessController.getAllBusinesses
);

router.get(
  '/sell-requests',
  auth,
  role(['business']),
  validate({ query: schemas.sellRequestsQuery }),
  sellRequestController.getAssignedSellRequestsForBusiness
);

router.put(
  '/sell-request/:id/accept',
  auth,
  role(['business']),
  validate({ params: schemas.sellRequestIdParams, body: schemas.sellRequestBusinessActionBody }),
  sellRequestController.acceptSellRequestByBusiness
);

router.put(
  '/sell-request/:id/reject',
  auth,
  role(['business']),
  validate({ params: schemas.sellRequestIdParams, body: schemas.sellRequestBusinessActionBody }),
  sellRequestController.rejectSellRequestByBusiness
);

router.get(
  '/verified-farmer-listings',
  auth,
  role(['business', 'salesman']),
  validate({ query: schemas.emptyQuery }),
  businessController.getVerifiedFarmerListings
);

module.exports = router;
