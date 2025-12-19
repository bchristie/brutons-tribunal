'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useScroll } from '@/app/(web)/_providers';
import { useAuth } from '@/src/providers/AuthProvider';
import { UserAvatar } from '@/src/components';
import type { UserDropdownProps, UserMenuItemProps } from './UserDropdown.types';
import { useMobileDetection } from '@/src/hooks';

function UserMenuItem({ icon, label, href, onClick, variant = 'default' }: UserMenuItemProps) {
  const baseClasses = `
    flex items-center space-x-3 px-4 py-2 text-sm
    transition-colors duration-200 w-full text-left
  `;
  
  const variantClasses = variant === 'danger' 
    ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700';

  const content = (
    <>
      {icon && <span className="w-4 h-4 flex-shrink-0">{icon}</span>}
      <span>{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${baseClasses} ${variantClasses}`}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
      {content}
    </button>
  );
}

export function UserDropdown({ 
  variant = 'auto',
  className = '' 
}: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { headerVariant } = useScroll();
  const { user, isAuthenticated, isAdmin, isLoading, signIn, signOut } = useAuth();
  const { isMobile } = useMobileDetection();
  
  const currentVariant = variant === 'auto' ? headerVariant : variant;
  const isOverlay = currentVariant === 'overlay';

  // Get user roles for avatar
  const userRoles = (user as any)?.roles || [];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  if (isLoading) {
    // Show loading state
    return (
      <div className="hidden md:block">
        <div className={`
          w-8 h-8 rounded-full animate-pulse
          ${isOverlay ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'}
        `} />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Show login button when not authenticated
    return (
      <div className="hidden md:block">
        <button
          onClick={() => signIn()}
          className={`
            text-sm font-medium transition-colors duration-200 cursor-pointer
            ${isOverlay 
              ? 'text-white hover:text-gray-200' 
              : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
            }
          `}
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="hidden md:block relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 transition-colors duration-200
          ${isOverlay 
            ? 'text-white hover:text-gray-200' 
            : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
          }
          focus:outline-none rounded-lg p-1
          ${isOpen 
            ? isOverlay 
              ? 'bg-white/10' 
              : 'bg-gray-100 dark:bg-gray-700'
            : 'hover:bg-white/5 hover:bg-gray-50 dark:hover:bg-gray-700'
          }
        `}
        aria-expanded={isOpen}
        aria-label="User menu"
      >
        {/* User Avatar */}
        <UserAvatar
          name={user.name}
          email={user.email}
          image={user.image}
          roles={userRoles}
          size="sm"
          showBadge={true}
        />

        {/* Dropdown Arrow */}
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="
          absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-lg shadow-lg z-50
          py-1
        ">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user.name || 'User'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-1">            
            {isMobile ? (
              <>
                <UserMenuItem
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                  label="Dashboard"
                  href="/pwa/dashboard"
                />

                <UserMenuItem
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                  label="Profile"
                  href="/pwa/profile"
                />
              </>
            ) : (
              <UserMenuItem
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                }
                label="Go Mobile"
                href="/mobile"
              />
            )}
            
            {isAdmin && (
              <UserMenuItem
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
                label="Admin"
                href="/admin"
              />
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
            
            <UserMenuItem
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              }
              label="Sign Out"
              onClick={async () => {
                setIsOpen(false);
                await signOut();
              }}
              variant="danger"
            />
          </div>
        </div>
      )}
    </div>
  );
}