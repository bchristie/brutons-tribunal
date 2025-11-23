import type { User } from '../../_providers/AdminApiProvider';

export interface UserDetailProps {
  userId: string;
  className?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  image: string;
}

export interface RoleChange {
  roleId: string;
  roleName: string;
  action: 'add' | 'remove';
}
