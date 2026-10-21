import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';

const app = await createApp();
const server = app.listen(env.port, () => {
  logger.info('Redae API started', {
    port: env.port,
    dataDriver: env.dataDriver,
    aiConfigured: Boolean(env.geminiApiKey),
    googleConfigured: Boolean(env.googleClientId),
  });
});

function shutdown(signal) {
  logger.info('Shutdown requested', { signal });
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
