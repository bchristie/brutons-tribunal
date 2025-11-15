import { BaseRepository } from './BaseRepository';
import { prisma } from './prisma';
import { UpdateType, UpdateStatus } from '@prisma/client';
import type { 
  Update, 
  UpdateWithAuthor, 
  UpdateCreateInput, 
  UpdateUpdateInput, 
  UpdateQueryOptions
} from './types/update.types';

/**
 * Update Repository class extending BaseRepository
 * Provides update-specific operations in addition to base CRUD
 */
export class UpdateRepository extends BaseRepository<Update, UpdateCreateInput, UpdateUpdateInput> {
  constructor() {
    super(prisma, 'Update');
  }

  /**
   * Get the Prisma update delegate
   */
  protected getDelegate() {
    return this.prisma.update;
  }

  /**
   * Find published updates only (default public view)
   */
  async findPublished(options?: {
    type?: UpdateType;
    take?: number;
    skip?: number;
    orderBy?: UpdateQueryOptions['orderBy'];
    include?: UpdateQueryOptions['include'];
  }): Promise<Update[] | UpdateWithAuthor[]> {
    return await this.getDelegate().findMany({
      where: {
        status: UpdateStatus.PUBLISHED,
        publishedAt: { lte: new Date() }, // Only show if published date has passed
        ...(options?.type && { type: options.type }),
      },
      orderBy: options?.orderBy || { publishedAt: 'desc' },
      take: options?.take,
      skip: options?.skip,
      include: options?.include,
    });
  }

  /**
   * Find updates by type
   */
  async findByType(type: UpdateType, includeAuthor: boolean = false): Promise<Update[] | UpdateWithAuthor[]> {
    return await this.getDelegate().findMany({
      where: { 
        type,
        status: UpdateStatus.PUBLISHED,
        publishedAt: { lte: new Date() }
      },
      orderBy: { publishedAt: 'desc' },
      include: includeAuthor ? { author: true } : undefined,
    });
  }

  /**
   * Find updates by author
   */
  async findByAuthor(authorId: string, includeAuthor: boolean = false): Promise<Update[] | UpdateWithAuthor[]> {
    return await this.getDelegate().findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
      include: includeAuthor ? { author: true } : undefined,
    });
  }

  /**
   * Search updates by title or description (case-insensitive)
   */
  async search(searchTerm: string, includeAuthor: boolean = false): Promise<Update[] | UpdateWithAuthor[]> {
    return await this.getDelegate().findMany({
      where: {
        status: UpdateStatus.PUBLISHED,
        publishedAt: { lte: new Date() },
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: { publishedAt: 'desc' },
      include: includeAuthor ? { author: true } : undefined,
    });
  }

  /**
   * Find recent updates (published within last N days)
   */
  async findRecent(days: number = 30, take: number = 5): Promise<UpdateWithAuthor[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return await this.getDelegate().findMany({
      where: {
        status: UpdateStatus.PUBLISHED,
        publishedAt: { 
          gte: cutoffDate,
          lte: new Date()
        },
      },
      orderBy: { publishedAt: 'desc' },
      take,
      include: { author: true },
    });
  }

  /**
   * Find updates with advanced filtering
   */
  async findWithOptions(options: UpdateQueryOptions): Promise<Update[] | UpdateWithAuthor[]> {
    return await this.getDelegate().findMany({
      where: options.where,
      orderBy: options.orderBy || { publishedAt: 'desc' },
      skip: options.skip,
      take: options.take,
      include: options.include,
    });
  }

  /**
   * Get featured updates (can be used for homepage)
   */
  async getFeatured(limit: number = 3): Promise<UpdateWithAuthor[]> {
    // For now, just return latest published updates
    // In the future, you could add a 'featured' field to the schema
    return await this.getDelegate().findMany({
      where: {
        status: UpdateStatus.PUBLISHED,
        publishedAt: { lte: new Date() },
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      include: { author: true },
    });
  }

  /**
   * Publish an update (set status to PUBLISHED and publishedAt to now)
   */
  async publish(id: string): Promise<Update> {
    return await this.update(id, {
      status: UpdateStatus.PUBLISHED,
      publishedAt: new Date(),
    });
  }

  /**
   * Archive an update
   */
  async archive(id: string): Promise<Update> {
    return await this.update(id, {
      status: UpdateStatus.ARCHIVED,
    });
  }

  /**
   * Get update statistics
   */
  async getStats(): Promise<{
    totalUpdates: number;
    updatesByType: Record<string, number>;
    updatesByStatus: Record<string, number>;
    recentUpdates: UpdateWithAuthor[];
  }> {
    const [totalUpdates, allUpdates, recentUpdates] = await Promise.all([
      this.count(),
      this.getDelegate().findMany({
        select: { type: true, status: true },
      }),
      this.getDelegate().findMany({
        where: {
          status: UpdateStatus.PUBLISHED,
          publishedAt: { lte: new Date() }
        },
        orderBy: { publishedAt: 'desc' },
        take: 5,
        include: { author: true },
      }),
    ]);

    // Count updates by type
    const updatesByType: Record<string, number> = {};
    const updatesByStatus: Record<string, number> = {};

    allUpdates.forEach((update: { type: string; status: string }) => {
      updatesByType[update.type] = (updatesByType[update.type] || 0) + 1;
      updatesByStatus[update.status] = (updatesByStatus[update.status] || 0) + 1;
    });

    return {
      totalUpdates,
      updatesByType,
      updatesByStatus,
      recentUpdates,
    };
  }

  /**
   * Schedule an update for future publication
   */
  async schedule(id: string, publishedAt: Date): Promise<Update> {
    return await this.update(id, {
      status: UpdateStatus.PUBLISHED,
      publishedAt,
    });
  }

  /**
   * Get updates by date range
   */
  async findByDateRange(
    startDate: Date, 
    endDate: Date, 
    includeAuthor: boolean = false
  ): Promise<Update[] | UpdateWithAuthor[]> {
    return await this.getDelegate().findMany({
      where: {
        status: UpdateStatus.PUBLISHED,
        publishedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { publishedAt: 'desc' },
      include: includeAuthor ? { author: true } : undefined,
    });
  }
}

// Export a singleton instance
export const updateRepository = new UpdateRepository();