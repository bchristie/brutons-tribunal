'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserList, PageHeaderContent } from '../../_components';
import type { UserListFilters } from '../../_components/UserList/UserList.types';
import type { PageHeaderConfig } from '../../_providers/PageHeaderProvider';
import { FaPlus } from 'react-icons/fa';

function UsersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialFilters = {
    search: searchParams.get('search') || '',
    page: parseInt(searchParams.get('page') || '1'),
    limit: 20,
  };

  const handleFilterChange = (filters: UserListFilters) => {
    const params = new URLSearchParams();
    
    if (filters.search) {
      params.set('search', filters.search);
    }
    
    if (filters.page > 1) {
      params.set('page', filters.page.toString());
    }
    
    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : '/admin/users');
  };

  const handleCreateUser = () => {
    const params = new URLSearchParams();
    if (initialFilters.search) params.set('search', initialFilters.search);
    if (initialFilters.page && initialFilters.page > 1) params.set('page', initialFilters.page.toString());
    const returnUrl = `/admin/users${params.toString() ? `?${params.toString()}` : ''}`;
    
    router.push(`/admin/users/new?returnUrl=${encodeURIComponent(returnUrl)}`);
  };

  const pageHeaderConfig: PageHeaderConfig = {
    title: 'User Management',
    subtitle: 'Manage user accounts and permissions',
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'User Management' },
    ],
    mobileTitle: 'Users',
    actions: [
      {
        label: 'Create User',
        mobileLabel: 'New',
        onClick: handleCreateUser,
        icon: <FaPlus />,
        variant: 'primary',
      },
    ],
  };

  return (
    <PageHeaderContent config={pageHeaderConfig}>
      <UserList 
        initialFilters={initialFilters}
        onFilterChange={handleFilterChange}
      />
    </PageHeaderContent>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <UsersPageContent />
    </Suspense>
  );
}
