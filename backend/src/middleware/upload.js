import multer from 'multer';
import path from 'node:path';
import { mkdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { env } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
export const uploadsDir = path.resolve(currentDir, '../../storage/uploads');
mkdirSync(uploadsDir, { recursive: true });

const extensionByMime = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
]);

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_req, file, cb) => cb(null, `${randomUUID()}${extensionByMime.get(file.mimetype) || '.bin'}`),
});

export const profilePhotoUpload = multer({
  storage,
  limits: { fileSize: env.maxProfilePhotoMb * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!extensionByMime.has(file.mimetype)) {
      return cb(new HttpError(400, 'Use foto JPG, PNG ou WEBP.', 'INVALID_IMAGE_TYPE'));
    }
    return cb(null, true);
  },
});
