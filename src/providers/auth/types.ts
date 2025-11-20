import type { DefaultSession } from 'next-auth';
import type { User as PrismaUser } from '../../lib/prisma/types';

// Extend the default session types
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      permissions?: string[];
      roles?: string[];
    } & DefaultSession['user'];
  }

  interface User extends PrismaUser {}
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    permissions?: string[];
    roles?: string[];
  }
}