import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/src/providers/auth/server';
import { Roles } from '@/src/lib/permissions/permissions';
import { prisma, permissionRepository } from '@/src/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/users/[id]/roles
 * Assign a role to a user
 * Requires: ADMIN role
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    // Check if user has admin role
    const isAdmin = await permissionRepository.hasRole(currentUser.id, Roles.ADMIN);

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin role required' },
        { status: 403 }
      );
    }

    const userId = params.id;
    const body = await request.json();
    const { roleId, roleName } = body;

    // Must provide either roleId or roleName
    if (!roleId && !roleName) {
      return NextResponse.json(
        { error: 'Either roleId or roleName is required' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get role by ID or name
    let role;
    if (roleId) {
      role = await prisma.role.findUnique({
        where: { id: roleId },
      });
    } else {
      role = await prisma.role.findUnique({
        where: { name: roleName },
      });
    }

    if (!role) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      );
    }

    // Check if user already has this role
    const existingUserRole = await prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId,
          roleId: role.id,
        },
      },
    });

    if (existingUserRole) {
      return NextResponse.json(
        { error: 'User already has this role' },
        { status: 409 }
      );
    }

    // Assign role using permission repository (handles cache invalidation)
    await permissionRepository.assignRole(userId, role.id);

    // Fetch updated user with roles
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Transform response
    const transformedUser = {
      id: updatedUser!.id,
      email: updatedUser!.email,
      name: updatedUser!.name,
      image: updatedUser!.image,
      createdAt: updatedUser!.createdAt,
      updatedAt: updatedUser!.updatedAt,
      roles: updatedUser!.userRoles.map((ur: any) => ({
        id: ur.role.id,
        name: ur.role.name,
      })),
    };

    return NextResponse.json(transformedUser, { status: 201 });
  } catch (error) {
    console.error('Error assigning role to user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]/roles
 * Remove a role from a user
 * Requires: ADMIN role
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    // Check if user has admin role
    const isAdmin = await permissionRepository.hasRole(currentUser.id, Roles.ADMIN);

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin role required' },
        { status: 403 }
      );
    }

    const userId = params.id;
    const { searchParams } = new URL(request.url);
    const roleId = searchParams.get('roleId');
    const roleName = searchParams.get('roleName');

    // Must provide either roleId or roleName
    if (!roleId && !roleName) {
      return NextResponse.json(
        { error: 'Either roleId or roleName query parameter is required' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get role by ID or name
    let role;
    if (roleId) {
      role = await prisma.role.findUnique({
        where: { id: roleId },
      });
    } else {
      role = await prisma.role.findUnique({
        where: { name: roleName! },
      });
    }

    if (!role) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      );
    }

    // Check if user has this role
    const existingUserRole = await prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId,
          roleId: role.id,
        },
      },
    });

    if (!existingUserRole) {
      return NextResponse.json(
        { error: 'User does not have this role' },
        { status: 404 }
      );
    }

    // Prevent removing admin role from self
    if (userId === currentUser.id && role.name === Roles.ADMIN) {
      return NextResponse.json(
        { error: 'Cannot remove admin role from yourself' },
        { status: 400 }
      );
    }

    // Remove role using permission repository (handles cache invalidation)
    await permissionRepository.removeRole(userId, role.id);

    // Fetch updated user with roles
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Transform response
    const transformedUser = {
      id: updatedUser!.id,
      email: updatedUser!.email,
      name: updatedUser!.name,
      image: updatedUser!.image,
      createdAt: updatedUser!.createdAt,
      updatedAt: updatedUser!.updatedAt,
      roles: updatedUser!.userRoles.map((ur: any) => ({
        id: ur.role.id,
        name: ur.role.name,
      })),
    };

    return NextResponse.json(transformedUser);
  } catch (error) {
    console.error('Error removing role from user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
