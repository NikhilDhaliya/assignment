import { Request, Response, NextFunction } from 'express';
import * as dashboardService from './dashboard.service.js';
import { sendSuccess } from '../../utils/response.js';

export async function getSummary(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const summary = await dashboardService.getSummary();
    sendSuccess(res, summary);
  } catch (error) {
    next(error);
  }
}

export async function getCategorySummary(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await dashboardService.getCategorySummary();
    sendSuccess(res, categories);
  } catch (error) {
    next(error);
  }
}

export async function getMonthlyTrends(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const trends = await dashboardService.getMonthlyTrends();
    sendSuccess(res, trends);
  } catch (error) {
    next(error);
  }
}

export async function getRecentActivity(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const recent = await dashboardService.getRecentActivity();
    sendSuccess(res, recent);
  } catch (error) {
    next(error);
  }
}
