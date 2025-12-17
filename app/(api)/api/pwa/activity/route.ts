import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/src/providers/auth/server';
import { updateRepository } from '@/src/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/pwa/activity
 * Fetch recent public-facing updates for PWA users
 * Excludes admin-only update types (ANNOUNCEMENT)
 * Requires: Authentication
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Fetch published updates, excluding admin-only types
    const updates = await updateRepository.findMany({
      where: {
        status: 'PUBLISHED',
        // Exclude ANNOUNCEMENT - these are admin-only
        type: {
          in: ['CASE_STUDY', 'DISCUSSION', 'EVENT', 'NEWS'],
        },
        publishedAt: {
          lte: new Date(), // Only show updates that have been published
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Transform updates for response
    const transformedUpdates = updates.map((update: any) => ({
      id: update.id,
      title: update.title,
      description: update.description,
      content: update.content,
      type: update.type,
      featured: update.featured,
      tags: update.tags || [],
      publishedAt: update.publishedAt?.toISOString() || update.createdAt.toISOString(),
      author: {
        name: update.author.name || update.author.email,
      },
      linkHref: update.linkHref,
      linkText: update.linkText,
    }));

    return NextResponse.json({
      updates: transformedUpdates,
      count: transformedUpdates.length,
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
