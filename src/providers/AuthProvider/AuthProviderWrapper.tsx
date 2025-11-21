'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import AuthProviderInternal, { useAuth } from './AuthProvider';
import { AuthProviderProps } from './AuthProvider.types';

/**
 * Main AuthProvider that wraps both SessionProvider and our custom provider
 */
export function AuthProvider({ children, initialSession, ...props }: AuthProviderProps) {
  return (
    <SessionProvider 
      session={initialSession}      // Pass server-side session to avoid initial fetch
      refetchInterval={0}           // Disable automatic background refetch (we use server-side initialUser)
      refetchOnWindowFocus={false}  // Disable refetch on window focus (we use server-side initialUser)
    >
      <AuthProviderInternal {...props}>
        {children}
      </AuthProviderInternal>
    </SessionProvider>
  );
}

/**
 * Hook to check if user has specific role by name
 */
export function useHasRole(roleName: string): boolean {
  const { user } = useAuth();
  return user ? ((user as any).roles || []).includes(roleName) : false;
}

/**
 * Hook to require authentication (throws error if not authenticated)
 */
export function useRequireAuth() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    throw new Promise(() => {}); // Suspend component until loading is done
  }
  
  if (!isAuthenticated || !user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

export { useAuth };