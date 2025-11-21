import { BaseRepository } from './BaseRepository';
import { prisma } from './prisma';
import type {
  UserPermissions,
  Role,
  Permission,
  UserRole,
  RolePermission,
} from './types/permission.types';

/**
 * Permission Repository class extending BaseRepository
 * Manages roles, permissions, and user access control
 * 
 * Note: Cache is request-scoped only (serverless environment).
 * Multiple permission checks within the same request will benefit from caching.
 */
export class PermissionRepository extends BaseRepository<Role, any, any> {
  // Request-scoped cache - only persists for the duration of this instance
  private cache = new Map<string, UserPermissions>();

  constructor() {
    super(prisma, 'Role');
  }

  /**
   * Get the Prisma role delegate
   */
  protected getDelegate() {
    return this.prisma.role;
  }

  /**
   * Get all permissions for a user, with request-scoped caching
   */
  async getUserPermissions(userId: string, useCache = true): Promise<UserPermissions> {
    // Check cache first (only within this request)
    if (useCache) {
      const cached = this.cache.get(userId);
      if (cached) {
        return cached;
      }
    }

    // Fetch from database with all relations in one query
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Flatten permissions into a Set for O(1) lookup
    const permissions = new Set<string>();
    const roles: string[] = [];

    user.userRoles.forEach((userRole: any) => {
      roles.push(userRole.role.name);
      userRole.role.rolePermissions.forEach((rp: any) => {
        const perm = `${rp.permission.resource}:${rp.permission.action.toLowerCase()}`;
        permissions.add(perm);
      });
    });

    const userPermissions: UserPermissions = {
      userId,
      permissions,
      roles,
    };

    // Cache for this request
    this.cache.set(userId, userPermissions);

    return userPermissions;
  }

  /**
   * Check if user has a specific permission
   */
  async can(userId: string, resource: string, action: string): Promise<boolean> {
    const userPerms = await this.getUserPermissions(userId);
    return userPerms.permissions.has(`${resource}:${action.toLowerCase()}`);
  }

  /**
   * Check if user has ALL of the specified permissions
   */
  async canAll(userId: string, checks: Array<[string, string]>): Promise<boolean> {
    const userPerms = await this.getUserPermissions(userId);
    return checks.every(([resource, action]) =>
      userPerms.permissions.has(`${resource}:${action.toLowerCase()}`)
    );
  }

  /**
   * Check if user has ANY of the specified permissions
   */
  async canAny(userId: string, checks: Array<[string, string]>): Promise<boolean> {
    const userPerms = await this.getUserPermissions(userId);
    return checks.some(([resource, action]) =>
      userPerms.permissions.has(`${resource}:${action.toLowerCase()}`)
    );
  }

  /**
   * Check if user has a specific role
   */
  async hasRole(userId: string, roleName: string): Promise<boolean> {
    const userPerms = await this.getUserPermissions(userId);
    return userPerms.roles.includes(roleName);
  }

  /**
   * Invalidate cache when roles/permissions change
   */
  invalidateCache(userId: string) {
    this.cache.delete(userId);
  }

  /**
   * Clear all cached permissions
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Assign a role to a user
   */
  async assignRole(userId: string, roleId: string): Promise<UserRole> {
    const userRole = await this.prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
      update: {},
      create: {
        userId,
        roleId,
      },
    });

    // Invalidate cache for this request
    this.invalidateCache(userId);

    return userRole;
  }

  /**
   * Remove a role from a user
   */
  async removeRole(userId: string, roleId: string): Promise<UserRole> {
    const userRole = await this.prisma.userRole.delete({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });

    // Invalidate cache for this request
    this.invalidateCache(userId);

    return userRole;
  }

  /**
   * Get all roles for a user
   */
  async getUserRoles(userId: string): Promise<Role[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      include: {
        role: true,
      },
    });

    return userRoles.map((ur: any) => ur.role);
  }

  /**
   * Assign a permission to a role
   */
  async assignPermissionToRole(roleId: string, permissionId: string): Promise<RolePermission> {
    const rolePermission = await this.prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
      update: {},
      create: {
        roleId,
        permissionId,
      },
    });

    // Clear cache for this request (affects all users with this role)
    this.clearCache();

    return rolePermission;
  }

  /**
   * Remove a permission from a role
   */
  async removePermissionFromRole(roleId: string, permissionId: string): Promise<RolePermission> {
    const rolePermission = await this.prisma.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
    });

    // Clear cache for this request (affects all users with this role)
    this.clearCache();

    return rolePermission;
  }

  /**
   * Get a role by name
   */
  async getRole(roleName: string): Promise<Role | null> {
    return await this.prisma.role.findUnique({
      where: { name: roleName },
    });
  }

  /**
   * Get all roles
   */
  async getAllRoles(): Promise<Role[]> {
    return await this.prisma.role.findMany({
      orderBy: { name: 'asc' },
    });
  }
}

export const permissionRepository = new PermissionRepository();
