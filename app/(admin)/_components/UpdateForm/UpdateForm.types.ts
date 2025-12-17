import type { UpdateType, UpdateStatus } from '@prisma/client';
import type { Update } from '../../_providers/AdminApiProvider';

export interface UpdateFormData {
  title: string;
  description: string;
  content: string;
  type: UpdateType;
  status: UpdateStatus;
  featured: boolean;
  tags: string[];
  eventDate?: string | null;
  expiresAt?: string | null;
}

export interface UpdateFormProps {
  mode: 'create' | 'edit';
  initialData?: Update;
  onSubmit: (data: UpdateFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}
