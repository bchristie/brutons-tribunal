'use client';

import { useAuth } from '@/src/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdDashboard, MdForum, MdEvent, MdPerson } from 'react-icons/md';

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/pwa/join');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/pwa/dashboard',
      icon: <MdDashboard className="w-6 h-6" />
    },
    {
      name: 'Discussions',
      href: '/pwa/discussions',
      icon: <MdForum className="w-6 h-6" />
    },
    {
      name: 'Events',
      href: '/pwa/events',
      icon: <MdEvent className="w-6 h-6" />
    },
    {
      name: 'Profile',
      href: '/pwa/profile',
      icon: <MdPerson className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Content Area - Takes up available space above bottom nav */}
      <div className="flex-1 pb-16 overflow-y-auto">
        {children}
      </div>

      {/* Bottom Navigation - Fixed at bottom */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
        <div className="grid grid-cols-4 h-16">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex flex-col items-center justify-center space-y-1 transition-colors
                  ${isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                  }
                `}
              >
                <div className={`${isActive ? 'scale-110' : ''} transition-transform`}>
                  {item.icon}
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}