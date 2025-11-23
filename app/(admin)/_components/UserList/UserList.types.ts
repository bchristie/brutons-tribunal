import type { User } from '../../_providers/AdminApiProvider';

export interface UserListFilters {
  search: string;
  page: number;
  limit: number;
}

export interface UserListProps {
  className?: string;
  initialFilters?: Partial<UserListFilters>;
  onFilterChange?: (filters: UserListFilters) => void;
}

export interface UserListItemProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}
