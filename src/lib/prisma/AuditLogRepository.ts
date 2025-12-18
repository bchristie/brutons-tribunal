import { PrismaClient, AuditLog, Prisma } from '@prisma/client';
import { BaseRepository } from './BaseRepository';

type AuditLogCreate = Prisma.AuditLogCreateInput;
type AuditLogUpdate = Prisma.AuditLogUpdateInput;
type AuditLogWithUser = Prisma.AuditLogGetPayload<{
  include: { user: true; performedBy: true };
}>;

/**
 * Repository for AuditLog operations
 * Provides methods for logging admin actions and retrieving audit trails
 */
export class AuditLogRepository extends BaseRepository<AuditLog, AuditLogCreate, AuditLogUpdate> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'auditLog');
  }

  protected getDelegate() {
    return this.prisma.auditLog;
  }

  /**
   * Log a user login event
   */
  async logUserLogin(
    userId: string,
    metadata?: { email: string; provider?: string; isNewUser?: boolean },
    ipAddress?: string
  ): Promise<AuditLog> {
    return this.create({
      action: 'USER_LOGIN',
      entityType: 'User',
      entityId: userId,
      metadata: metadata as Prisma.InputJsonValue,
      ipAddress,
      user: { connect: { id: userId } },
      performedBy: { connect: { id: userId } },
    });
  }

  /**
   * Log a user creation event
   */
  async logUserCreated(
    userId: string,
    performedById: string,
    metadata?: { email: string; name?: string; roles?: string[] },
    ipAddress?: string
  ): Promise<AuditLog> {
    return this.create({
      action: 'USER_CREATED',
      entityType: 'User',
      entityId: userId,
      metadata: metadata as Prisma.InputJsonValue,
      ipAddress,
      user: { connect: { id: userId } },
      performedBy: { connect: { id: performedById } },
    });
  }

  /**
   * Log an invitation sent event
   */
  async logInvitationSent(
    email: string,
    performedById: string,
    metadata?: { roles?: string[] },
    ipAddress?: string
  ): Promise<AuditLog> {
    return this.create({
      action: 'INVITATION_SENT',
      entityType: 'User',
      entityId: null,
      metadata: { email, ...metadata } as Prisma.InputJsonValue,
      ipAddress,
      performedBy: { connect: { id: performedById } },
    });
  }

  /**
   * Log a role change event
   */
  async logRoleChanged(
    userId: string,
    performedById: string,
    metadata: { action: 'added' | 'removed'; roleId: string; roleName: string },
    ipAddress?: string
  ): Promise<AuditLog> {
    return this.create({
      action: 'ROLE_CHANGED',
      entityType: 'User',
      entityId: userId,
      metadata: metadata as Prisma.InputJsonValue,
      ipAddress,
      user: { connect: { id: userId } },
      performedBy: { connect: { id: performedById } },
    });
  }

  /**
   * Log a user update event
   */
  async logUserUpdated(
    userId: string,
    performedById: string,
    metadata: { email: string; changes: Record<string, any> },
    ipAddress?: string
  ): Promise<AuditLog> {
    return this.create({
      action: 'USER_UPDATED',
      entityType: 'User',
      entityId: userId,
      metadata: metadata as Prisma.InputJsonValue,
      ipAddress,
      user: { connect: { id: userId } },
      performedBy: { connect: { id: performedById } },
    });
  }

  /**
   * Log a user deletion event
   */
  async logUserDeleted(
    userId: string,
    performedById: string,
    metadata?: { email: string; name?: string },
    ipAddress?: string
  ): Promise<AuditLog> {
    return this.create({
      action: 'USER_DELETED',
      entityType: 'User',
      entityId: userId,
      metadata: metadata as Prisma.InputJsonValue,
      ipAddress,
      performedBy: { connect: { id: performedById } },
    });
  }

  /**
   * Log a permission change event
   */
  async logPermissionChanged(
    roleId: string,
    performedById: string,
    metadata: { action: 'granted' | 'revoked'; permissionId: string; resource: string; permissionAction: string },
    ipAddress?: string
  ): Promise<AuditLog> {
    return this.create({
      action: 'PERMISSION_CHANGED',
      entityType: 'Role',
      entityId: roleId,
      metadata: metadata as Prisma.InputJsonValue,
      ipAddress,
      performedBy: { connect: { id: performedById } },
    });
  }

  /**
   * Log an update creation event
   */
  async logUpdateCreated(
    updateId: string,
    performedById: string,
    metadata: { title: string; type: string; status: string },
    ipAddress?: string
  ): Promise<AuditLog> {
    return this.create({
      action: 'UPDATE_CREATED',
      entityType: 'Update',
      entityId: updateId,
      metadata: metadata as Prisma.InputJsonValue,
      ipAddress,
      performedBy: { connect: { id: performedById } },
    });
  }

  /**
   * Log an update modification event
   */
  async logUpdateUpdated(
    updateId: string,
    performedById: string,
    metadata: { title: string; changes: Record<string, any> },
    ipAddress?: string
  ): Promise<AuditLog> {
    return this.create({
      action: 'UPDATE_UPDATED',
      entityType: 'Update',
      entityId: updateId,
      metadata: metadata as Prisma.InputJsonValue,
      ipAddress,
      performedBy: { connect: { id: performedById } },
    });
  }

  /**
   * Log an update deletion event
   */
  async logUpdateDeleted(
    updateId: string,
    performedById: string,
    metadata: { title: string; type: string },
    ipAddress?: string
  ): Promise<AuditLog> {
    return this.create({
      action: 'UPDATE_DELETED',
      entityType: 'Update',
      entityId: updateId,
      metadata: metadata as Prisma.InputJsonValue,
      ipAddress,
      performedBy: { connect: { id: performedById } },
    });
  }

  /**
   * Log an update published event
   */
  async logUpdatePublished(
    updateId: string,
    performedById: string,
    metadata: { title: string; type: string; publishedAt: string },
    ipAddress?: string
  ): Promise<AuditLog> {
    return this.create({
      action: 'UPDATE_PUBLISHED',
      entityType: 'Update',
      entityId: updateId,
      metadata: metadata as Prisma.InputJsonValue,
      ipAddress,
      performedBy: { connect: { id: performedById } },
    });
  }

  /**
   * Find a single audit log by ID with user details
   */
  async findByIdWithUsers(id: string): Promise<AuditLogWithUser | null> {
    return this.prisma.auditLog.findUnique({
      where: { id },
      include: {
        user: true,
        performedBy: true,
      },
    });
  }

  /**
   * Find recent audit logs with user details
   */
  async findRecentWithUsers(limit: number = 20): Promise<AuditLogWithUser[]> {
    return this.prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        performedBy: true,
      },
    });
  }

  /**
   * Find paginated audit logs with user details
   */
  async findPaginated(page: number = 1, perPage: number = 10): Promise<{ logs: AuditLogWithUser[], total: number, totalPages: number }> {
    const skip = (page - 1) * perPage;
    
    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        take: perPage,
        skip,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          performedBy: true,
        },
      }),
      this.prisma.auditLog.count(),
    ]);

    return {
      logs,
      total,
      totalPages: Math.ceil(total / perPage),
    };
  }

  /**
   * Find audit logs by action type
   */
  async findByAction(action: string, limit: number = 50): Promise<AuditLogWithUser[]> {
    return this.prisma.auditLog.findMany({
      where: { action },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        performedBy: true,
      },
    });
  }

  /**
   * Find audit logs for a specific user
   */
  async findByUserId(userId: string, limit: number = 50): Promise<AuditLogWithUser[]> {
    return this.prisma.auditLog.findMany({
      where: { userId },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        performedBy: true,
      },
    });
  }

  /**
   * Find audit logs performed by a specific admin
   */
  async findByPerformedById(performedById: string, limit: number = 50): Promise<AuditLogWithUser[]> {
    return this.prisma.auditLog.findMany({
      where: { performedById },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        performedBy: true,
      },
    });
  }

  /**
   * Count audit logs by action in a date range
   */
  async countByActionInRange(
    action: string,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    return this.prisma.auditLog.count({
      where: {
        action,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  /**
   * Count total audit logs today
   */
  async countToday(): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return this.prisma.auditLog.count({
      where: {
        createdAt: {
          gte: startOfDay,
        },
      },
    });
  }
}
