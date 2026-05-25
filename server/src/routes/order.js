const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { validate } = require('../middleware/validate');
const schemas = require('../validations/schemas');

router.post(
  '/create',
  auth,
  role(['salesman', 'admin']),
  validate({ body: schemas.orderCreateBody }),
  orderController.createOrder
);

router.get(
  '/list',
  auth,
  validate({ query: schemas.emptyQuery }),
  orderController.getOrders
);

router.post(
  '/update-status',
  auth,
  role(['admin']),
  validate({ body: schemas.orderUpdateStatusBody }),
  orderController.updateOrderStatus
);

router.post(
  '/assign-farmers',
  auth,
  role(['admin']),
  validate({ body: schemas.orderAssignFarmersBody }),
  orderController.assignFarmers
);

module.exports = router;
