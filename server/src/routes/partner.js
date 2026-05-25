const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { validate } = require('../middleware/validate');
const schemas = require('../validations/schemas');

router.get(
  '/nearby',
  auth,
  role(['farmer']),
  validate({ query: schemas.partnerNearbyQuery }),
  partnerController.getNearbyPartners
);

router.post(
  '/',
  auth,
  role(['admin']),
  validate({ body: schemas.partnerCreateBody }),
  partnerController.createPartner
);

module.exports = router;
