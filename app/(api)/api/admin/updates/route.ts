import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/src/providers/auth/server';
import { Roles } from '@/src/lib/permissions/permissions';
import { prisma, permissionRepository, updateRepository } from '@/src/lib/prisma';
import { AuditLogRepository } from '@/src/lib/prisma/AuditLogRepository';
import { UpdateType, UpdateStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/updates
 * Fetch all updates with filtering and pagination
 * Requires: ADMIN role
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    const isAdmin = await permissionRepository.hasRole(user.id, Roles.ADMIN);

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin role required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const types = searchParams.get('types')?.split(',').filter(Boolean) || [];
    const statuses = searchParams.get('statuses')?.split(',').filter(Boolean) || [];
    const sort = searchParams.get('sort') || 'newest';
    
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (types.length > 0) {
      where.type = { in: types as UpdateType[] };
    }

    if (statuses.length > 0) {
      where.status = { in: statuses as UpdateStatus[] };
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'oldest') {
      orderBy = { createdAt: 'asc' };
    } else if (sort === 'title') {
      orderBy = { title: 'asc' };
    } else if (sort === 'published') {
      // Sort by publishedAt desc, but NULL values (unpublished) should appear first
      orderBy = [
        { publishedAt: { sort: 'desc', nulls: 'first' } },
      ];
    }

    // Fetch updates with author
    const [updates, totalCount] = await Promise.all([
      updateRepository.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      updateRepository.count(where),
    ]);

    return NextResponse.json({
      updates,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching updates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/updates
 * Create a new update
 * Requires: ADMIN role
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    const isAdmin = await permissionRepository.hasRole(user.id, Roles.ADMIN);

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin role required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      content,
      type,
      status = 'DRAFT',
      linkHref,
      linkText,
      imageUrl,
      featured = false,
      eventDate,
      expiresAt,
      tags = [],
      publishedAt,
    } = body;

    // Validate required fields
    if (!title || !description || !type) {
      return NextResponse.json(
        { error: 'Title, description, and type are required' },
        { status: 400 }
      );
    }

    // Validate type
    if (!Object.values(UpdateType).includes(type)) {
      return NextResponse.json(
        { error: 'Invalid update type' },
        { status: 400 }
      );
    }

    // Create update
    const newUpdate = await updateRepository.create({
      title,
      description,
      content: content || null,
      type,
      status,
      linkHref: linkHref || null,
      linkText: linkText || null,
      imageUrl: imageUrl || null,
      featured,
      eventDate: eventDate ? new Date(eventDate) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      tags,
      publishedAt: publishedAt ? new Date(publishedAt) : (status === 'PUBLISHED' ? new Date() : null),
      authorId: user.id,
    });

    // Create audit log
    try {
      const auditLogRepository = new AuditLogRepository(prisma);
      await auditLogRepository.logUpdateCreated(
        newUpdate.id,
        user.id,
        {
          title: newUpdate.title,
          type: newUpdate.type,
          status: newUpdate.status,
        }
      );

      // Log published event if status is PUBLISHED
      if (status === 'PUBLISHED') {
        await auditLogRepository.logUpdatePublished(
          newUpdate.id,
          user.id,
          {
            title: newUpdate.title,
            type: newUpdate.type,
            publishedAt: newUpdate.publishedAt?.toISOString() || new Date().toISOString(),
          }
        );
      }
    } catch (auditError) {
      console.error('Failed to create audit log:', auditError);
    }

    // Fetch the created update with author
    const createdUpdate = await updateRepository.findByIdWithAuthor(newUpdate.id);

    return NextResponse.json(createdUpdate, { status: 201 });
  } catch (error) {
    console.error('Error creating update:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
