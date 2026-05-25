const jwt = require('jsonwebtoken');
const { getEnv, getJwtSecret } = require('../config/env');

function getRefreshSecret() {
  const env = getEnv();
  if (env.JWT_REFRESH_SECRET) return env.JWT_REFRESH_SECRET;
  if (env.NODE_ENV === 'production') {
    throw new Error('JWT_REFRESH_SECRET is required in production');
  }
  return `${getJwtSecret()}-refresh-dev-only`;
}

function signAccessToken(user) {
  const payload = { user: { id: user.id, role: user.role, email: user.email || undefined } };
  const expiresIn = getEnv().NODE_ENV === 'production' ? '15m' : '7d';
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
}

function signRefreshToken(user) {
  const payload = {
    type: 'refresh',
    user: { id: user.id, role: user.role },
  };
  return jwt.sign(payload, getRefreshSecret(), { expiresIn: '7d' });
}

function verifyRefreshToken(token) {
  const decoded = jwt.verify(token, getRefreshSecret());
  if (!decoded || decoded.type !== 'refresh' || !decoded.user?.id) {
    throw new Error('Invalid refresh token');
  }
  return decoded;
}

module.exports = {
  getRefreshSecret,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
