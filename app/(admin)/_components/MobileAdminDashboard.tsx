'use client';

import Link from 'next/link';
import { useAuth } from '@/src/providers/AuthProvider';
import { UserAvatar } from '@/src/components';

/**
 * Mobile Admin Dashboard
 * Optimized for mobile devices with:
 * - Card-based layout
 * - Large touch targets
 * - Essential actions only
 * - Simplified navigation
 */
export function MobileAdminDashboard() {
  const { user } = useAuth();
  const userRoles = (user as any)?.roles || [];

  const adminActions = [
    {
      title: 'Users',
      description: 'Manage users',
      icon: '👥',
      href: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Roles',
      description: 'Manage roles',
      icon: '🎭',
      href: '/admin/roles',
      color: 'bg-purple-500'
    },
    {
      title: 'Updates',
      description: 'Content updates',
      icon: '📝',
      href: '/admin/updates',
      color: 'bg-green-500'
    },
    {
      title: 'Settings',
      description: 'System settings',
      icon: '⚙️',
      href: '/admin/settings',
      color: 'bg-gray-500'
    }
  ];

  return (
    <div className="min-h-screen p-4 pb-20">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Admin Panel
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mobile View
            </p>
          </div>
          <UserAvatar
            name={user?.name}
            email={user?.email}
            image={user?.image}
            roles={userRoles}
            size="md"
            showBadge={true}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Users</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Roles</div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="space-y-3 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {adminActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-2xl mb-2`}>
                {action.icon}
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                {action.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
          <div className="p-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white">
                  New user registered
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  2 hours ago
                </p>
              </div>
            </div>
          </div>
          <div className="p-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white">
                  Role permissions updated
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  5 hours ago
                </p>
              </div>
            </div>
          </div>
          <div className="p-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white">
                  Content published
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  1 day ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Site */}
      <div className="mt-6">
        <Link
          href="/"
          className="block w-full text-center py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          ← Back to Site
        </Link>
      </div>
    </div>
  );
}
