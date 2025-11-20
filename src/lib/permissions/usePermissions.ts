'use client';

import { useSession } from 'next-auth/react';
import { hasPermission, hasAllPermissions, hasAnyPermission, Resource, PermAction } from '@/src/lib/permissions/permissions';

/**
 * Client-side hook for checking user permissions
 */
export function usePermissions() {
  const { data: session } = useSession();

  const can = (resource: Resource, action: PermAction): boolean => {
    if (!session?.user?.permissions) return false;
    return hasPermission(session.user.permissions, resource, action);
  };

  const canAll = (checks: Array<[Resource, PermAction]>): boolean => {
    if (!session?.user?.permissions) return false;
    return hasAllPermissions(session.user.permissions, checks);
  };

  const canAny = (checks: Array<[Resource, PermAction]>): boolean => {
    if (!session?.user?.permissions) return false;
    return hasAnyPermission(session.user.permissions, checks);
  };

  const hasRole = (roleName: string): boolean => {
    return session?.user?.roles?.includes(roleName) ?? false;
  };

  return {
    can,
    canAll,
    canAny,
    hasRole,
    permissions: session?.user?.permissions ?? [],
    roles: session?.user?.roles ?? [],
    isLoading: !session,
  };
}
