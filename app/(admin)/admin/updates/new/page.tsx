'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAdminApi, useNotifications } from '../../../_providers';
import { UpdateForm, PageHeaderContent } from '../../../_components';
import type { UpdateFormData } from '../../../_components/UpdateForm';
import type { PageHeaderConfig } from '../../../_providers/PageHeaderProvider';

export default function NewUpdatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createUpdate } = useAdminApi();
  const { success, error } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const returnUrl = searchParams.get('returnUrl') || '/admin/updates';

  const handleSubmit = async (data: UpdateFormData) => {
    setIsSubmitting(true);

    try {
      const update = await createUpdate({
        title: data.title,
        description: data.description,
        content: data.content,
        type: data.type,
        status: data.status,
        featured: data.featured,
        tags: data.tags,
        eventDate: data.eventDate || undefined,
        expiresAt: data.expiresAt || undefined,
      });

      success('Update created successfully');
      router.push(returnUrl);
    } catch (err: any) {
      error(err?.message || 'Failed to create update');
      console.error('Failed to create update:', err);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(returnUrl);
  };

  const pageHeaderConfig: PageHeaderConfig = {
    title: 'Create Update',
    subtitle: 'Create a new update, announcement, event, or content',
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Updates', href: '/admin/updates' },
      { label: 'New Update' },
    ],
    mobileTitle: 'New Update',
  };

  return (
    <PageHeaderContent config={pageHeaderConfig}>
      <UpdateForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </PageHeaderContent>
  );
}
