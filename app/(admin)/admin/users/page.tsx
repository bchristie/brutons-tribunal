'use client';

import { UserList } from '../../_components';

export default function UsersPage() {
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
      
      <UserList />
    </div>
  );
}
