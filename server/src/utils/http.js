function sendServerError(res, err) {
  const isProd = process.env.NODE_ENV === 'production';
  return res.status(500).json({
    success: false,
    message: 'Server Error',
    ...(isProd ? {} : { details: err.message }),
  });
}

module.exports = { sendServerError };
