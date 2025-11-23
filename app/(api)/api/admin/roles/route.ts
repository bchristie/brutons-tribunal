import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/src/providers/auth/server';
import { Roles } from '@/src/lib/permissions/permissions';
import { prisma, permissionRepository } from '@/src/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/roles
 * Fetch all roles
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

    // Fetch all roles
    const roles = await prisma.role.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
