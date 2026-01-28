import * as dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

/**
 * Zod ENV Schema
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test']),
  PORT: z.coerce.number().default(4000),
  SERVER_URL: z.string().url(),
  APP_NAME: z.string().default('MyApp'),
  ALLOWED_ORIGINS: z.string().default('*'),
  DATABASE_URL: z.string().min(1),
  ACCESS_TOKEN_SECRET: z.string().min(8),
  ACCESS_TOKEN_EXPIRE: z.string().default('20m'),
  REFRESH_TOKEN_SECRET: z.string().min(8),
  REFRESH_TOKEN_EXPIRE: z.string().default('1d'),
  REFRESH_TOKEN_COOKIE_NAME: z.string().default('jid'),
  ACCESS_TOKEN_COOKIE_NAME: z.string().default('atj'),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  BCRYPT_ROUNDS: z.coerce.number().default(10),
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.coerce.number().default(587),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  EMAIL_SECURE: z.coerce.boolean().default(true),
  EMAIL_FROM: z.string().email(),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(150000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  ENCRYPTION_KEY: z.string().min(32).max(32),
  IV_LENGTH: z.coerce.number().default(16),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:\n', parsedEnv.error.format());
  process.exit(1);
}

const env = parsedEnv.data;

const config = {
  nodeEnv: env.NODE_ENV,

  appName: env.APP_NAME,

  server: {
    port: env.PORT,
    url: env.SERVER_URL,
  },

  cors: {
    origins: env.ALLOWED_ORIGINS.split(','),
  },

  database: {
    url: env.DATABASE_URL,
  },

  security: {
    bcryptRounds: env.BCRYPT_ROUNDS,
  },

  jwt: {
    accessToken: {
      secret: env.ACCESS_TOKEN_SECRET as string,
      expiresIn: env.ACCESS_TOKEN_EXPIRE as string | number,
      cookieName: env.ACCESS_TOKEN_COOKIE_NAME as string,
    },
    refreshToken: {
      secret: env.REFRESH_TOKEN_SECRET as string,
      expiresIn: env.REFRESH_TOKEN_EXPIRE as string | number,
      cookieName: env.REFRESH_TOKEN_COOKIE_NAME as string,
    },
  },

  oauth: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },

  email: {
    smtp: {
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT,
      secure: env.EMAIL_SECURE,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    },
    from: env.EMAIL_FROM,
  },

  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
  },
  encryption: {
    encryptionKey: env.ENCRYPTION_KEY,
    ivLength: env.IV_LENGTH,
  },
} as const;

export default config;
