import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/src/providers/auth/server';
import { prisma, permissionRepository } from '@/src/lib/prisma';
import { AuditLogRepository } from '@/src/lib/prisma/AuditLogRepository';
import { Roles } from '@/src/lib/permissions/permissions';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/audit-logs/[id]
 * Fetch a single audit log by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication and authorization
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has admin role using PermissionRepository
    const isAdmin = await permissionRepository.hasRole(currentUser.id, Roles.ADMIN);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Fetch audit log with relationships
    const auditLogRepository = new AuditLogRepository(prisma);
    const auditLog = await auditLogRepository.findByIdWithUsers(id);

    if (!auditLog) {
      return NextResponse.json(
        { error: 'Audit log not found' },
        { status: 404 }
      );
    }

    // Format response
    const response = {
      id: auditLog.id,
      action: auditLog.action,
      entityType: auditLog.entityType,
      entityId: auditLog.entityId,
      metadata: auditLog.metadata,
      ipAddress: auditLog.ipAddress,
      createdAt: auditLog.createdAt.toISOString(),
      performedBy: {
        id: auditLog.performedBy.id,
        name: auditLog.performedBy.name,
        email: auditLog.performedBy.email,
      },
      user: auditLog.user ? {
        id: auditLog.user.id,
        name: auditLog.user.name,
        email: auditLog.user.email,
      } : null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching audit log:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
