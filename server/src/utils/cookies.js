const { getEnv } = require('../config/env');

function isProduction() {
  return getEnv().NODE_ENV === 'production';
}

/** Local dev (proxied via Next :3000): lax + http. Production HTTPS: none + secure for cross-site. */
function authCookieOptions(maxAgeMs) {
  const prod = isProduction();
  return {
    httpOnly: true,
    secure: prod,
    sameSite: prod ? 'none' : 'lax',
    path: '/',
    maxAge: maxAgeMs,
  };
}

const ACCESS_MAX_MS = 15 * 60 * 1000;
const REFRESH_MAX_MS = 7 * 24 * 60 * 60 * 1000;

function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie('accessToken', accessToken, authCookieOptions(ACCESS_MAX_MS));
  res.cookie('refreshToken', refreshToken, authCookieOptions(REFRESH_MAX_MS));
}

function clearAuthCookies(res) {
  const opts = { path: '/', httpOnly: true, secure: isProduction(), sameSite: isProduction() ? 'none' : 'lax' };
  res.clearCookie('accessToken', opts);
  res.clearCookie('refreshToken', opts);
}

module.exports = {
  authCookieOptions,
  setAuthCookies,
  clearAuthCookies,
  ACCESS_MAX_MS,
  REFRESH_MAX_MS,
};
