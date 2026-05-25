const { z } = require('zod');

/**
 * @param {{ body?: z.ZodTypeAny; query?: z.ZodTypeAny; params?: z.ZodTypeAny }} schemas
 */
function validate(schemas) {
  return (req, res, next) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.query) req.query = schemas.query.parse(req.query);
      if (schemas.params) req.params = schemas.params.parse(req.params);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input',
          errors: err.flatten(),
        });
      }
      next(err);
    }
  };
}

module.exports = { validate };
