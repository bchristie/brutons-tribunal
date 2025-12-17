import type { UpdateType, UpdateStatus } from '@prisma/client';

export interface UpdateListFilters {
  search?: string;
  types?: UpdateType[];
  statuses?: UpdateStatus[];
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest' | 'title' | 'published';
}

export interface UpdateListProps {
  className?: string;
  initialFilters?: Partial<UpdateListFilters>;
  onFilterChange?: (filters: UpdateListFilters) => void;
}
