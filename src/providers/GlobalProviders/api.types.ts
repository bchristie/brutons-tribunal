import { UpdateType } from '@prisma/client';
import type { UpdateWithAuthor } from '@/src/lib/prisma/types/update.types';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    limit: number;
    offset: number;
    total: number;
  };
}

// Update API types
export interface GetUpdatesOptions {
  limit?: number;
  offset?: number;
  type?: UpdateType;
  featured?: boolean;
  search?: string;
  includeAuthor?: boolean;
}

export interface UpdatesResponse extends ApiResponse<UpdateWithAuthor[]> {
  pagination?: {
    limit: number;
    offset: number;
    total: number;
  };
}

// API functions interface
export interface ApiMethods {
  // Updates
  getUpdates: (options?: GetUpdatesOptions) => Promise<UpdatesResponse>;
  
  // Future CRUD operations can be added here
  // createUpdate: (data: UpdateCreateInput) => Promise<ApiResponse<Update>>;
  // updateUpdate: (id: string, data: UpdateUpdateInput) => Promise<ApiResponse<Update>>;
  // deleteUpdate: (id: string) => Promise<ApiResponse<void>>;
}

// API Context state
export interface ApiContextState {
  api: ApiMethods;
  isLoading: boolean;
  error: string | null;
}