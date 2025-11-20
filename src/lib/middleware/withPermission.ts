import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { permissionRepository } from '@/src/lib/prisma';
import { Resource, PermAction } from '@/src/lib/permissions/permissions';

type RouteHandler = (
  req: NextRequest,
  context?: { params?: any }
) => Promise<Response> | Response;

/**
 * Middleware to protect API routes with permission checks
 * 
 * @example
 * export const DELETE = withPermission('users', 'delete')(
 *   async (req: NextRequest) => {
 *     // Your delete logic here
 *   }
 * );
 */
export function withPermission(resource: Resource, action: PermAction) {
  return function (handler: RouteHandler): RouteHandler {
    return async (req: NextRequest, context?: { params?: any }) => {
      // Get session (assumes NextAuth is configured)
      const session = await getServerSession();

      if (!session?.user?.id) {
        return Response.json(
          { error: 'Unauthorized', message: 'You must be logged in' },
          { status: 401 }
        );
      }

      // Check permission
      const canAccess = await permissionRepository.can(
        session.user.id,
        resource,
        action
      );

      if (!canAccess) {
        return Response.json(
          {
            error: 'Forbidden',
            message: `You do not have permission to ${action} ${resource}`,
          },
          { status: 403 }
        );
      }

      // User has permission, proceed with handler
      return handler(req, context);
    };
  };
}

/**
 * Middleware to check if user has ANY of the specified permissions
 */
export function withAnyPermission(checks: Array<[Resource, PermAction]>) {
  return function (handler: RouteHandler): RouteHandler {
    return async (req: NextRequest, context?: { params?: any }) => {
      const session = await getServerSession();

      if (!session?.user?.id) {
        return Response.json(
          { error: 'Unauthorized', message: 'You must be logged in' },
          { status: 401 }
        );
      }

      const canAccess = await permissionRepository.canAny(
        session.user.id,
        checks
      );

      if (!canAccess) {
        return Response.json(
          {
            error: 'Forbidden',
            message: 'You do not have the required permissions',
          },
          { status: 403 }
        );
      }

      return handler(req, context);
    };
  };
}

/**
 * Middleware to check if user has ALL of the specified permissions
 */
export function withAllPermissions(checks: Array<[Resource, PermAction]>) {
  return function (handler: RouteHandler): RouteHandler {
    return async (req: NextRequest, context?: { params?: any }) => {
      const session = await getServerSession();

      if (!session?.user?.id) {
        return Response.json(
          { error: 'Unauthorized', message: 'You must be logged in' },
          { status: 401 }
        );
      }

      const canAccess = await permissionRepository.canAll(
        session.user.id,
        checks
      );

      if (!canAccess) {
        return Response.json(
          {
            error: 'Forbidden',
            message: 'You do not have all the required permissions',
          },
          { status: 403 }
        );
      }

      return handler(req, context);
    };
  };
}

/**
 * Middleware to check if user has a specific role
 */
export function withRole(roleName: string) {
  return function (handler: RouteHandler): RouteHandler {
    return async (req: NextRequest, context?: { params?: any }) => {
      const session = await getServerSession();

      if (!session?.user?.id) {
        return Response.json(
          { error: 'Unauthorized', message: 'You must be logged in' },
          { status: 401 }
        );
      }

      const hasRequiredRole = await permissionRepository.hasRole(
        session.user.id,
        roleName
      );

      if (!hasRequiredRole) {
        return Response.json(
          {
            error: 'Forbidden',
            message: `You must have the ${roleName} role to access this resource`,
          },
          { status: 403 }
        );
      }

      return handler(req, context);
    };
  };
}
