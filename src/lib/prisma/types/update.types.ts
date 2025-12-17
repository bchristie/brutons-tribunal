import type { UpdateType, UpdateStatus } from '@prisma/client';

// Types for Update repository operations
export interface UpdateCreateInput {
  title: string;
  description: string;
  excerpt?: string;
  content?: string | null;
  type: UpdateType;
  status?: UpdateStatus;
  featured?: boolean;
  tags?: string[];
  eventDate?: Date | null;
  expiresAt?: Date | null;
  linkHref?: string | null;
  linkText?: string | null;
  imageUrl?: string | null;
  publishedAt?: Date | null;
  authorId: string;
}

export interface UpdateUpdateInput {
  title?: string;
  description?: string;
  excerpt?: string;
  content?: string | null;
  type?: UpdateType;
  status?: UpdateStatus;
  featured?: boolean;
  tags?: string[];
  eventDate?: Date | null;
  expiresAt?: Date | null;
  linkHref?: string | null;
  linkText?: string | null;
  imageUrl?: string | null;
  publishedAt?: Date | null;
  authorId?: string;
}

export interface UpdateQueryOptions {
  where?: {
    id?: string;
    authorId?: string;
    type?: UpdateType;
    status?: UpdateStatus;
    title?: {
      contains?: string;
      mode?: 'insensitive';
    };
    description?: {
      contains?: string;
      mode?: 'insensitive';
    };
    publishedAt?: {
      lte?: Date;
      gte?: Date;
    };
  };
  orderBy?: {
    createdAt?: 'asc' | 'desc';
    updatedAt?: 'asc' | 'desc';
    publishedAt?: 'asc' | 'desc';
    title?: 'asc' | 'desc';
  };
  skip?: number;
  take?: number;
  include?: {
    author?: boolean;
  };
}

// Update type definition (matches Prisma schema)
export interface Update {
  id: string;
  title: string;
  description: string;
  content: string | null;
  type: UpdateType;
  status: UpdateStatus;
  featured: boolean;
  tags: string[];
  eventDate: Date | null;
  expiresAt: Date | null;
  linkHref: string | null;
  linkText: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  authorId: string;
}

// Update with author included
export interface UpdateWithAuthor extends Update {
  author: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    userRoles?: Array<{
      role: {
        name: string;
      };
    }>;
  };
}

// Re-export enums for convenience
export { UpdateType, UpdateStatus };