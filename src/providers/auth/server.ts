import { getServerSession } from 'next-auth';
import { authOptions } from './config';
import { userRepository } from '../../lib/prisma';
import type { User } from '../../lib/prisma/types';

/**
 * Server-side utility to get the current session
 */
export async function getCurrentSession() {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Server-side utility to get the current user with full data from database
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const session = await getCurrentSession();
    
    if (!session?.user) {
      return null;
    }

    // Try to get user by ID first (if available in token)
    const userId = (session.user as any).id;
    if (userId) {
      const user = await userRepository.findById(userId);
      if (user) return user;
    }

    // Fallback: find user by email (for existing sessions before ID was added)
    if (session.user.email) {
      const user = await userRepository.findByEmail(session.user.email);
      return user;
    }

    return null;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

/**
 * Server-side utility to check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentSession();
  return !!session?.user;
}

/**
 * Server-side utility to check if user has specific role
 */
export async function hasRole(requiredRole: number): Promise<boolean> {
  const user = await getCurrentUser();
  return user ? user.role >= requiredRole : false;
}

/**
 * Server-side utility to require authentication (for pages)
 * Throws error if not authenticated - can be caught by error boundaries
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

/**
 * Server-side utility to require specific role
 */
export async function requireRole(requiredRole: number): Promise<User> {
  const user = await requireAuth();
  
  if (user.role < requiredRole) {
    throw new Error('Insufficient permissions');
  }
  
  return user;
}

/**
 * Utility for API route protection (for app/(api) endpoints)
 */
export async function protectApiRoute(requiredRole?: number): Promise<{
  user: User;
  error?: never;
} | {
  user?: never;
  error: {
    status: number;
    message: string;
  };
}> {
  try {
    const session = await getCurrentSession();
    
    if (!session?.user?.id) {
      return {
        error: {
          status: 401,
          message: 'Authentication required'
        }
      };
    }

    const user = await userRepository.findById(session.user.id);
    
    if (!user) {
      return {
        error: {
          status: 404,
          message: 'User not found'
        }
      };
    }

    if (requiredRole !== undefined && user.role < requiredRole) {
      return {
        error: {
          status: 403,
          message: 'Insufficient permissions'
        }
      };
    }

    return { user };
  } catch (error) {
    console.error('Error in protectApiRoute:', error);
    return {
      error: {
        status: 500,
        message: 'Internal server error'
      }
    };
  }
}