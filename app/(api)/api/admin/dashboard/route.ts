import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/src/providers/auth/server';
import { Roles } from '@/src/lib/permissions/permissions';
import { prisma, permissionRepository } from '@/src/lib/prisma';
import { AuditLogRepository } from '@/src/lib/prisma/AuditLogRepository';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/dashboard
 * Fetch dashboard statistics for admin panel
 * Requires: ADMIN role
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication and authorization
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    // Check if user has admin role using PermissionRepository
    const isAdmin = await permissionRepository.hasRole(user.id, Roles.ADMIN);

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin role required' },
        { status: 403 }
      );
    }

    // Calculate start of current week (Sunday at midnight)
    const now = new Date();
    const currentDayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - currentDayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    // Calculate start of today for updates metrics
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Fetch metrics in parallel
    const [
      totalUsers,
      newUsersThisWeek,
      totalRoles,
      totalPermissions,
      roles,
      recentAuditLogs,
      totalUpdates,
      updatesPublishedToday,
      recentUpdates,
    ] = await Promise.all([
      // Total user count
      prisma.user.count(),

      // New users this week
      prisma.user.count({
        where: {
          createdAt: {
            gte: startOfWeek,
          },
        },
      }),

      // Total role count
      prisma.role.count(),

      // Total permission count
      prisma.permission.count(),

      // Get role names for display
      prisma.role.findMany({
        select: {
          name: true,
        },
        orderBy: {
          name: 'asc',
        },
      }),

      // Fetch recent audit logs
      (async () => {
        const auditLogRepository = new AuditLogRepository(prisma);
        return auditLogRepository.findRecentWithUsers(10);
      })(),

      // Total updates count
      prisma.update.count(),

      // Updates published today
      prisma.update.count({
        where: {
          status: 'PUBLISHED',
          publishedAt: {
            gte: startOfToday,
          },
        },
      }),

      // Recent updates
      prisma.update.findMany({
        take: 5,
        orderBy: [
          { publishedAt: { sort: 'desc', nulls: 'first' } },
          { createdAt: 'desc' },
        ],
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    // Map audit action to user-friendly description
    const getActionDescription = (action: string, metadata: any, performedBy: any, targetUser: any): string => {
      const actorName = performedBy.name || performedBy.email;
      
      // Helper to format user display name consistently
      const formatUserName = (name: string | null | undefined, email: string | undefined): string => {
        if (name && email) return `${name} (${email})`;
        return email || name || 'user';
      };
      
      switch (action) {
        case 'USER_LOGIN':
          return `${formatUserName(targetUser?.name, targetUser?.email || metadata?.email)} logged in${metadata?.provider ? ` via ${metadata.provider}` : ''}`;
        case 'USER_CREATED':
          return `${actorName} created user ${formatUserName(metadata?.name, metadata?.email)}`;
        case 'USER_UPDATED':
          const targetName = formatUserName(targetUser?.name, targetUser?.email || metadata?.email);
          const changeCount = Object.keys(metadata?.changes || {}).length;
          return `${actorName} updated ${targetName}${changeCount > 0 ? ` (${changeCount} field${changeCount > 1 ? 's' : ''})` : ''}`;
        case 'INVITATION_SENT':
          return `${actorName} sent invitation to ${metadata?.email}`;
        case 'ROLE_CHANGED':
          const roleAction = metadata?.action === 'added' ? 'added' : 'removed';
          const roleTargetName = formatUserName(targetUser?.name, targetUser?.email);
          return `${actorName} ${roleAction} ${metadata?.roleName} role for ${roleTargetName}`;
        case 'USER_DELETED':
          return `${actorName} deleted user ${formatUserName(metadata?.name, metadata?.email)}`;
        case 'PERMISSION_CHANGED':
          const permAction = metadata?.action === 'granted' ? 'granted' : 'revoked';
          return `${actorName} ${permAction} ${metadata?.resource}:${metadata?.permissionAction} permission`;
        case 'UPDATE_CREATED':
          return `${actorName} created ${metadata?.type?.toLowerCase()} "${metadata?.title}"`;
        case 'UPDATE_UPDATED':
          const updateChangeCount = Object.keys(metadata?.changes || {}).length;
          return `${actorName} updated "${metadata?.title}"${updateChangeCount > 0 ? ` (${updateChangeCount} field${updateChangeCount > 1 ? 's' : ''})` : ''}`;
        case 'UPDATE_DELETED':
          return `${actorName} deleted ${metadata?.type?.toLowerCase()} "${metadata?.title}"`;
        case 'UPDATE_PUBLISHED':
          return `${actorName} published ${metadata?.type?.toLowerCase()} "${metadata?.title}"`;
        default:
          return `${actorName} performed ${action.toLowerCase().replace('_', ' ')}`;
      }
    };

    // Transform audit logs for activity feed
    const recentActivity = recentAuditLogs.map(log => ({
      id: log.id,
      title: getActionDescription(log.action, log.metadata, log.performedBy, log.user),
      author: log.performedBy.name || log.performedBy.email,
      publishedAt: log.createdAt.toISOString(),
      status: 'audit',
      statusColor: 'blue' as const,
    }));

    // Map update status to color
    const getStatusColor = (status: string): 'green' | 'blue' | 'purple' | 'gray' => {
      switch (status) {
        case 'PUBLISHED': return 'green';
        case 'DRAFT': return 'blue';
        case 'ARCHIVED': return 'gray';
        default: return 'purple';
      }
    };

    // Transform updates for dashboard
    const recentUpdatesFormatted = recentUpdates.map(update => ({
      id: update.id,
      title: update.title,
      author: update.author.name || update.author.email,
      publishedAt: (update.publishedAt || update.createdAt).toISOString(),
      status: update.status,
      statusColor: getStatusColor(update.status),
    }));

    // Build response
    const dashboardData = {
      users: {
        total: totalUsers,
        newThisWeek: newUsersThisWeek,
        growth: totalUsers > 0 ? ((newUsersThisWeek / totalUsers) * 100).toFixed(1) : '0',
      },
      roles: {
        total: totalRoles,
        names: roles.map(r => r.name),
      },
      permissions: {
        total: totalPermissions,
        // Could add breakdown by resource if needed
      },
      auditLogs: recentActivity,
      updates: {
        total: totalUpdates,
        publishedToday: updatesPublishedToday,
        recentUpdates: recentUpdatesFormatted,
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
