import { ReactNode } from 'react';
import type { User } from '@/src/lib/prisma/types';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOnline: boolean;
  mode: 'mobile' | 'desktop' | 'pwa';
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
  initialUser?: User | null;
}