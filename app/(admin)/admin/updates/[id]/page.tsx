'use client';

import { use } from 'react';
import { useSearchParams } from 'next/navigation';
import { UpdateDetail, PageHeaderContent } from '../../../_components';
import type { PageHeaderConfig } from '../../../_providers/PageHeaderProvider';

export default function UpdateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/admin/updates';

  const pageHeaderConfig: PageHeaderConfig = {
    title: 'Edit Update',
    subtitle: 'Modify update details and content',
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Updates', href: returnUrl },
      { label: 'Edit' },
    ],
    mobileTitle: 'Edit Update',
  };

  return (
    <PageHeaderContent config={pageHeaderConfig}>
      <UpdateDetail
        updateId={resolvedParams.id}
        returnUrl={returnUrl}
      />
    </PageHeaderContent>
  );
}
