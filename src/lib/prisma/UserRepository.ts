import { BaseRepository } from './BaseRepository';
import { prisma } from './prisma';
import type { User, UserCreateInput, UserUpdateInput, UserQueryOptions } from './types/user.types';

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
   * Find a user by email address
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.getDelegate().findUnique({
      where: { email },
    });
  }

  /**
   * Find users by role
   */
  async findByRole(role: number): Promise<User[]> {
    return await this.getDelegate().findMany({
      where: { role },
      orderBy: { createdAt: 'desc' },
    });
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
   * Update user role
   */
  async updateRole(id: string, role: number): Promise<User> {
    return await this.update(id, { role });
  }

  /**
   * Get user statistics
   */
  async getStats(): Promise<{
    totalUsers: number;
    usersByRole: Record<number, number>;
    recentUsers: User[];
  }> {
    const [totalUsers, allUsers, recentUsers] = await Promise.all([
      this.count(),
      this.getDelegate().findMany({
        select: { role: true },
      }),
      this.getDelegate().findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    // Count users by role
    const usersByRole: Record<number, number> = {};
    allUsers.forEach((user: { role: number }) => {
      usersByRole[user.role] = (usersByRole[user.role] || 0) + 1;
    });

    return {
      totalUsers,
      usersByRole,
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