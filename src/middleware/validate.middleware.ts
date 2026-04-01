import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/errors.js';

type ValidationTarget = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse(req[target]);
      if (target === 'body') {
        req.body = data;
      } else if (target === 'query') {
        // Express query is read-only getter. Store parsed data on req.body._parsedQuery
        (req as any).parsedQuery = data;
      } else {
        (req as any).parsedParams = data;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string[]> = {};
        for (const issue of error.issues) {
          const path = issue.path.join('.') || '_root';
          if (!fieldErrors[path]) fieldErrors[path] = [];
          fieldErrors[path].push(issue.message);
        }
        next(new ValidationError('Validation failed', fieldErrors));
      } else {
        next(error);
      }
    }
  };
}
