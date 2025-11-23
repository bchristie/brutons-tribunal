import type { User } from '../../_providers/AdminApiProvider';

export interface UserListProps {
  className?: string;
}

export interface UserListItemProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}
