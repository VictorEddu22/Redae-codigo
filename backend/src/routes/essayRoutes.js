import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { aiRateLimiter } from '../middleware/security.js';

export function createEssayRoutes(controller) {
  const router = Router();
  router.use(requireAuth);

  router.get('/', controller.list);
  router.get('/performance', controller.performance);
  router.get('/:id', controller.getById);
  router.post('/', aiRateLimiter(), controller.create);
  router.delete('/:id', controller.remove);

  return router;
}
