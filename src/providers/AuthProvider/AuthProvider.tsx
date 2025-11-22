'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signIn as nextAuthSignIn, signOut } from 'next-auth/react';
import { AuthContextType, AuthProviderProps } from './AuthProvider.types';
import { useMobileDetection } from '@/src/hooks/useMobileDetection';
import { Roles } from '@/src/lib/permissions/permissions';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function AuthProviderInternal({ children, initialUser }: AuthProviderProps) {
  // Use session primarily for auth status - we have initialUser from server with roles already
  const { data: session, status } = useSession();
  const [user, setUser] = useState(initialUser || null);
  const [isOnline, setIsOnline] = useState(true);
  const { detectedMode } = useMobileDetection();

  // Update user state when initialUser changes (server-side updates)
  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    }
  }, [initialUser]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Handle session changes and create fallback user data when database user isn't available
  useEffect(() => {
    if (status === 'unauthenticated') {
      setUser(null);
    } else if (status === 'authenticated' && session?.user) {
      // If we have initialUser (from server), use it but merge in session data (like roles)
      if (initialUser) {
        const mergedUser = {
          ...initialUser,
          ...(session.user as any).roles && { roles: (session.user as any).roles },
          ...(session.user as any).permissions && { permissions: (session.user as any).permissions },
        };
        setUser(mergedUser as any);
      } else if (!user) {
        // Create fallback user from session data when database user isn't available
        const fallbackUser = {
          id: (session.user as any).id || 'session-user',
          email: session.user.email || '',
          name: session.user.name || null,
          image: session.user.image || null,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...(session.user as any).roles && { roles: (session.user as any).roles },
          ...(session.user as any).permissions && { permissions: (session.user as any).permissions },
        };
        setUser(fallbackUser);
      }
    }
  }, [status, session, initialUser]);

  const refreshUser = async () => {
    try {
      const response = await fetch('/api/auth/user');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  // Custom signIn function that directly uses Google provider
  const signIn = async (callbackUrl?: string) => {
    // Use NextAuth's signIn with Google provider specified
    await nextAuthSignIn('google', { callbackUrl });
  };

  // Custom signOut function with optional callback URL
  const customSignOut = async (callbackUrl?: string) => {
    await signOut({ callbackUrl });
  };

  // Check if user has admin role
  const isAdmin = (user as any)?.roles?.some((role: any) => role === Roles.ADMIN) ?? false;

  const value: AuthContextType = {
    user: user, // Always use server-provided user data when available
    userRoles: (user as any)?.roles || null,
    isLoading: status === 'loading',
    isAuthenticated: !!session?.user,
    isAdmin,
    isOnline,
    mode: detectedMode,
    signIn,
    signOut: customSignOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProviderInternal;