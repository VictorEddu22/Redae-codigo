import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './config/env.js';
import { createRepositories } from './repositories/index.js';
import { createServices } from './services/index.js';
import { createAuthController } from './controllers/authController.js';
import { createProfileController } from './controllers/profileController.js';
import { createEssayController } from './controllers/essayController.js';
import { createContentController } from './controllers/contentController.js';
import { createAuthRoutes } from './routes/authRoutes.js';
import { createProfileRoutes } from './routes/profileRoutes.js';
import { createEssayRoutes } from './routes/essayRoutes.js';
import { createContentRoutes } from './routes/contentRoutes.js';
import { apiRateLimiter, requestContext, trustedOrigin } from './middleware/security.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { HttpError } from './utils/httpError.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(currentDir, '../storage/uploads');

export async function createApp() {
  const repositories = await createRepositories();
  const services = createServices(repositories);

  const app = express();
  if (env.isProduction) app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(requestContext);
  morgan.token('request-id', (req) => req.requestId);
  app.use(morgan(env.isProduction ? ':remote-addr :method :url :status :response-time ms rid=:request-id' : 'dev'));
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin || env.frontendUrls.includes(origin)) return callback(null, true);
      return callback(new HttpError(403, 'Origem CORS nao permitida.', 'CORS_DENIED'));
    },
  }));
  app.use(trustedOrigin);
  app.use(apiRateLimiter());
  app.use(express.json({ limit: '1mb', strict: true }));
  app.use(cookieParser());

  const health = (_req, res) => res.json({
    ok: true,
    service: 'redae-backend',
    version: '2.0.0',
    dataDriver: env.dataDriver,
    aiConfigured: Boolean(env.geminiApiKey),
    googleConfigured: Boolean(env.googleClientId),
  });
  app.get('/health', health);
  app.get('/api/health', health);

  app.use('/uploads', express.static(uploadsDir, {
    maxAge: env.isProduction ? '1d' : 0,
    fallthrough: true,
    immutable: env.isProduction,
  }));

  app.use('/api/auth', createAuthRoutes(createAuthController(services.auth)));
  app.use('/api/profile', createProfileRoutes(createProfileController(services.profile)));
  app.use('/api/essays', createEssayRoutes(createEssayController(services.essays)));
  app.use('/api/content', createContentRoutes(createContentController(services.content)));

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
