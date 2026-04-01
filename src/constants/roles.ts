export const Role = {
  ADMIN: 'ADMIN',
  ANALYST: 'ANALYST',
  VIEWER: 'VIEWER',
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];

export const ROLES = Object.values(Role);

export const RecordType = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
} as const;

export type RecordTypeValue = (typeof RecordType)[keyof typeof RecordType];

export const RECORD_TYPES = Object.values(RecordType);

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type UserStatusValue = (typeof UserStatus)[keyof typeof UserStatus];

export const USER_STATUSES = Object.values(UserStatus);
