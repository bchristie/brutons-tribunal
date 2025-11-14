'use client';

import { useAuth } from '@/src/providers/AuthProvider';
import Link from 'next/link';

export default function PWAHomePage() {
  const { user, isAuthenticated, isLoading, signIn } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="px-4 pt-12 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to<br />Bruton's Tribunal
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Your mobile hub for legal insights, community discussions, and professional networking.
          </p>
        </div>

        {/* Auth Status Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          {isAuthenticated && user ? (
            <div className="text-center">
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
                href="/pwa/dashboard"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Join the Community
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Sign in to access personalized content, participate in discussions, and connect with legal professionals.
              </p>
              <button
                onClick={() => signIn('/pwa/dashboard')}
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Public Content Preview */}
      <div className="px-4 pb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Latest Updates
        </h3>
        
        {/* Sample content cards */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              New Case Study Published
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Explore our latest analysis of landmark legal decisions...
            </p>
            <Link 
              href="/pwa/join"
              className="text-blue-600 dark:text-blue-400 text-sm font-medium"
            >
              Sign in to read more →
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Community Discussion: Ethics in AI
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Join the conversation about artificial intelligence in legal practice...
            </p>
            <Link 
              href="/pwa/join"
              className="text-blue-600 dark:text-blue-400 text-sm font-medium"
            >
              Join the discussion →
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Upcoming Events
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Don't miss our virtual networking session this Friday...
            </p>
            <Link 
              href="/pwa/join"
              className="text-blue-600 dark:text-blue-400 text-sm font-medium"
            >
              RSVP required →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Hint */}
      {!isAuthenticated && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Ready to unlock the full experience?
            </p>
            <button
              onClick={() => signIn('/pwa/dashboard')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </div>
  );
}