'use client';

import { useAuth } from '@/src/providers/AuthProvider';
import { UserAvatar } from '@/src/components';
import { RecentActivity } from '@/app/(pwa)/_components/RecentActivity';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Get roles from user (hydrated by AuthProvider from session)
  const userRoles = (user as any)?.roles || [];

  const quickActions = [
    {
      title: 'Start Discussion',
      description: 'Share insights with the community',
      href: '/pwa/discussions',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      color: 'bg-blue-500'
    },
    {
      title: 'Browse Events',
      description: 'Find networking opportunities',
      href: '/pwa/events',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-green-500'
    },
    {
      title: 'Read Articles',
      description: 'Explore latest legal insights',
      href: '#',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'bg-purple-500'
    },
    {
      title: 'Update Profile',
      description: 'Keep your info current',
      href: '/pwa/profile',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-4">
          <UserAvatar
            name={user?.name}
            email={user?.email}
            image={user?.image}
            roles={userRoles}
            size="lg"
            showBadge={true}
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Hello, {user?.name?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Ready to perform your civic duty?
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow block"
            >
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white mb-3 mx-auto`}>
                {action.icon}
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                {action.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity limit={5} />

      {/* Stats Overview */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Your Stats
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Discussions</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">8</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Events</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">24</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Articles</div>
          </div>
        </div>
      </div>
    </div>
  );
}