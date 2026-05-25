const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const sellRequestController = require('../controllers/sellRequestController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { validate } = require('../middleware/validate');
const schemas = require('../validations/schemas');

router.get(
  '/pending-verifications',
  auth,
  role(['admin']),
  validate({ query: schemas.emptyQuery }),
  adminController.getPendingVerifications
);

router.post(
  '/verify-user',
  auth,
  role(['admin']),
  validate({ body: schemas.adminVerifyUserBody }),
  adminController.verifyUser
);

router.get(
  '/analytics',
  auth,
  role(['admin']),
  validate({ query: schemas.emptyQuery }),
  adminController.getSystemAnalytics
);

router.get(
  '/transactions',
  auth,
  role(['admin']),
  validate({ query: schemas.emptyQuery }),
  adminController.getAllTransactions
);

router.post(
  '/moderate-listing',
  auth,
  role(['admin']),
  validate({ body: schemas.adminModerateListingBody }),
  adminController.moderateListing
);

router.get(
  '/sell-requests',
  auth,
  role(['admin']),
  validate({ query: schemas.sellRequestsQuery }),
  sellRequestController.getAllSellRequests
);

router.put(
  '/sell-request/:id/assign',
  auth,
  role(['admin']),
  validate({ params: schemas.sellRequestIdParams, body: schemas.sellRequestAssignBody }),
  sellRequestController.assignSellRequest
);

router.put(
  '/sell-request/:id/reject',
  auth,
  role(['admin']),
  validate({ params: schemas.sellRequestIdParams, body: schemas.sellRequestRejectAdminBody }),
  sellRequestController.rejectSellRequestByAdmin
);

module.exports = router;
