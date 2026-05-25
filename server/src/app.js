const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const { getEnv } = require('./config/env');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { getCorsOptions, apiLimiter, authLimiter, helmetMiddleware } = require('./middleware/security');
const { addGlobalContext } = require('./middleware/globalScaling');

const env = getEnv();

const app = express();

if (env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.disable('x-powered-by');

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend connected',
    status: 'OK',
  });
});

app.use(helmetMiddleware());
app.use(cors(getCorsOptions()));
app.use(cookieParser());
app.use(express.json({ limit: env.JSON_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: env.JSON_LIMIT }));
app.use(mongoSanitize());

app.use(apiLimiter());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add global scaling context to all API responses
app.use(addGlobalContext);

const { validate } = require('./middleware/validate');
const schemas = require('./validations/schemas');
const authController = require('./controllers/authController');

/** Alias for clients expecting POST /api/login */
app.post('/api/login', authLimiter(), validate({ body: schemas.authLoginBody }), authController.login);

app.use('/api/auth', authLimiter(), require('./routes/auth'));
app.use('/api/farmer', require('./routes/farmer'));
app.use('/api/business', require('./routes/business'));
app.use('/api/order', require('./routes/order'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/listings', require('./routes/listing'));
app.use('/api/bids', require('./routes/bid'));
app.use('/api/partners', require('./routes/partner'));
app.use('/api/schemes', require('./routes/scheme'));
app.use('/api/sell-request', require('./routes/sellRequest'));
app.use('/api/crops', require('./routes/crop'));   // ML-powered crop predictions
app.use('/api/crop-management', require('./routes/cropManagement')); // Crop CRUD management
app.use('/api/chat', require('./routes/aiRoutes')); // Multilingual AI Chat Interface
app.use('/api/location', require('./routes/location')); // Pincode-based location services
app.use('/api/ml', require('./routes/ml')); // ML integration for quality and price prediction
app.use('/api/market-prices', require('./routes/market')); // Market prices with fallback data
app.use('/api/market', require('./src/routes/market')); // Pincode-based mandi prices
app.use('/api/weather', require('./src/routes/weather')); // Pincode-based weather
app.use('/api/assistant', require('./routes/assistant')); // Voice assistant

app.use(notFound);
app.use(errorHandler);

module.exports = app;
