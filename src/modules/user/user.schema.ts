import { z } from 'zod';
import { ROLES, USER_STATUSES } from '../../constants/roles.js';

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
  role: z.enum(ROLES as [string, ...string[]]).default('VIEWER'),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  role: z.enum(ROLES as [string, ...string[]]).optional(),
  status: z.enum(USER_STATUSES as [string, ...string[]]).optional(),
});

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  role: z.enum(ROLES as [string, ...string[]]).optional(),
  status: z.enum(USER_STATUSES as [string, ...string[]]).optional(),
  search: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
