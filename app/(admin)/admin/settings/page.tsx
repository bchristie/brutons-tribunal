'use client';

import { PageHeaderContent } from '../../_components';
import { FaGear } from 'react-icons/fa6';

/**
 * Admin Settings Page
 * Configuration and system settings for administrators
 */
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeaderContent 
        title="Settings"
        description="System configuration and preferences"
        icon={<FaGear />}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center py-12">
          <FaGear className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Settings Coming Soon
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            System configuration and preferences will be available here.
          </p>
        </div>
      </div>
    </div>
  );
}
