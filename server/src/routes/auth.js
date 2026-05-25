const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const schemas = require('../validations/schemas');

router.post('/register', validate({ body: schemas.authRegisterBody }), authController.register);
router.post('/login', validate({ body: schemas.authLoginBody }), authController.login);
router.post('/verify-otp', validate({ body: schemas.authVerifyOtpBody }), authController.verifyOtp);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', auth, authController.me);

/** Google OAuth scaffold — set GOOGLE_CLIENT_ID / callback URL to enable (Passport integration). */
router.get('/google', (req, res) => {
  res.status(501).json({
    success: false,
    message:
      'Google OAuth is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL and wire passport-google-oauth20.',
  });
});
router.get('/google/callback', (req, res) => {
  res.status(501).json({ success: false, message: 'Google OAuth callback not configured.' });
});

module.exports = router;
