const express = require('express');
const router = express.Router();
const aiChatController = require('../controllers/aiChatController');

// @route   POST /api/chat/ask
// @desc    Multilingual AI Chat Interface
// @access  Public (for demo purposes)
router.post('/ask', aiChatController.handleMultilingualChat);

module.exports = router;
