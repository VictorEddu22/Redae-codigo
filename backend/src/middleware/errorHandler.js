import multer from 'multer';
import { ZodError } from 'zod';
import { HttpError } from '../utils/httpError.js';
import { logger } from '../lib/logger.js';

export function notFound(req, _res, next) {
  next(new HttpError(404, `Rota nao encontrada: ${req.method} ${req.originalUrl}`, 'NOT_FOUND'));
}

export function errorHandler(err, req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: true,
      code: 'VALIDATION_ERROR',
      message: 'Dados invalidos.',
      requestId: req.requestId,
      details: err.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
    });
  }

  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'A foto excede o tamanho permitido.' : 'Nao foi possivel processar o arquivo enviado.';
    return res.status(400).json({ error: true, code: err.code, message, requestId: req.requestId });
  }

  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: true, code: 'INVALID_JSON', message: 'JSON invalido.', requestId: req.requestId });
  }

  const status = Number(err.status || 500);
  if (status >= 500) {
    logger.error('Unhandled API error', {
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }

  return res.status(status).json({
    error: true,
    code: err.code || 'INTERNAL_ERROR',
    message: status >= 500 && !err.status ? 'Erro interno do servidor.' : err.message,
    requestId: req.requestId,
    ...(err.details ? { details: err.details } : {}),
  });
}
