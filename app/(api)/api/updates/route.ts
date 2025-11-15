import { NextRequest, NextResponse } from 'next/server';
import { updateRepository } from '@/src/lib/prisma';
import { UpdateType, UpdateStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
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
  // TODO: Implement create update endpoint
  // For now, return method not allowed
  return NextResponse.json(
    { success: false, error: 'Method not implemented yet' },
    { status: 501 }
  );
}