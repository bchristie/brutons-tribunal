'use client';

import { useMobileDetection } from '@/src/hooks/useMobileDetection';

export default function RolesPage() {
  const { isMobile } = useMobileDetection();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Roles & Permissions
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        {isMobile ? 'Mobile View' : 'Desktop View'}
      </p>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <p className="text-gray-600 dark:text-gray-400">
          Role and permission management interface coming soon...
        </p>
      </div>
    </div>
  );
}
