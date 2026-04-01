import * as recordRepo from './record.repo.js';
import { NotFoundError } from '../../utils/errors.js';
import type { CreateRecordInput, UpdateRecordInput, ListRecordsQuery } from './record.schema.js';

export async function createRecord(input: CreateRecordInput, userId: string) {
  return recordRepo.create({ ...input, createdById: userId });
}

export async function getRecordById(id: string) {
  const record = await recordRepo.findById(id);
  if (!record) {
    throw new NotFoundError('Record not found');
  }
  return record;
}

export async function updateRecord(id: string, input: UpdateRecordInput) {
  const record = await recordRepo.findById(id);
  if (!record) {
    throw new NotFoundError('Record not found');
  }

  return recordRepo.update(id, input);
}

export async function deleteRecord(id: string) {
  const record = await recordRepo.findById(id);
  if (!record) {
    throw new NotFoundError('Record not found');
  }

  return recordRepo.softDelete(id);
}

export async function listRecords(query: ListRecordsQuery) {
  const { items, total } = await recordRepo.findMany(query);

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
