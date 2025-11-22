'use client';

import { useMobileDetection } from '@/src/hooks/useMobileDetection';
import { DashboardStatProps } from './DashboardStats.types';

/**
 * Dashboard Stat Card
 * Individual stat card that adapts to mobile/desktop
 * Mobile: Compact with just number and label
 * Desktop: Expanded with icon, title, and optional subtext
 */
export function DashboardStat({ label, value, icon, subtext, color = 'gray' }: DashboardStatProps) {
  const { isMobile } = useMobileDetection();

  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    green: 'text-green-600 dark:text-green-400',
    gray: 'text-gray-600 dark:text-gray-400',
  };

  const subtextColorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    green: 'text-green-600 dark:text-green-400',
    gray: 'text-gray-600 dark:text-gray-400',
  };

  if (isMobile) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className={`text-2xl font-bold ${colorClasses[color]}`}>
          {value}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">{label}</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      {icon && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {label}
          </h3>
          <span className="text-2xl">{icon}</span>
        </div>
      )}
      {!icon && (
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
          {label}
        </h3>
      )}
      <div className="text-3xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
      {subtext && (
        <p className={`text-sm ${subtextColorClasses[color]} mt-2`}>
          {subtext}
        </p>
      )}
    </div>
  );
}
