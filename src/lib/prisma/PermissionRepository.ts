import { prisma } from './prisma';

export type UserPermissions = {
  userId: string;
  permissions: Set<string>; // e.g., "users:read", "products:delete"
  roles: string[];
  cachedAt: number;
};

class PermissionRepository {
  private cache = new Map<string, UserPermissions>();
  private cacheDuration = 5 * 60 * 1000; // 5 minutes

  /**
   * Get all permissions for a user, with caching
   */
  async getUserPermissions(userId: string, forceRefresh = false): Promise<UserPermissions> {
    // Check cache first
    if (!forceRefresh) {
      const cached = this.cache.get(userId);
      if (cached && Date.now() - cached.cachedAt < this.cacheDuration) {
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
      cachedAt: Date.now(),
    };

    // Cache it
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
  async assignRole(userId: string, roleId: string) {
    const userRole = await prisma.userRole.upsert({
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

    // Invalidate cache
    this.invalidateCache(userId);

    return userRole;
  }

  /**
   * Remove a role from a user
   */
  async removeRole(userId: string, roleId: string) {
    const userRole = await prisma.userRole.delete({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });

    // Invalidate cache
    this.invalidateCache(userId);

    return userRole;
  }

  /**
   * Get all roles for a user
   */
  async getUserRoles(userId: string) {
    const userRoles = await prisma.userRole.findMany({
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
  async assignPermissionToRole(roleId: string, permissionId: string) {
    const rolePermission = await prisma.rolePermission.upsert({
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

    // Clear cache for all users with this role
    this.clearCache();

    return rolePermission;
  }

  /**
   * Remove a permission from a role
   */
  async removePermissionFromRole(roleId: string, permissionId: string) {
    const rolePermission = await prisma.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
    });

    // Clear cache for all users with this role
    this.clearCache();

    return rolePermission;
  }

  /**
   * Get a role by name
   */
  async getRole(roleName: string) {
    return await prisma.role.findUnique({
      where: { name: roleName },
    });
  }

  /**
   * Get all roles
   */
  async getAllRoles() {
    return await prisma.role.findMany({
      orderBy: { name: 'asc' },
    });
  }
}

export const permissionRepository = new PermissionRepository();
