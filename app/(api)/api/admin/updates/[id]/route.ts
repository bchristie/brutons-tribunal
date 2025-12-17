import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/src/providers/auth/server';
import { Roles } from '@/src/lib/permissions/permissions';
import { prisma, permissionRepository, updateRepository } from '@/src/lib/prisma';
import { AuditLogRepository } from '@/src/lib/prisma/AuditLogRepository';
import { UpdateStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/updates/[id]
 * Fetch a single update by ID
 * Requires: ADMIN role
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const update = await updateRepository.findByIdWithAuthor(id);

    if (!update) {
      return NextResponse.json(
        { error: 'Update not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(update);
  } catch (error) {
    console.error('Error fetching update:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/updates/[id]
 * Update an existing update
 * Requires: ADMIN role
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const {
      title,
      description,
      content,
      type,
      status,
      linkHref,
      linkText,
      imageUrl,
      featured,
      eventDate,
      expiresAt,
      tags,
      publishedAt,
      updatedAt: clientUpdatedAt,
    } = body;

    // Validate concurrency control
    if (!clientUpdatedAt) {
      return NextResponse.json(
        { error: 'updatedAt is required for concurrency control' },
        { status: 400 }
      );
    }

    // Fetch current update state
    const existingUpdate = await updateRepository.findById(id);

    if (!existingUpdate) {
      return NextResponse.json(
        { error: 'Update not found' },
        { status: 404 }
      );
    }

    // Check if updatedAt matches (optimistic concurrency control)
    const clientTimestamp = new Date(clientUpdatedAt).getTime();
    const dbTimestamp = new Date(existingUpdate.updatedAt).getTime();

    if (clientTimestamp !== dbTimestamp) {
      return NextResponse.json(
        {
          error: 'Conflict - Update has been modified by another process',
          currentData: existingUpdate,
        },
        { status: 409 }
      );
    }

    // Track changes for audit log
    const changes: any = {};
    if (title !== undefined && title !== existingUpdate.title) changes.title = { from: existingUpdate.title, to: title };
    if (description !== undefined && description !== existingUpdate.description) changes.description = { from: existingUpdate.description, to: description };
    if (type !== undefined && type !== existingUpdate.type) changes.type = { from: existingUpdate.type, to: type };
    if (status !== undefined && status !== existingUpdate.status) changes.status = { from: existingUpdate.status, to: status };
    if (featured !== undefined && featured !== (existingUpdate as any).featured) changes.featured = { from: (existingUpdate as any).featured, to: featured };

    // Check if status changed to PUBLISHED
    const wasPublished = existingUpdate.status === 'PUBLISHED';
    const isNowPublished = status === 'PUBLISHED';
    const statusChangedToPublished = !wasPublished && isNowPublished;

    // Build update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;
    if (type !== undefined) updateData.type = type;
    if (status !== undefined) updateData.status = status;
    if (linkHref !== undefined) updateData.linkHref = linkHref;
    if (linkText !== undefined) updateData.linkText = linkText;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (featured !== undefined) updateData.featured = featured;
    if (eventDate !== undefined) updateData.eventDate = eventDate ? new Date(eventDate) : null;
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
    if (tags !== undefined) updateData.tags = tags;
    if (publishedAt !== undefined) updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;

    // Auto-set publishedAt if status changed to PUBLISHED and not explicitly set
    if (statusChangedToPublished && publishedAt === undefined) {
      updateData.publishedAt = new Date();
    }

    // Update the record
    const updatedUpdate = await updateRepository.update(id, updateData);

    // Create audit logs
    try {
      const auditLogRepository = new AuditLogRepository(prisma);
      
      if (Object.keys(changes).length > 0) {
        await auditLogRepository.logUpdateUpdated(
          id,
          user.id,
          {
            title: updatedUpdate.title,
            changes,
          }
        );
      }

      // Log published event if status changed to PUBLISHED
      if (statusChangedToPublished) {
        await auditLogRepository.logUpdatePublished(
          id,
          user.id,
          {
            title: updatedUpdate.title,
            type: updatedUpdate.type,
            publishedAt: updatedUpdate.publishedAt?.toISOString() || new Date().toISOString(),
          }
        );
      }
    } catch (auditError) {
      console.error('Failed to create audit log:', auditError);
    }

    // Fetch updated record with author
    const result = await updateRepository.findByIdWithAuthor(id);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating update:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/updates/[id]
 * Delete an update
 * Requires: ADMIN role
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const clientUpdatedAt = searchParams.get('updatedAt');

    if (!clientUpdatedAt) {
      return NextResponse.json(
        { error: 'updatedAt is required for concurrency control' },
        { status: 400 }
      );
    }

    // Fetch current update state
    const existingUpdate = await updateRepository.findById(id);

    if (!existingUpdate) {
      return NextResponse.json(
        { error: 'Update not found' },
        { status: 404 }
      );
    }

    // Check if updatedAt matches (optimistic concurrency control)
    const clientTimestamp = new Date(clientUpdatedAt).getTime();
    const dbTimestamp = new Date(existingUpdate.updatedAt).getTime();

    if (clientTimestamp !== dbTimestamp) {
      return NextResponse.json(
        {
          error: 'Conflict - Update has been modified by another process',
          currentData: existingUpdate,
        },
        { status: 409 }
      );
    }

    // Create audit log before deletion
    try {
      const auditLogRepository = new AuditLogRepository(prisma);
      await auditLogRepository.logUpdateDeleted(
        id,
        user.id,
        {
          title: existingUpdate.title,
          type: existingUpdate.type,
        }
      );
    } catch (auditError) {
      console.error('Failed to create audit log:', auditError);
    }

    // Delete the update
    await updateRepository.delete(id);

    return NextResponse.json(
      { message: 'Update deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting update:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
