import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/security.js';

export function createAuthRoutes(controller) {
  const router = Router();
  const limiter = authRateLimiter();

  router.post('/register', limiter, controller.register);
  router.post('/login', limiter, controller.login);
  router.post('/google', limiter, controller.google);
  router.post('/logout', controller.logout);
  router.get('/me', requireAuth, controller.me);
  router.patch('/password', requireAuth, limiter, controller.changePassword);

  return router;
}
