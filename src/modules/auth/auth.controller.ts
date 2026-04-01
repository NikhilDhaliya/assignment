import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service.js';
import { sendSuccess } from '../../utils/response.js';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.login(req.body);
    sendSuccess(res, result, 200);
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await authService.getMe(req.user!.id);
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
}
