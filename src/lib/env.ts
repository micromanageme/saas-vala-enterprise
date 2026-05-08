/**
 * SaaS Vala Enterprise - Environment Configuration
 * Type-safe environment variables with validation
 */

import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),
  
  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  
  // Session
  SESSION_SECRET: z.string().min(32),
  SESSION_MAX_AGE: z.string().default('604800000'),
  SESSION_COOKIE_NAME: z.string().default('saas_vala_session'),
  
  // Security
  BCRYPT_ROUNDS: z.string().default('12').transform(Number),
  CSRF_SECRET: z.string().min(32),
  RATE_LIMIT_MAX: z.string().default('100').transform(Number),
  RATE_LIMIT_WINDOW: z.string().default('900000').transform(Number),
  
  // API
  API_VERSION: z.string().default('v1'),
  API_BASE_URL: z.string().url(),
  API_RATE_LIMIT: z.string().default('1000').transform(Number),
  
  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  
  // Application
  APP_NAME: z.string().default('SaaS Vala Enterprise'),
  APP_URL: z.string().url(),
  APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  
  // Observability
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  CORRELATION_ID_HEADER: z.string().default('x-correlation-id'),
  
  // Email (optional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional().transform(Number),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),
  
  // Storage (optional)
  STORAGE_TYPE: z.enum(['local', 's3', 'supabase']).default('local'),
  STORAGE_PATH: z.string().default('./uploads'),
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY,
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY,
  SESSION_SECRET: process.env.SESSION_SECRET,
  SESSION_MAX_AGE: process.env.SESSION_MAX_AGE,
  SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME,
  BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS,
  CSRF_SECRET: process.env.CSRF_SECRET,
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW,
  API_VERSION: process.env.API_VERSION,
  API_BASE_URL: process.env.API_BASE_URL,
  API_RATE_LIMIT: process.env.API_RATE_LIMIT,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  APP_NAME: process.env.APP_NAME,
  APP_URL: process.env.APP_URL,
  APP_ENV: process.env.APP_ENV,
  LOG_LEVEL: process.env.LOG_LEVEL,
  CORRELATION_ID_HEADER: process.env.CORRELATION_ID_HEADER,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_FROM: process.env.SMTP_FROM,
  STORAGE_TYPE: process.env.STORAGE_TYPE,
  STORAGE_PATH: process.env.STORAGE_PATH,
  S3_BUCKET: process.env.S3_BUCKET,
  S3_REGION: process.env.S3_REGION,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
  S3_SECRET_KEY: process.env.S3_SECRET_KEY,
});

export type Env = z.infer<typeof envSchema>;
