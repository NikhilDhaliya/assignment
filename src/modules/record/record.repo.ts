import { prisma } from '../../lib/prisma.js';
import type { CreateRecordInput, UpdateRecordInput, ListRecordsQuery } from './record.schema.js';

const recordSelect = {
  id: true,
  amount: true,
  type: true,
  category: true,
  date: true,
  notes: true,
  isDeleted: true,
  createdAt: true,
  updatedAt: true,
  createdBy: {
    select: { id: true, name: true },
  },
} as const;

export async function findById(id: string) {
  return prisma.record.findFirst({
    where: { id, isDeleted: false },
    select: recordSelect,
  });
}

export async function create(data: CreateRecordInput & { createdById: string }) {
  return prisma.record.create({
    data: {
      amount: data.amount,
      type: data.type,
      category: data.category,
      date: data.date,
      notes: data.notes,
      createdById: data.createdById,
    },
    select: recordSelect,
  });
}

export async function update(id: string, data: Partial<UpdateRecordInput>) {
  return prisma.record.update({
    where: { id },
    data,
    select: recordSelect,
  });
}

export async function softDelete(id: string) {
  return prisma.record.update({
    where: { id },
    data: { isDeleted: true },
    select: recordSelect,
  });
}

export async function findMany(query: ListRecordsQuery) {
  const { page, limit, type, category, dateFrom, dateTo, search, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { isDeleted: false };

  if (type) where.type = type;
  if (category) where.category = { contains: category };

  if (dateFrom || dateTo) {
    const dateFilter: Record<string, Date> = {};
    if (dateFrom) dateFilter.gte = new Date(dateFrom);
    if (dateTo) dateFilter.lte = new Date(dateTo);
    where.date = dateFilter;
  }

  if (search) {
    where.OR = [
      { notes: { contains: search } },
      { category: { contains: search } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.record.findMany({
      where,
      select: recordSelect,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.record.count({ where }),
  ]);

  return { items, total };
}
