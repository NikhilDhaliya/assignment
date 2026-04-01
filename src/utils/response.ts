import { Response } from 'express';

interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

interface ErrorResponse {
  success: false;
  message: string;
  code: string;
  errors?: Record<string, string[]>;
}

export function sendSuccess<T>(res: Response, data: T, statusCode: number = 200, meta?: Record<string, unknown>): void {
  const response: SuccessResponse<T> = { success: true, data };
  if (meta) response.meta = meta;
  res.status(statusCode).json(response);
}

export function sendError(res: Response, message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR', errors?: Record<string, string[]>): void {
  const response: ErrorResponse = { success: false, message, code };
  if (errors) response.errors = errors;
  res.status(statusCode).json(response);
}
