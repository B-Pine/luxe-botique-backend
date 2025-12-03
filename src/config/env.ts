import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: (process.env.NODE_ENV || 'development') as string,
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: (process.env.DATABASE_URL || '') as string,
  JWT_SECRET: (process.env.JWT_SECRET || 'your-secret-key-change-in-production') as string,
  JWT_REFRESH_SECRET: (process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production') as string,
  JWT_EXPIRY: (process.env.JWT_EXPIRY || '15m') as string,
  REFRESH_TOKEN_EXPIRY: (process.env.REFRESH_TOKEN_EXPIRY || '7d') as string,
  FRONTEND_URL: (process.env.FRONTEND_URL || 'http://localhost:8080') as string,
  // Railways Storage (S3-compatible)
  RAILWAYS_BUCKET_NAME: (process.env.RAILWAYS_BUCKET_NAME || '') as string,
  RAILWAYS_REGION: (process.env.RAILWAYS_REGION || 'auto') as string,
  RAILWAYS_ENDPOINT: (process.env.RAILWAYS_ENDPOINT || '') as string,
  RAILWAYS_ACCESS_KEY: (process.env.RAILWAYS_ACCESS_KEY || '') as string,
  RAILWAYS_SECRET_KEY: (process.env.RAILWAYS_SECRET_KEY || '') as string,
};

// Validate required environment variables
const requiredVars = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
const missing = requiredVars.filter((key) => !env[key as keyof typeof env]);

if (missing.length > 0) {
  console.warn(`Warning: Missing environment variables: ${missing.join(', ')}`);
}

// Warn about optional storage configuration
if (!env.RAILWAYS_BUCKET_NAME && !env.RAILWAYS_ENDPOINT) {
  console.warn('⚠️  Railways storage not configured. File uploads will not work. Configure RAILWAYS_BUCKET_NAME, RAILWAYS_ENDPOINT, RAILWAYS_ACCESS_KEY, and RAILWAYS_SECRET_KEY');
}
