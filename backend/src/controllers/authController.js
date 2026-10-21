import { clearSessionCookieOptions, sessionCookieOptions } from '../config/cookies.js';
import { env } from '../config/env.js';
import { registerSchema, loginSchema, googleSchema, passwordSchema } from '../validators/authSchemas.js';

function setSessionCookie(res, token) {
  res.cookie(env.cookieName, token, sessionCookieOptions());
}

export function createAuthController(authService) {
  return {
    register: async (req, res) => {
      const payload = registerSchema.parse(req.body);
      const result = await authService.register(payload);
      setSessionCookie(res, result.token);
      res.status(201).json({ user: result.user });
    },
    login: async (req, res) => {
      const payload = loginSchema.parse(req.body);
      const result = await authService.login(payload.email, payload.senha);
      setSessionCookie(res, result.token);
      res.json({ user: result.user });
    },
    google: async (req, res) => {
      const { credential } = googleSchema.parse(req.body);
      const result = await authService.googleLogin(credential);
      setSessionCookie(res, result.token);
      res.json({ user: result.user });
    },
    me: async (req, res) => res.json(await authService.me(req.user.id)),
    changePassword: async (req, res) => {
      const payload = passwordSchema.parse(req.body);
      res.json(await authService.changePassword(req.user.id, payload.senhaAtual, payload.novaSenha));
    },
    logout: async (_req, res) => {
      res.clearCookie(env.cookieName, clearSessionCookieOptions());
      res.status(204).end();
    },
  };
}
