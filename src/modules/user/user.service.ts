import bcrypt from 'bcryptjs';
import * as userRepo from './user.repo.js';
import { ConflictError, NotFoundError } from '../../utils/errors.js';
import type { CreateUserInput, UpdateUserInput, ListUsersQuery } from './user.schema.js';
import type { PaginatedResponse, UserResponse } from './user.types.js';

const SALT_ROUNDS = 10;

export async function createUser(input: CreateUserInput): Promise<UserResponse> {
  const existing = await userRepo.findByEmail(input.email);
  if (existing) {
    throw new ConflictError('A user with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await userRepo.create({
    ...input,
    password: hashedPassword,
  });

  return user;
}

export async function getUserById(id: string): Promise<UserResponse> {
  const user = await userRepo.findById(id);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
}

export async function updateUser(id: string, input: UpdateUserInput): Promise<UserResponse> {
  const user = await userRepo.findById(id);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  return userRepo.update(id, input);
}

export async function listUsers(query: ListUsersQuery): Promise<PaginatedResponse<UserResponse>> {
  const { items, total } = await userRepo.findMany(query);

  return {
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}
