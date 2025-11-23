'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserList } from '../../_components';
import type { UserListFilters } from '../../_components/UserList/UserList.types';

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
    
    // Update URL
    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : '/admin/users');
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          User Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage user accounts and permissions
        </p>
      </div>
      
      <UserList 
        initialFilters={initialFilters}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={
      <div className="p-4 md:p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    }>
      <UsersPageContent />
    </Suspense>
  );
}
