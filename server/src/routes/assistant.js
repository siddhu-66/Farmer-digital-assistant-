const express = require('express');
const router = express.Router();
const assistantController = require('../controllers/assistantController');
const auth = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { z } = require('zod');

// Validation schema for assistant query
const assistantQueryBody = z.object({
  query: z.string().trim().min(1).max(500)
});

// POST /api/assistant/query - Query voice assistant
router.post(
  '/query',
  auth,
  validate({ body: assistantQueryBody }),
  assistantController.queryAssistant
);

module.exports = router;
