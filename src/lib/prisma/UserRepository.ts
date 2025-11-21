import { BaseRepository } from './BaseRepository';
import { prisma } from './prisma';
import type { User, UserWithRoles, UserCreateInput, UserUpdateInput, UserQueryOptions } from './types/user.types';

/**
 * User Repository class extending BaseRepository
 * Provides user-specific operations in addition to base CRUD
 */
export class UserRepository extends BaseRepository<User, UserCreateInput, UserUpdateInput> {
  constructor() {
    super(prisma, 'User');
  }

  /**
   * Get the Prisma user delegate
   */
  protected getDelegate() {
    return this.prisma.user;
  }

  /**
   * Get the include object for fetching user with roles
   */
  private getRolesInclude() {
    return {
      userRoles: {
        include: {
          role: {
            select: {
              name: true,
            },
          },
        },
      },
    };
  }

  /**
   * Transform user with userRoles to include computed roles array
   */
  private transformUserWithRoles(user: any): UserWithRoles {
    if (!user) return user;
    
    const roles = user.userRoles?.map((ur: any) => ur.role.name) || [];
    return {
      ...user,
      roles,
    };
  }

  /**
   * Find a user by ID (overridden to include roles)
   */
  async findById(id: string, includeRoles: boolean = true): Promise<UserWithRoles | null> {
    const user = await this.getDelegate().findUnique({
      where: { id },
      ...(includeRoles && { include: this.getRolesInclude() }),
    });
    
    return includeRoles ? this.transformUserWithRoles(user) : user;
  }

  /**
   * Find a user by email address (overridden to include roles)
   */
  async findByEmail(email: string, includeRoles: boolean = true): Promise<UserWithRoles | null> {
    const user = await this.getDelegate().findUnique({
      where: { email },
      ...(includeRoles && { include: this.getRolesInclude() }),
    });
    
    return includeRoles ? this.transformUserWithRoles(user) : user;
  }

  /**
   * Search users by name (case-insensitive partial match)
   */
  async searchByName(searchTerm: string): Promise<User[]> {
    return await this.getDelegate().findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Find users with pagination and filtering
   */
  async findUsersWithOptions(options: UserQueryOptions): Promise<User[]> {
    return await this.getDelegate().findMany({
      where: options.where,
      orderBy: options.orderBy || { createdAt: 'desc' },
      skip: options.skip,
      take: options.take,
    });
  }

  /**
   * Check if email already exists (useful for registration)
   */
  async emailExists(email: string): Promise<boolean> {
    const count = await this.getDelegate().count({
      where: { email },
    });
    return count > 0;
  }

  /**
   * Get user statistics
   */
  async getStats(): Promise<{
    totalUsers: number;
    recentUsers: User[];
  }> {
    const [totalUsers, recentUsers] = await Promise.all([
      this.count(),
      this.getDelegate().findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    return {
      totalUsers,
      recentUsers,
    };
  }

  /**
   * Create or update user (useful for OAuth scenarios)
   */
  async createOrUpdate(email: string, userData: Omit<UserCreateInput, 'email'>): Promise<User> {
    return await this.upsert(
      { email },
      { email, ...userData },
      userData
    );
  }
}

// Export a singleton instance
export const userRepository = new UserRepository();