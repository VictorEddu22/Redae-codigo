import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { profilePhotoUpload } from '../middleware/upload.js';

export function createProfileRoutes(controller) {
  const router = Router();

  router.use(requireAuth);
  router.get('/', controller.get);
  router.patch('/', controller.update);
  router.post('/photo', profilePhotoUpload.single('foto'), controller.uploadPhoto);

  return router;
}
