function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  const isProd = process.env.NODE_ENV === 'production';
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    res.status(statusCode);
    return res.json({
      success: false,
      message: 'Invalid resource identifier',
    });
  }

  if (err.code === 11000) {
    statusCode = 400;
    res.status(statusCode);
    return res.json({
      success: false,
      message: 'Duplicate value',
    });
  }

  const message =
    statusCode === 500 && isProd ? 'Internal Server Error' : err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = { notFound, errorHandler };
