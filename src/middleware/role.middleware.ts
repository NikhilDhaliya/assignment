import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../utils/errors.js';
import { type RoleType } from '../constants/roles.js';

export function requireRole(...allowedRoles: RoleType[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError(`Role '${req.user.role}' is not authorized to access this resource`));
    }

    next();
  };
}
