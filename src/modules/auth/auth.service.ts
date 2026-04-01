import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma.js';
import { env } from '../../config/env.js';
import { UnauthorizedError, NotFoundError } from '../../utils/errors.js';
import { type LoginInput } from './auth.schema.js';
import { type RoleType } from '../../constants/roles.js';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

function generateToken(userId: string, email: string, role: RoleType): string {
  const options: any = { expiresIn: env.JWT_EXPIRES_IN };
  return jwt.sign({ userId, email, role }, env.JWT_SECRET, options);
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  if (user.status !== 'ACTIVE') {
    throw new UnauthorizedError('Account is inactive. Contact an administrator.');
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const token = generateToken(user.id, user.email, user.role as RoleType);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
}
