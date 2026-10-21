import { randomUUID } from 'node:crypto';
import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export function requestContext(req, res, next) {
  const requestId = req.get('x-request-id') || randomUUID();
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
}

export function trustedOrigin(req, _res, next) {
  if (SAFE_METHODS.has(req.method)) return next();
  const origin = req.get('origin');
  if (!origin) return next();
  if (env.frontendUrls.includes(origin)) return next();
  return next(new HttpError(403, 'Origem nao autorizada.', 'UNTRUSTED_ORIGIN'));
}

export function apiRateLimiter() {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: true, code: 'API_RATE_LIMIT', message: 'Muitas requisicoes. Tente novamente em alguns minutos.' },
  });
}

export function authRateLimiter() {
  return rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 25,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: { error: true, code: 'TOO_MANY_ATTEMPTS', message: 'Muitas tentativas de acesso. Tente novamente mais tarde.' },
  });
}

export function aiRateLimiter() {
  return rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: true, code: 'AI_RATE_LIMIT', message: 'Limite de correcoes atingido. Tente novamente mais tarde.' },
  });
}
