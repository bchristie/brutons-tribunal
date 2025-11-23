import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/src/providers/auth/server';
import { Roles } from '@/src/lib/permissions/permissions';
import { prisma, permissionRepository } from '@/src/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/users/[id]
 * Fetch a single user by ID
 * Requires: ADMIN role OR current user
 */
export async function GET(
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

    const userId = params.id;
    const isAdmin = await permissionRepository.hasRole(currentUser.id, Roles.ADMIN);
    const isSelf = currentUser.id === userId;

    // Must be admin OR viewing own profile
    if (!isAdmin && !isSelf) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    // Fetch user with roles
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Transform response
    const transformedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: user.userRoles.map((ur: any) => ({
        id: ur.role.id,
        name: ur.role.name,
        description: ur.role.description,
      })),
    };

    return NextResponse.json(transformedUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/users/[id]
 * Update a user's information
 * Requires: ADMIN role OR current user (for own profile)
 * Includes optimistic concurrency control via updatedAt
 */
export async function PATCH(
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

    const userId = params.id;
    const isAdmin = await permissionRepository.hasRole(currentUser.id, Roles.ADMIN);
    const isSelf = currentUser.id === userId;

    // Must be admin OR updating own profile
    if (!isAdmin && !isSelf) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, image, updatedAt: clientUpdatedAt } = body;

    // Validate concurrency control
    if (!clientUpdatedAt) {
      return NextResponse.json(
        { error: 'updatedAt is required for concurrency control' },
        { status: 400 }
      );
    }

    // Fetch current user state
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if updatedAt matches (optimistic concurrency control)
    const clientTimestamp = new Date(clientUpdatedAt).getTime();
    const dbTimestamp = new Date(existingUser.updatedAt).getTime();

    if (clientTimestamp !== dbTimestamp) {
      return NextResponse.json(
        {
          error: 'Conflict - User has been modified by another process',
          currentData: {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            image: existingUser.image,
            updatedAt: existingUser.updatedAt,
          },
        },
        { status: 409 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name !== undefined ? name : undefined,
        image: image !== undefined ? image : undefined,
      },
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
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      image: updatedUser.image,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      roles: updatedUser.userRoles.map((ur: any) => ({
        id: ur.role.id,
        name: ur.role.name,
      })),
    };

    return NextResponse.json(transformedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete a user
 * Requires: ADMIN role
 * Includes optimistic concurrency control via updatedAt
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

    const userId = params.id;
    const isAdmin = await permissionRepository.hasRole(currentUser.id, Roles.ADMIN);

    // Must be admin (users cannot delete themselves)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin role required' },
        { status: 403 }
      );
    }

    // Prevent self-deletion
    if (currentUser.id === userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Get updatedAt from query params or body
    const { searchParams } = new URL(request.url);
    const clientUpdatedAt = searchParams.get('updatedAt');

    if (!clientUpdatedAt) {
      return NextResponse.json(
        { error: 'updatedAt is required for concurrency control' },
        { status: 400 }
      );
    }

    // Fetch current user state
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if updatedAt matches (optimistic concurrency control)
    const clientTimestamp = new Date(clientUpdatedAt).getTime();
    const dbTimestamp = new Date(existingUser.updatedAt).getTime();

    if (clientTimestamp !== dbTimestamp) {
      return NextResponse.json(
        {
          error: 'Conflict - User has been modified by another process',
          currentData: {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            image: existingUser.image,
            updatedAt: existingUser.updatedAt,
          },
        },
        { status: 409 }
      );
    }

    // Delete user (cascade will remove related records)
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
