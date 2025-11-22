'use client';

import { useMobileDetection } from '@/src/hooks/useMobileDetection';
import { DashboardWelcomeProps } from './DashboardWelcome.types';

/**
 * DashboardWelcome Component
 * Welcome header that adapts to mobile/desktop layouts
 */
export function DashboardWelcome({ userName }: DashboardWelcomeProps) {
  const { isMobile } = useMobileDetection();

  if (isMobile) {
    return (
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Dashboard
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Welcome back, {userName}
        </p>
      </div>
    );
  }

  // Desktop
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Dashboard
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Welcome back, {userName}
      </p>
    </div>
  );
}
