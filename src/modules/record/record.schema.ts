import { z } from 'zod';
import { RECORD_TYPES } from '../../constants/roles.js';

export const createRecordSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(RECORD_TYPES as [string, ...string[]]),
  category: z.string().min(1, 'Category is required').max(50),
  date: z.string().datetime({ message: 'Invalid date format. Use ISO 8601.' }).transform(val => new Date(val)),
  notes: z.string().max(500).optional(),
});

export const updateRecordSchema = z.object({
  amount: z.number().positive('Amount must be positive').optional(),
  type: z.enum(RECORD_TYPES as [string, ...string[]]).optional(),
  category: z.string().min(1).max(50).optional(),
  date: z.string().datetime().transform(val => new Date(val)).optional(),
  notes: z.string().max(500).optional(),
});

export const listRecordsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  type: z.enum(RECORD_TYPES as [string, ...string[]]).optional(),
  category: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['date', 'amount', 'createdAt']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateRecordInput = z.infer<typeof createRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
export type ListRecordsQuery = z.infer<typeof listRecordsQuerySchema>;
