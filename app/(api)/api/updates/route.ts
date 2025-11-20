import { NextRequest, NextResponse } from 'next/server';
import { updateRepository, permissionRepository } from '@/src/lib/prisma';
import { UpdateType, UpdateStatus } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/providers/auth/config';
import { Resources, Actions } from '@/src/lib/permissions/permissions';

export async function GET(request: NextRequest) {
  try {
    // Public endpoint - no authentication required
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const type = searchParams.get('type') as UpdateType | null;
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search');
    const includeAuthor = searchParams.get('includeAuthor') === 'true';
    
    let updates;
    
    if (featured) {
      // Get featured updates for homepage/PWA
      updates = await updateRepository.getFeatured(limit);
    } else if (search) {
      // Search updates
      updates = await updateRepository.search(search, includeAuthor);
    } else if (type) {
      // Filter by type
      updates = await updateRepository.findByType(type, includeAuthor);
    } else {
      // Get published updates with pagination
      updates = await updateRepository.findPublished({
        take: limit,
        skip: offset,
        include: includeAuthor ? { author: true } : undefined,
      });
    }
    
    return NextResponse.json({
      success: true,
      data: updates,
      pagination: {
        limit,
        offset,
        total: await updateRepository.count({
          status: UpdateStatus.PUBLISHED,
          publishedAt: { lte: new Date() }
        })
      }
    });
    
  } catch (error) {
    console.error('Failed to fetch updates:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch updates',
        message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and permissions
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'You must be signed in to create updates'
        },
        { status: 401 }
      );
    }
    
    const userId = (session.user as any).id;
    
    // Check if user has permission to create updates
    const canCreate = await permissionRepository.can(userId, Resources.UPDATES, Actions.CREATE);
    
    if (!canCreate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden',
          message: 'You do not have permission to create updates'
        },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.description || !body.type) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Title, description, and type are required'
        },
        { status: 400 }
      );
    }
    
    // Create the update
    const update = await updateRepository.create({
      title: body.title,
      description: body.description,
      content: body.content || null,
      type: body.type as UpdateType,
      status: body.status || UpdateStatus.DRAFT,
      linkHref: body.linkHref || null,
      linkText: body.linkText || null,
      imageUrl: body.imageUrl || null,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
      authorId: userId,
    });
    
    return NextResponse.json({
      success: true,
      data: update,
      message: 'Update created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Failed to create update:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create update',
        message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error'
      },
      { status: 500 }
    );
  }
}