'use client';

import Link from 'next/link';
import { FaBullhorn, FaChartSimple, FaGear, FaUserGroup, FaUserLock } from 'react-icons/fa6';
import { useMobileDetection } from '@/src/hooks/useMobileDetection';
import { useAuth } from '@/src/providers';
import { UserAvatar } from '@/src/components';
import { usePathname } from 'next/navigation';
import { AdminShellProps } from './AdminShell.types';
import { useState, useRef, useEffect } from 'react';

/**
 * AdminShell Component
 * Provides the navigation shell for admin pages (sidebar or bottom nav)
 * - Mobile: Bottom navigation + header
 * - Desktop: Sidebar navigation
 */
export function AdminShell({ children }: AdminShellProps) {
  const { isMobile, windowWidth } = useMobileDetection();
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: <FaChartSimple /> },
    { href: '/admin/users', label: 'Users', icon: <FaUserGroup /> },
    //{ href: '/admin/roles', label: 'Roles', icon: <FaUserLock /> },
    { href: '/admin/updates', label: 'Updates', icon: <FaBullhorn /> },
    { href: '/admin/settings', label: 'Settings', icon: <FaGear /> },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Show full-screen loading state until device type is determined
  if (windowWidth === undefined) {
    return (
      <div className="flex items-center justify-center h-dvh bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex flex-col h-dvh">
        {/* Mobile Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin</h1>
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="focus:outline-none"
              >
                <UserAvatar
                  name={user.name}
                  email={user.email}
                  image={user.image}
                  roles={(user as any).roles}
                  size="sm"
                  showBadge={true}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  <Link
                    href="/"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Return to Site
                  </Link>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      signOut('/');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Mobile Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-2 py-2">
          <div className="flex justify-around">
            {navItems.slice(0, 4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center px-3 py-2 rounded-lg text-xs ${
                  pathname === item.href
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <span className="text-xl mb-1">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === item.href
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Info Footer */}
        {user && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <UserAvatar
                name={user.name}
                email={user.email}
                image={user.image}
                roles={(user as any).roles}
                size="md"
                showBadge={true}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <Link
              href="/"
              className="mt-3 block text-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              Back to Site
            </Link>
          </div>
        )}
      </aside>

      {/* Desktop Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
