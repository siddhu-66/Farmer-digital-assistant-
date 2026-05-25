const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');
const sellRequestController = require('../controllers/sellRequestController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { validate } = require('../middleware/validate');
const schemas = require('../validations/schemas');

router.post(
  '/register',
  auth,
  validate({ body: schemas.farmerRegisterBody }),
  farmerController.registerFarmer
);

router.get(
  '/status',
  auth,
  validate({ query: schemas.emptyQuery }),
  farmerController.getFarmerStatus
);

router.get(
  '/all',
  auth,
  role(['admin']),
  validate({ query: schemas.emptyQuery }),
  farmerController.getAllFarmers
);

router.put(
  '/:id',
  auth,
  validate({ params: schemas.farmerIdParams, body: schemas.farmerUpdateBody }),
  farmerController.updateFarmer
);

router.post(
  '/:id/update',
  auth,
  validate({ params: schemas.farmerIdParams, body: schemas.farmerUpdateBody }),
  farmerController.updateFarmer
);

router.delete(
  '/:id',
  auth,
  role(['admin']),
  validate({ params: schemas.farmerIdParams, query: schemas.emptyQuery }),
  farmerController.deleteFarmer
);

router.get(
  '/sell-requests',
  auth,
  role(['farmer']),
  validate({ query: schemas.sellRequestsQuery }),
  sellRequestController.getMySellRequests
);

router.get(
  '/delete/:id',
  auth,
  role(['admin']),
  validate({ params: schemas.farmerIdParams, query: schemas.emptyQuery }),
  farmerController.deleteFarmer
);

module.exports = router;
