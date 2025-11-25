import type { User } from '../../_providers/AdminApiProvider';

export interface UserDetailProps {
  userId?: string; // Optional - if not provided, create mode
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

export interface UserFormState {
  user: User | null;
  formData: UserFormData;
  roleChanges: RoleChange[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  isDirty: boolean;
  isCreateMode: boolean;
}
