import { ReactNode } from 'react';
import type { Session } from 'next-auth';
import type { User } from '@/src/lib/prisma/types';

export interface AuthContextType {
  user: User | null;
  userRoles: string[] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOnline: boolean;
  mode: 'mobile' | 'desktop' | 'pwa';
  signIn: (callbackUrl?: string) => Promise<void>;
  signOut: (callbackUrl?: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
  initialUser?: User | null;
  initialSession?: Session | null;
}