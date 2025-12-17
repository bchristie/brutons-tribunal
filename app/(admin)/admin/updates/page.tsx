'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { UpdateType, UpdateStatus } from '@prisma/client';
import { UpdateList, PageHeaderContent } from '../../_components';
import type { UpdateListFilters } from '../../_components/UpdateList/UpdateList.types';
import type { PageHeaderConfig } from '../../_providers/PageHeaderProvider';
import { FaPlus } from 'react-icons/fa';

function UpdatesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialFilters: Partial<UpdateListFilters> = {
    search: searchParams.get('search') || '',
    types: searchParams.get('types')?.split(',').filter(Boolean) as UpdateType[] | undefined,
    statuses: searchParams.get('statuses')?.split(',').filter(Boolean) as UpdateStatus[] | undefined,
    sort: (searchParams.get('sort') as 'newest' | 'oldest' | 'title' | 'published') || 'newest',
    page: parseInt(searchParams.get('page') || '1'),
    limit: 20,
  };

  const handleFilterChange = (filters: UpdateListFilters) => {
    const params = new URLSearchParams();
    
    if (filters.search) {
      params.set('search', filters.search);
    }
    
    if (filters.types && filters.types.length > 0) {
      params.set('types', filters.types.join(','));
    }
    
    if (filters.statuses && filters.statuses.length > 0) {
      params.set('statuses', filters.statuses.join(','));
    }
    
    if (filters.sort && filters.sort !== 'newest') {
      params.set('sort', filters.sort);
    }
    
    if (filters.page && filters.page > 1) {
      params.set('page', filters.page.toString());
    }
    
    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : '/admin/updates');
  };

  const handleCreateUpdate = () => {
    const params = new URLSearchParams();
    if (initialFilters.search) params.set('search', initialFilters.search);
    if (initialFilters.types?.length) params.set('types', initialFilters.types.join(','));
    if (initialFilters.statuses?.length) params.set('statuses', initialFilters.statuses.join(','));
    if (initialFilters.sort && initialFilters.sort !== 'newest') params.set('sort', initialFilters.sort);
    if (initialFilters.page && initialFilters.page > 1) params.set('page', initialFilters.page.toString());
    const returnUrl = `/admin/updates${params.toString() ? `?${params.toString()}` : ''}`;
    
    router.push(`/admin/updates/new?returnUrl=${encodeURIComponent(returnUrl)}`);
  };

  const pageHeaderConfig: PageHeaderConfig = {
    title: 'Updates Management',
    subtitle: 'Manage announcements, news, events, and content updates',
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Updates' },
    ],
    mobileTitle: 'Updates',
    actions: [
      {
        label: 'Create Update',
        mobileLabel: 'New',
        onClick: handleCreateUpdate,
        icon: <FaPlus />,
        variant: 'primary',
      },
    ],
  };

  return (
    <PageHeaderContent config={pageHeaderConfig}>
      <UpdateList 
        initialFilters={initialFilters}
        onFilterChange={handleFilterChange}
      />
    </PageHeaderContent>
  );
}

export default function UpdatesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <UpdatesPageContent />
    </Suspense>
  );
}
