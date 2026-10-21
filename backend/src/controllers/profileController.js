import path from 'node:path';
import { profileUpdateSchema } from '../validators/profileSchemas.js';

export function createProfileController(profileService) {
  return {
    get: async (req, res) => {
      res.json(await profileService.get(req.user.id));
    },

    update: async (req, res) => {
      const payload = profileUpdateSchema.parse(req.body);
      res.json(await profileService.update(req.user.id, payload));
    },

    uploadPhoto: async (req, res) => {
      if (!req.file) {
        return res.status(400).json({ error: true, code: 'PHOTO_REQUIRED', message: 'Selecione uma foto.' });
      }

      const fotoUrl = `/uploads/${path.basename(req.file.filename)}`;
      res.json(await profileService.setPhoto(req.user.id, fotoUrl));
    },
  };
}
