import { Request, Response, NextFunction } from 'express';
import * as recordService from './record.service.js';
import { sendSuccess } from '../../utils/response.js';

export async function createRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const record = await recordService.createRecord(req.body, req.user!.id);
    sendSuccess(res, record, 201);
  } catch (error) {
    next(error);
  }
}

export async function getRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const record = await recordService.getRecordById(String(req.params.id));
    sendSuccess(res, record);
  } catch (error) {
    next(error);
  }
}

export async function updateRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const record = await recordService.updateRecord(String(req.params.id), req.body);
    sendSuccess(res, record);
  } catch (error) {
    next(error);
  }
}

export async function deleteRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await recordService.deleteRecord(String(req.params.id));
    sendSuccess(res, { message: 'Record deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export async function listRecords(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = (req as any).parsedQuery || req.query;
    const result = await recordService.listRecords(query);
    sendSuccess(res, result.items, 200, { pagination: result.pagination });
  } catch (error) {
    next(error);
  }
}
