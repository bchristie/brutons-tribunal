'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserList, Breadcrumb } from '../../_components';
import type { UserListFilters } from '../../_components/UserList/UserList.types';
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
    
    // Update URL
    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : '/admin/users');
  };

  const handleCreateUser = () => {
    router.push('/admin/users/new');
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <Breadcrumb
          items={[
            { label: 'Admin', href: '/admin' },
            { label: 'User Management' },
          ]}
          mobileTitle="Users"
        />
        <button
          onClick={handleCreateUser}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <FaPlus />
          <span className="hidden sm:inline">Create User</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>
      
      <div className="mb-6 hidden md:block">
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
