import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  DATA_DRIVER: z.enum(['memory', 'mongo']).default('memory'),
  JWT_SECRET: z.string().min(32).default('troque-esta-chave-por-uma-string-longa-e-aleatoria'),
  JWT_EXPIRES_IN: z.string().default('8h'),
  COOKIE_NAME: z.string().min(1).default('redae_token'),
  COOKIE_MAX_AGE_MS: z.coerce.number().int().positive().default(28800000),
  GOOGLE_CLIENT_ID: z.string().default(''),
  GEMINI_API_KEY: z.string().default(''),
  GEMINI_MODEL: z.string().default('gemini-3.8-flash'),
  GEMINI_TIMEOUT_MS: z.coerce.number().int().min(5000).max(180000).default(90000),
  MAX_PROFILE_PHOTO_MB: z.coerce.number().min(1).max(10).default(3),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  const details = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
  throw new Error(`Configuracao de ambiente invalida: ${details}`);
}

const raw = parsed.data;
if (raw.NODE_ENV === 'production' && raw.JWT_SECRET.startsWith('troque-')) {
  throw new Error('JWT_SECRET precisa ser substituido por um segredo forte em producao.');
}

const frontendUrls = raw.FRONTEND_URL.split(',').map((item) => item.trim().replace(/\/$/, '')).filter(Boolean);

export const env = Object.freeze({
  nodeEnv: raw.NODE_ENV,
  port: raw.PORT,
  frontendUrls,
  dataDriver: raw.DATA_DRIVER,
  jwtSecret: raw.JWT_SECRET,
  jwtExpiresIn: raw.JWT_EXPIRES_IN,
  cookieName: raw.COOKIE_NAME,
  cookieMaxAgeMs: raw.COOKIE_MAX_AGE_MS,
  googleClientId: raw.GOOGLE_CLIENT_ID,
  geminiApiKey: raw.GEMINI_API_KEY,
  geminiModel: raw.GEMINI_MODEL,
  geminiTimeoutMs: raw.GEMINI_TIMEOUT_MS,
  maxProfilePhotoMb: raw.MAX_PROFILE_PHOTO_MB,
  isProduction: raw.NODE_ENV === 'production',
});
