const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { validate } = require('../middleware/validate');
const schemas = require('../validations/schemas');

router.post(
  '/',
  auth,
  role(['salesman', 'business']),
  validate({ body: schemas.bidCreateBody }),
  bidController.placeBid
);

router.get(
  '/listings/my',
  auth,
  role(['farmer']),
  validate({ query: schemas.emptyQuery }),
  bidController.getFarmerListingsBids
);

// Salesman/Business — their own submitted bids
router.get(
  '/my',
  auth,
  role(['salesman', 'business']),
  validate({ query: schemas.emptyQuery }),
  bidController.getSalesmanBids
);

router.get(
  '/listing/:listingId',
  auth,
  role(['farmer', 'salesman', 'business', 'admin']),
  validate({ params: schemas.bidListingIdParams, query: schemas.emptyQuery }),
  bidController.getBidsForListing
);

router.patch(
  '/:id',
  auth,
  validate({ params: schemas.bidIdParams, body: schemas.bidPatchBody }),
  bidController.updateBidStatus
);

module.exports = router;
