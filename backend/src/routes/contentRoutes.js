import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

export function createContentRoutes(controller) {
  const router = Router();
  router.use(requireAuth);

  router.get('/themes', controller.themes);
  router.get('/themes/:id', controller.theme);
  router.get('/models', controller.models);
  router.get('/learning', controller.learning);

  return router;
}
