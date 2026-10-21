import { env } from '../config/env.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { HttpError } from '../utils/httpError.js';

function extractBearer(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length).trim();
}

export function requireAuth(req, _res, next) {
  const token = req.cookies?.[env.cookieName] || extractBearer(req);
  if (!token) return next(new HttpError(401, 'Faca login para continuar.', 'AUTH_REQUIRED'));

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
    };
    next();
  } catch {
    next(new HttpError(401, 'Sessao expirada ou invalida. Faca login novamente.', 'INVALID_TOKEN'));
  }
}
