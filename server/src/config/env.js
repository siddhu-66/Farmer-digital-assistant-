const { z } = require('zod');

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().int().positive().default(5000),
    MONGO_URI: z.string().min(1).optional(),
    JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters').optional(),
    JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 characters').optional(),
    FRONTEND_ORIGIN: z.string().optional().default('http://localhost:3000'),
    CORS_ORIGIN: z
      .string()
      .optional()
      .describe('Comma-separated allowed origins; required in production'),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
    AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(20),
    JSON_LIMIT: z.string().default('100kb'),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV === 'development' && data.PORT !== 5000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'In development, PORT must be 5000 (set PORT=5000 in server/.env)',
        path: ['PORT'],
      });
    }
    if (data.NODE_ENV === 'production') {
      if (!data.JWT_SECRET) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'JWT_SECRET is required in production',
          path: ['JWT_SECRET'],
        });
      }
      if (!data.JWT_REFRESH_SECRET) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'JWT_REFRESH_SECRET is required in production',
          path: ['JWT_REFRESH_SECRET'],
        });
      }
      if (!data.CORS_ORIGIN || !data.CORS_ORIGIN.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'CORS_ORIGIN is required in production (comma-separated origins, no *)',
          path: ['CORS_ORIGIN'],
        });
      }
    }
  });

function loadEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors;
    console.error('Invalid environment configuration:', JSON.stringify(msg, null, 2));
    throw new Error('Environment validation failed');
  }
  return parsed.data;
}

function getEnv() {
  return loadEnv();
}

function getJwtSecret() {
  const env = getEnv();
  if (env.JWT_SECRET) return env.JWT_SECRET;
  if (env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is required in production');
  }
  return 'dev-only-jwt-secret-min-16-chars';
}

module.exports = { getEnv, loadEnv, getJwtSecret };
