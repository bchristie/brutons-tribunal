import Link from 'next/link';
import { UserAvatar } from '@/src/components';
import { useAuth } from '@/src/providers/AuthProvider';
import type { AuthenticatedWelcomeProps } from './AuthenticatedWelcome.types';

export function AuthenticatedWelcome({ 
  user, 
  className = '',
  dashboardHref = '/pwa/dashboard' 
}: AuthenticatedWelcomeProps) {
  // Get roles from user (hydrated by AuthProvider from session)
  const { isAdmin, userRoles } = useAuth();

  return (
    <div className={`text-center ${className}`}>
      <p>{userRoles}</p>
      <UserAvatar
        name={user.name}
        email={user.email}
        image={user.image}
        roles={userRoles ?? undefined}
        size="lg"
        showBadge={true}
        className="mx-auto mb-4"
      />
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Welcome back, {user.name || 'User'}!
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Ready to dive into your personalized experience?
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link
          href={dashboardHref}
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Dashboard
        </Link>
        {isAdmin && (
          <Link
            href="/admin"
            className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
          >
            Admin Portal
          </Link>
        )}
      </div>
    </div>
  );
}