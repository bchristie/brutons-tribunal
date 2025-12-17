/**
 * Updates API calls
 */

import { UpdateType, UpdateStatus } from '@prisma/client';

export interface UpdateAuthor {
  id: string;
  name: string | null;
  email: string;
}

export interface Update {
  id: string;
  title: string;
  description: string;
  excerpt: string;
  content: string | null;
  type: UpdateType;
  status: UpdateStatus;
  linkHref: string | null;
  linkText: string | null;
  imageUrl: string | null;
  featured: boolean;
  eventDate: string | null;
  expiresAt: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  authorId: string;
  author?: UpdateAuthor;
}

export interface UpdatesListResponse {
  updates: Update[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FetchUpdatesParams {
  page?: number;
  limit?: number;
  search?: string;
  types?: UpdateType[];
  statuses?: UpdateStatus[];
  sort?: 'newest' | 'oldest' | 'title' | 'published';
}

export interface CreateUpdateParams {
  title: string;
  description: string;
  excerpt?: string;
  content?: string;
  type: UpdateType;
  status?: UpdateStatus;
  linkHref?: string;
  linkText?: string;
  imageUrl?: string;
  featured?: boolean;
  eventDate?: string;
  expiresAt?: string;
  tags?: string[];
  publishedAt?: string;
}

export interface UpdateUpdateParams {
  title?: string;
  description?: string;
  excerpt?: string;
  content?: string;
  type?: UpdateType;
  status?: UpdateStatus;
  linkHref?: string;
  linkText?: string;
  imageUrl?: string;
  featured?: boolean;
  eventDate?: string;
  expiresAt?: string;
  tags?: string[];
  publishedAt?: string;
  updatedAt: string; // Required for concurrency control
}

/**
 * Fetch list of updates with filtering and pagination
 */
export async function fetchUpdates(params?: FetchUpdatesParams): Promise<UpdatesListResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.search) searchParams.set('search', params.search);
  if (params?.types && params.types.length > 0) searchParams.set('types', params.types.join(','));
  if (params?.statuses && params.statuses.length > 0) searchParams.set('statuses', params.statuses.join(','));
  if (params?.sort) searchParams.set('sort', params.sort);

  const url = `/api/admin/updates?${searchParams.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch updates');
  }

  return response.json();
}

/**
 * Fetch a single update by ID
 */
export async function fetchUpdate(id: string): Promise<Update> {
  const response = await fetch(`/api/admin/updates/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch update');
  }

  return response.json();
}

/**
 * Create a new update
 */
export async function createUpdate(params: CreateUpdateParams): Promise<Update> {
  const response = await fetch('/api/admin/updates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create update');
  }

  return response.json();
}

/**
 * Update an existing update
 */
export async function updateUpdate(id: string, params: UpdateUpdateParams): Promise<Update> {
  const response = await fetch(`/api/admin/updates/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update update');
  }

  return response.json();
}

/**
 * Delete an update
 */
export async function deleteUpdate(id: string, updatedAt: string): Promise<void> {
  const response = await fetch(`/api/admin/updates/${id}?updatedAt=${encodeURIComponent(updatedAt)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete update');
  }
}
