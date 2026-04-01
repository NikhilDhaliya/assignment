import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service.js';
import { sendSuccess } from '../../utils/response.js';

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.createUser(req.body);
    sendSuccess(res, user, 201);
  } catch (error) {
    next(error);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.getUserById(String(req.params.id));
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.updateUser(String(req.params.id), req.body);
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
}

export async function listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = (req as any).parsedQuery || req.query;
    const result = await userService.listUsers(query);
    sendSuccess(res, result.items, 200, { pagination: result.pagination });
  } catch (error) {
    next(error);
  }
}
