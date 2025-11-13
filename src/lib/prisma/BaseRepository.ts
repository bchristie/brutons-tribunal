import { PrismaClient } from '@prisma/client';

/**
 * Base Repository class that provides common CRUD operations
 * All model-specific repositories should extend this class
 */
export abstract class BaseRepository<T, TCreate, TUpdate> {
  protected prisma: PrismaClient;
  protected modelName: string;

  constructor(prisma: PrismaClient, modelName: string) {
    this.prisma = prisma;
    this.modelName = modelName;
  }

  /**
   * Get the Prisma delegate for this model
   * This must be implemented by each repository to return the correct model delegate
   */
  protected abstract getDelegate(): any;

  /**
   * Create a new record
   */
  async create(data: TCreate): Promise<T> {
    return await this.getDelegate().create({
      data,
    });
  }

  /**
   * Find a record by ID
   */
  async findById(id: string): Promise<T | null> {
    return await this.getDelegate().findUnique({
      where: { id },
    });
  }

  /**
   * Find many records with optional filtering, sorting, and pagination
   */
  async findMany(options?: {
    where?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
    include?: any;
  }): Promise<T[]> {
    return await this.getDelegate().findMany(options);
  }

  /**
   * Find first record matching criteria
   */
  async findFirst(options?: {
    where?: any;
    orderBy?: any;
    include?: any;
  }): Promise<T | null> {
    return await this.getDelegate().findFirst(options);
  }

  /**
   * Update a record by ID
   */
  async update(id: string, data: TUpdate): Promise<T> {
    return await this.getDelegate().update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a record by ID
   */
  async delete(id: string): Promise<T> {
    return await this.getDelegate().delete({
      where: { id },
    });
  }

  /**
   * Count records matching criteria
   */
  async count(where?: any): Promise<number> {
    return await this.getDelegate().count({
      where,
    });
  }

  /**
   * Check if a record exists
   */
  async exists(id: string): Promise<boolean> {
    const count = await this.getDelegate().count({
      where: { id },
    });
    return count > 0;
  }

  /**
   * Update many records matching criteria
   */
  async updateMany(where: any, data: Partial<TUpdate>): Promise<{ count: number }> {
    return await this.getDelegate().updateMany({
      where,
      data,
    });
  }

  /**
   * Delete many records matching criteria
   */
  async deleteMany(where: any): Promise<{ count: number }> {
    return await this.getDelegate().deleteMany({
      where,
    });
  }

  /**
   * Upsert a record (create if not exists, update if exists)
   */
  async upsert(where: any, create: TCreate, update: TUpdate): Promise<T> {
    return await this.getDelegate().upsert({
      where,
      create,
      update,
    });
  }
}