'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useAuth } from '@/src/providers/AuthProvider';
import type { MobileMenuDrawerProps } from './Navigation.types';

// Helper function to get user initials
function getUserInitials(name: string | null): string {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function MobileMenuDrawer({ 
  items, 
  isOpen, 
  onClose 
}: MobileMenuDrawerProps) {
  const { user, isAuthenticated, isLoading, signIn, signOut } = useAuth();

  // Get user initials for display
  const userInitials = user ? getUserInitials(user.name) : 'U';
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Drawer */}
      <div
        className={`
          fixed top-0 left-0 h-full w-80 max-w-[80vw] bg-theme-primary 
          z-50 md:hidden transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col shadow-xl
        `}
        aria-hidden={!isOpen}
      >
        {/* Fixed Logo Area */}
        <div className="flex items-center justify-between p-6 border-b border-theme-primary">
          <Link 
            href="/"
            onClick={onClose}
            className="text-xl font-bold text-theme-primary"
          >
            Bruton's Tribunal
          </Link>
        </div>

        {/* Scrollable Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-6">
          <div className="space-y-2 px-6">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="
                  flex items-center space-x-3 p-3 rounded-lg
                  text-theme-primary
                  hover:bg-theme-secondary
                  transition-colors duration-200
                  text-base font-medium
                "
              >
                {item.icon && (
                  <span className="w-5 h-5 flex-shrink-0">
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Fixed Bottom Action Area */}
        <div className="p-6 border-t border-theme-primary bg-theme-secondary">
          {isLoading ? (
            // Loading state
            <div className="flex items-center space-x-3 p-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
              </div>
            </div>
          ) : !isAuthenticated || !user ? (
            // Not authenticated - show sign in
            <div className="space-y-3">
              <button
                onClick={() => {
                  onClose();
                  signIn();
                }}
                className="
                  w-full p-3 text-center rounded-lg
                  bg-blue-600 hover:bg-blue-700 text-white font-medium
                  transition-colors duration-200
                  text-sm
                "
              >
                Sign In
              </button>
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                Access your account and personalized features
              </p>
            </div>
          ) : (
            // Authenticated - show user info and actions
            <div className="space-y-4">
              {/* User Info */}
              <div className="flex items-center space-x-3 p-3 bg-theme-primary rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 flex items-center justify-center font-medium text-sm">
                  {user.image ? (
                    <img 
                      src={user.image} 
                      alt={user.name || 'User avatar'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    userInitials
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-theme-primary truncate">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link
                  href="/profile"
                  onClick={onClose}
                  className="
                    w-full p-3 text-left rounded-lg flex items-center space-x-3
                    text-gray-700 dark:text-gray-300
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    transition-colors duration-200
                    text-sm
                  "
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={onClose}
                  className="
                    w-full p-3 text-left rounded-lg flex items-center space-x-3
                    text-gray-700 dark:text-gray-300
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    transition-colors duration-200
                    text-sm
                  "
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Settings</span>
                </Link>

                <button
                  onClick={async () => {
                    onClose();
                    await signOut();
                  }}
                  className="
                    w-full p-3 text-left rounded-lg flex items-center space-x-3
                    text-red-600 dark:text-red-400
                    hover:bg-red-50 dark:hover:bg-red-900/20
                    transition-colors duration-200
                    text-sm font-medium
                  "
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}