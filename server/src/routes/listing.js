const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { validate } = require('../middleware/validate');
const schemas = require('../validations/schemas');

router.post(
  '/',
  auth,
  role(['farmer']),
  validate({ body: schemas.listingCreateBody }),
  listingController.createListing
);

router.get(
  '/',
  auth,
  role(['salesman', 'business', 'admin']),
  validate({ query: schemas.emptyQuery }),
  listingController.getAllListings
);

router.get(
  '/my',
  auth,
  role(['farmer']),
  validate({ query: schemas.emptyQuery }),
  listingController.getFarmerListings
);

router.patch(
  '/:id',
  auth,
  role(['farmer']),
  validate({ params: schemas.listingIdParams, body: schemas.listingPatchBody }),
  listingController.updateListingStatus
);

module.exports = router;
