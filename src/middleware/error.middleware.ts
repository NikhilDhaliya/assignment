import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors.js';
import { sendError } from '../utils/response.js';
import { env } from '../config/env.js';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  // Already sent response guard
  if (res.headersSent) {
    return;
  }

  // Validation errors with field details
  if (err instanceof ValidationError) {
    sendError(res, err.message, err.statusCode, err.code, err.errors);
    return;
  }

  // Operational errors (expected)
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode, err.code);
    return;
  }

  // JSON parse errors
  if (err instanceof SyntaxError && 'body' in err) {
    sendError(res, 'Invalid JSON in request body', 400, 'INVALID_JSON');
    return;
  }

  // for unexpected errors
  console.error('Unhandled Error:', err);

  const message = env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message || 'Internal server error';

  sendError(res, message, 500, 'INTERNAL_ERROR');
}
