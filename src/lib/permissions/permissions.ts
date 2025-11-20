import { Action } from '@prisma/client';

/**
 * Resources that can have permissions
 */
export const Resources = {
  USERS: 'users',
  UPDATES: 'updates',
  ROLES: 'roles',
  PERMISSIONS: 'permissions',
  // Add more resources as you build out your app
  // PRODUCTS: 'products',
  // ORDERS: 'orders',
} as const;

/**
 * Actions that can be performed on resources
 */
export const Actions = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const;

/**
 * System roles
 */
export const Roles = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const;

export type Resource = typeof Resources[keyof typeof Resources];
export type PermAction = typeof Actions[keyof typeof Actions];
export type Role = typeof Roles[keyof typeof Roles];

/**
 * Type-safe permission checker for client-side use
 */
export function hasPermission(
  permissions: string[] | Set<string>,
  resource: Resource,
  action: PermAction
): boolean {
  const permString = `${resource}:${action}`;
  return Array.isArray(permissions)
    ? permissions.includes(permString)
    : permissions.has(permString);
}

/**
 * Check if user has multiple permissions (ALL)
 */
export function hasAllPermissions(
  permissions: string[] | Set<string>,
  checks: Array<[Resource, PermAction]>
): boolean {
  return checks.every(([resource, action]) =>
    hasPermission(permissions, resource, action)
  );
}

/**
 * Check if user has any of the permissions
 */
export function hasAnyPermission(
  permissions: string[] | Set<string>,
  checks: Array<[Resource, PermAction]>
): boolean {
  return checks.some(([resource, action]) =>
    hasPermission(permissions, resource, action)
  );
}

/**
 * Format permission as string
 */
export function formatPermission(resource: Resource, action: PermAction): string {
  return `${resource}:${action}`;
}

/**
 * Parse permission string
 */
export function parsePermission(permission: string): { resource: string; action: string } | null {
  const [resource, action] = permission.split(':');
  if (!resource || !action) return null;
  return { resource, action };
}

/**
 * Prisma Action enum to string helper
 */
export function actionToString(action: Action): string {
  return action.toLowerCase();
}
