import { prisma } from '../../lib/prisma.js';
import type { CreateUserInput, UpdateUserInput, ListUsersQuery } from './user.schema.js';

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function findByEmail(email: string) {
  return prisma.user.findUnique({ where: { email }, select: userSelect });
}

export async function findById(id: string) {
  return prisma.user.findUnique({ where: { id }, select: userSelect });
}

export async function create(data: CreateUserInput & { password: string }) {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    },
    select: userSelect,
  });
}

export async function update(id: string, data: UpdateUserInput) {
  return prisma.user.update({
    where: { id },
    data,
    select: userSelect,
  });
}

export async function findMany(query: ListUsersQuery) {
  const { page, limit, role, status, search } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (role) where.role = role;
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: userSelect,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return { items, total };
}
