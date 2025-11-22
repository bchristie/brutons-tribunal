import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/src/providers/auth/server';
import { Roles } from '@/src/lib/permissions/permissions';
import { prisma, permissionRepository } from '@/src/lib/prisma';

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

    // Fetch metrics in parallel
    const [
      totalUsers,
      newUsersThisWeek,
      totalRoles,
      totalPermissions,
      roles,
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
    ]);

    // TODO: Replace with actual update data when updates system is implemented
    const updateStats = {
      total: 24,
      publishedToday: 3,
      recentUpdates: [
        {
          id: '1',
          title: 'New Feature Announcement',
          author: 'System',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          status: 'published',
        },
        {
          id: '2',
          title: 'Security Update',
          author: 'Admin',
          publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
          status: 'published',
        },
        {
          id: '3',
          title: 'Maintenance Notice',
          author: 'System',
          publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          status: 'published',
        },
      ],
    };

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
      updates: updateStats,
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
