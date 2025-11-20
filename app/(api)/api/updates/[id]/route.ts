import { NextRequest, NextResponse } from 'next/server';
import { updateRepository, permissionRepository } from '@/src/lib/prisma';
import { UpdateType, UpdateStatus } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/providers/auth/config';
import { Resources, Actions } from '@/src/lib/permissions/permissions';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication and permissions
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'You must be signed in to update updates'
        },
        { status: 401 }
      );
    }
    
    const userId = (session.user as any).id;
    
    // Check if user has permission to update updates
    const canUpdate = await permissionRepository.can(userId, Resources.UPDATES, Actions.UPDATE);
    
    if (!canUpdate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden',
          message: 'You do not have permission to update updates'
        },
        { status: 403 }
      );
    }
    
    const { id } = await params;
    const body = await request.json();
    
    // Check if update exists
    const existingUpdate = await updateRepository.findById(id);
    if (!existingUpdate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not found',
          message: 'Update not found'
        },
        { status: 404 }
      );
    }
    
    // Update the update
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.linkHref !== undefined) updateData.linkHref = body.linkHref;
    if (body.linkText !== undefined) updateData.linkText = body.linkText;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.publishedAt !== undefined) updateData.publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
    
    const updatedUpdate = await updateRepository.update(id, updateData);
    
    return NextResponse.json({
      success: true,
      data: updatedUpdate,
      message: 'Update updated successfully'
    });
    
  } catch (error) {
    console.error('Failed to update update:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update update',
        message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication and permissions
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'You must be signed in to delete updates'
        },
        { status: 401 }
      );
    }
    
    const userId = (session.user as any).id;
    
    // Check if user has permission to delete updates
    const canDelete = await permissionRepository.can(userId, Resources.UPDATES, Actions.DELETE);
    
    if (!canDelete) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden',
          message: 'You do not have permission to delete updates'
        },
        { status: 403 }
      );
    }
    
    const { id } = await params;
    
    // Check if update exists
    const existingUpdate = await updateRepository.findById(id);
    if (!existingUpdate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not found',
          message: 'Update not found'
        },
        { status: 404 }
      );
    }
    
    // Delete the update
    await updateRepository.delete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Update deleted successfully'
    });
    
  } catch (error) {
    console.error('Failed to delete update:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete update',
        message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error'
      },
      { status: 500 }
    );
  }
}
