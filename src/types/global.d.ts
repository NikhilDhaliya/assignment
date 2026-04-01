import { type RoleType } from '../constants/roles.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: RoleType;
        name: string;
      };
    }
  }
}

export {};
