import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/src/providers/auth/server';
import { Roles } from '@/src/lib/permissions/permissions';
import { prisma, permissionRepository, userRepository } from '@/src/lib/prisma';
import { AuditLogRepository } from '@/src/lib/prisma/AuditLogRepository';
import { isValidUSPhoneNumber, normalizePhoneNumber } from '@/src/lib/utils/phone';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/users
 * Fetch all users with their roles
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

    // Get query parameters for filtering/pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch users with roles
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
      }),
      prisma.user.count({ where }),
    ]);

    // Transform users to include roles array
    const transformedUsers = users.map((user: any) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: user.userRoles.map((ur: any) => ({
        id: ur.role.id,
        name: ur.role.name,
      })),
    }));

    return NextResponse.json({
      users: transformedUsers,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users
 * Create a new user
 * Requires: ADMIN role
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { email, name, image, phone } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate and normalize phone if provided (US format)
    let normalizedPhone: string | null = null;
    if (phone) {
      if (!isValidUSPhoneNumber(phone)) {
        return NextResponse.json(
          { error: 'Invalid phone number format. Please use a valid US phone number.' },
          { status: 400 }
        );
      }
      normalizedPhone = normalizePhoneNumber(phone);
    }

    // Check if email already exists
    const existingUser = await userRepository.findByEmail(email, false);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        name: name || null,
        image: image || null,
        phone: normalizedPhone,
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

    // Create audit log entry
    try {
      const auditLogRepository = new AuditLogRepository(prisma);
      await auditLogRepository.logUserCreated(
        newUser.id,
        user.id,
        {
          email: newUser.email,
          name: newUser.name || undefined,
        }
      );
    } catch (auditError) {
      // Log but don't fail the user creation if audit fails
      console.error('Failed to create audit log:', auditError);
    }

    // Transform response
    const transformedUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      image: newUser.image,
      phone: newUser.phone,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
      roles: newUser.userRoles.map((ur: any) => ({
        id: ur.role.id,
        name: ur.role.name,
      })),
    };

    return NextResponse.json(transformedUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
