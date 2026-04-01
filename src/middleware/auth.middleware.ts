import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import { UnauthorizedError } from '../utils/errors.js';
import { type RoleType } from '../constants/roles.js';

interface JwtPayload {
  userId: string;
  email: string;
  role: RoleType;
}

export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('Token not provided');
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, name: true, status: true },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedError('Account is inactive');
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role as RoleType,
      name: user.name,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid or expired token'));
    } else {
      next(error);
    }
  }
}
