import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/src/providers/auth/server';
import { Roles } from '@/src/lib/permissions/permissions';
import { prisma, permissionRepository } from '@/src/lib/prisma';
import { AuditLogRepository } from '@/src/lib/prisma/AuditLogRepository';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/audit-logs
 * Fetch recent audit logs for admin dashboard
 * Requires: ADMIN role
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    // Check if user has admin role
    const isAdmin = await permissionRepository.hasRole(user.id, Roles.ADMIN);

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin role required' },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');
    const performedById = searchParams.get('performedById');

    const auditLogRepository = new AuditLogRepository(prisma);

    let auditLogs;
    if (action) {
      auditLogs = await auditLogRepository.findByAction(action, limit);
    } else if (userId) {
      auditLogs = await auditLogRepository.findByUserId(userId, limit);
    } else if (performedById) {
      auditLogs = await auditLogRepository.findByPerformedById(performedById, limit);
    } else {
      auditLogs = await auditLogRepository.findRecentWithUsers(limit);
    }

    // Transform audit logs for response
    const transformedLogs = auditLogs.map((log) => ({
      id: log.id,
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      metadata: log.metadata,
      ipAddress: log.ipAddress,
      createdAt: log.createdAt,
      user: log.user ? {
        id: log.user.id,
        email: log.user.email,
        name: log.user.name,
      } : null,
      performedBy: {
        id: log.performedBy.id,
        email: log.performedBy.email,
        name: log.performedBy.name,
      },
    }));

    return NextResponse.json({
      auditLogs: transformedLogs,
      count: transformedLogs.length,
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
