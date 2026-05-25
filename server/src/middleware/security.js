const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { getEnv } = require('../config/env');

function getCorsOptions() {
  const env = getEnv();
  if (env.NODE_ENV !== 'production') {
    const allowedDevOrigins = [env.FRONTEND_ORIGIN || 'http://localhost:3000'];

    return {
      origin(origin, cb) {
        if (!origin || allowedDevOrigins.includes(origin)) return cb(null, true);
        return cb(null, false);
      },
      credentials: true,
      optionsSuccessStatus: 204,
    };
  }
  const origins = env.CORS_ORIGIN.split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  if (env.FRONTEND_ORIGIN && !origins.includes(env.FRONTEND_ORIGIN)) {
    origins.push(env.FRONTEND_ORIGIN);
  }
  if (origins.includes('*')) {
    throw new Error('Wildcard CORS origin is not allowed in production');
  }
  return {
    origin: origins,
    credentials: true,
    optionsSuccessStatus: 204,
  };
}

function apiLimiter() {
  const env = getEnv();
  if (env.NODE_ENV === 'test') {
    return (req, res, next) => next();
  }
  return rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
  });
}

function authLimiter() {
  const env = getEnv();
  if (env.NODE_ENV === 'test') {
    return (req, res, next) => next();
  }
  return rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.AUTH_RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many authentication attempts, please try again later.' },
  });
}

function helmetMiddleware() {
  return helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  });
}

module.exports = {
  getCorsOptions,
  apiLimiter,
  authLimiter,
  helmetMiddleware,
};
