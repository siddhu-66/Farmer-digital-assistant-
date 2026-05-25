const express = require('express');
const router = express.Router();
const schemeController = require('../controllers/schemeController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { validate } = require('../middleware/validate');
const schemas = require('../validations/schemas');

router.get(
  '/',
  auth,
  role(['farmer', 'admin']),
  validate({ query: schemas.schemeQuery }),
  schemeController.getSchemes
);

router.post(
  '/',
  auth,
  role(['admin']),
  validate({ body: schemas.schemeCreateBody }),
  schemeController.createScheme
);

module.exports = router;
