import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const ISSUER = 'redae-api';
const AUDIENCE = 'redae-web';

export function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, typ: 'access' },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn, issuer: ISSUER, audience: AUDIENCE },
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtSecret, { issuer: ISSUER, audience: AUDIENCE });
}
