import Link from 'next/link';
import type { AuthenticatedWelcomeProps } from './AuthenticatedWelcome.types';

export function AuthenticatedWelcome({ 
  user, 
  className = '',
  dashboardHref = '/pwa/dashboard' 
}: AuthenticatedWelcomeProps) {
  return (
    <div className={`text-center ${className}`}>
      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
        {user.image ? (
          <img 
            src={user.image} 
            alt={user.name || 'User avatar'}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <span className="text-xl font-semibold text-blue-600 dark:text-blue-300">
            {user.name?.charAt(0) || 'U'}
          </span>
        )}
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Welcome back, {user.name || 'User'}!
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Ready to dive into your personalized experience?
      </p>
      <Link
        href={dashboardHref}
        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}